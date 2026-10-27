#!/usr/bin/env node
/**
 * Build content/flow + content/essays markdown into dist/published.js
 * Zero dependencies — Node built-ins only.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outFile = path.join(root, "dist", "published.js");

const SOURCES = [
  { dir: path.join(root, "content", "flow"), kind: "log" },
  { dir: path.join(root, "content", "essays"), kind: "essay" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    throw new Error("missing frontmatter opening ---");
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    throw new Error("missing frontmatter closing ---");
  }
  const fmBlock = text.slice(3, end).replace(/^\r?\n/, "");
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const meta = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!m) {
      throw new Error(`invalid frontmatter line: ${line}`);
    }
    const key = m[1];
    let value = m[2].trim();
    if (key === "tags") {
      meta.tags = parseTags(value);
    } else {
      // strip optional surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  }
  return { meta, body };
}

function parseTags(value) {
  if (!value || value === "[]") return [];
  const bracket = value.match(/^\[(.*)\]$/);
  if (!bracket) {
    // single unbracketed tag
    const t = value.replace(/^["']|["']$/g, "").trim();
    return t ? [t] : [];
  }
  const inner = bracket[1].trim();
  if (!inner) return [];
  return inner.split(",").map((part) => {
    let t = part.trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      t = t.slice(1, -1);
    }
    return t.trim();
  }).filter(Boolean);
}

export function validDate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function entryFromMarkdown(raw, { kind, filename }) {
  const { meta, body } = parseFrontmatter(raw);
  const title = meta.title;
  const date = meta.date;
  const category = meta.category;
  if (!title || !String(title).trim()) {
    throw new Error(`${filename}: title is required`);
  }
  if (!validDate(date)) {
    throw new Error(`${filename}: date must be YYYY-MM-DD`);
  }
  if (!category || !String(category).trim()) {
    throw new Error(`${filename}: category is required`);
  }
  const id =
    (meta.id && String(meta.id).trim()) ||
    filename.replace(/\.md$/i, "");
  const updatedAt =
    (meta.updatedAt && String(meta.updatedAt).trim()) ||
    `${date}T09:00:00.000Z`;
  if (!Number.isFinite(Date.parse(updatedAt))) {
    throw new Error(`${filename}: updatedAt is not a valid ISO date`);
  }
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  return {
    id,
    kind,
    title: String(title).trim(),
    date,
    category: String(category).trim(),
    tags,
    updatedAt,
    body: body.replace(/\s+$/, ""),
  };
}

export function escapeJsString(value) {
  return JSON.stringify(String(value));
}

function formatEntry(entry) {
  const tags =
    entry.tags.length === 0
      ? "[]"
      : `[${entry.tags.map((t) => escapeJsString(t)).join(", ")}]`;
  // Prefer template literal for multi-line bodies when safe; fall back to JSON.
  const bodyLiteral = bodyToJsLiteral(entry.body);
  return `  {
    id: ${escapeJsString(entry.id)},
    kind: ${escapeJsString(entry.kind)},
    title: ${escapeJsString(entry.title)},
    date: ${escapeJsString(entry.date)},
    category: ${escapeJsString(entry.category)},
    tags: ${tags},
    updatedAt: ${escapeJsString(entry.updatedAt)},
    body: ${bodyLiteral},
  }`;
}

function bodyToJsLiteral(body) {
  // Always use JSON.stringify for safe escaping (handles backticks, ${}, etc.)
  return escapeJsString(body);
}

export function collectEntries(sources = SOURCES) {
  const entries = [];
  for (const { dir, kind } of sources) {
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md")
      .sort();
    for (const name of files) {
      const full = path.join(dir, name);
      const raw = fs.readFileSync(full, "utf8");
      entries.push(entryFromMarkdown(raw, { kind, filename: name }));
    }
  }
  entries.sort(
    (a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id),
  );
  // Detect duplicate ids
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e.id)) {
      throw new Error(`duplicate published id: ${e.id}`);
    }
    seen.add(e.id);
  }
  return entries;
}

export function renderPublishedJs(entries) {
  if (entries.length === 0) {
    return "export const publishedEntries = Object.freeze([]);\n";
  }
  return (
    "export const publishedEntries = Object.freeze([\n" +
    entries.map(formatEntry).join(",\n") +
    "\n]);\n"
  );
}

export function build(rootDir = root) {
  const sources = [
    { dir: path.join(rootDir, "content", "flow"), kind: "log" },
    { dir: path.join(rootDir, "content", "essays"), kind: "essay" },
  ];
  const entries = collectEntries(sources);
  const out = path.join(rootDir, "dist", "published.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, renderPublishedJs(entries), "utf8");
  return { out, count: entries.length };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const { out, count } = build();
  console.log(`Wrote ${count} published entr${count === 1 ? "y" : "ies"} → ${path.relative(root, out)}`);
}
