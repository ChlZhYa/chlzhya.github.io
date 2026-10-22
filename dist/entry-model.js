import { titleFromBody } from "./flow-model.js";

export const maximumEntries = 10000;
const kinds = new Set(["log", "essay"]);
const categories = new Set([
  "AI / Agent", "开发", "阅读", "生活", "其他", "灵感", "学习",
]);
const draftFields = ["kind", "title", "date", "category", "tags", "body"];
const scalarEntryFields = ["id", "kind", "title", "date", "category", "body", "updatedAt"];

export class EntryError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validDraft(draft) {
  return draft && typeof draft === "object" &&
    draftFields.every((field) => typeof draft[field] === "string") &&
    kinds.has(draft.kind) && categories.has(draft.category) &&
    (draft.date === "" || validDate(draft.date)) &&
    draft.title.length <= 100 && draft.tags.length <= 120 && draft.body.length <= 30000;
}

export function validEntry(entry) {
  return !!(
    entry && typeof entry === "object" && !Array.isArray(entry) &&
    typeof entry.id === "string" && /^local-[0-9a-f-]{36}$/.test(entry.id) &&
    kinds.has(entry.kind) &&
    typeof entry.title === "string" && entry.title.trim().length > 0 && entry.title.length <= 100 &&
    validDate(entry.date) && categories.has(entry.category) &&
    Array.isArray(entry.tags) && entry.tags.length <= 8 &&
    entry.tags.every((tag) => typeof tag === "string" && tag.trim() === tag && tag.length > 0 && tag.length <= 24) &&
    typeof entry.body === "string" && entry.body.trim().length > 0 && entry.body.length <= 30000 &&
    typeof entry.updatedAt === "string" && Number.isFinite(Date.parse(entry.updatedAt))
  );
}

export function parseSnapshot(raw) {
  if (raw === null) return { version: 1, entries: [] };
  let snapshot;
  try {
    snapshot = JSON.parse(raw);
  } catch {
    throw new EntryError("snapshot");
  }
  if (!snapshot || snapshot.version !== 1 || !Array.isArray(snapshot.entries) ||
      snapshot.entries.length > maximumEntries || !snapshot.entries.every(validEntry) ||
      new Set(snapshot.entries.map((entry) => entry.id)).size !== snapshot.entries.length)
    throw new EntryError("snapshot");
  return snapshot;
}

export function parseWriterSession(raw) {
  if (raw === null) return null;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    throw new EntryError("draft");
  }
  const session = saved?.session;
  if (saved?.version !== 1 || !session || typeof session !== "object" ||
      !["create", "edit"].includes(session.mode) || !session.draft ||
      !validDraft(session.draft) ||
      typeof session.touched !== "boolean" ||
      (session.mode === "create" && !session.touched) ||
      (session.mode === "edit" && (!validEntry(session.baseline) || session.id !== session.baseline.id)))
    throw new EntryError("draft");
  return session;
}

function entryFromDraft(draft, id, updatedAt) {
  const body = draft.body.trim();
  const title = draft.title.trim() || (draft.kind === "log" ? titleFromBody(body) : "");
  const tags = [...new Set(draft.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean))];
  const entry = { id, kind: draft.kind, title, date: draft.date,
    category: draft.category, tags, body, updatedAt };
  if (!validEntry(entry)) throw new EntryError("entry");
  return entry;
}

function sameEntry(a, b) {
  return !!a && !!b && scalarEntryFields.every((field) => a[field] === b[field]) &&
    a.tags.length === b.tags.length && a.tags.every((tag, index) => tag === b.tags[index]);
}

export function createEntry(snapshot, draft, id, updatedAt) {
  if (snapshot.entries.length >= maximumEntries) throw new EntryError("capacity");
  if (snapshot.entries.some((entry) => entry.id === id)) throw new EntryError("duplicate");
  const entry = entryFromDraft(draft, id, updatedAt);
  return { entry, snapshot: { version: 1, entries: [entry, ...snapshot.entries] } };
}

export function updateEntry(snapshot, draft, id, baseline, updatedAt) {
  const index = snapshot.entries.findIndex((entry) => entry.id === id);
  if (index < 0 || !sameEntry(snapshot.entries[index], baseline))
    throw new EntryError("conflict");
  const entry = entryFromDraft(draft, id, updatedAt);
  const entries = snapshot.entries.slice();
  entries[index] = { ...snapshot.entries[index], ...entry };
  return { entry: entries[index], snapshot: { version: 1, entries } };
}
