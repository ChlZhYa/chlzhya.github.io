export const maximumEntries = 10000;
const kinds = new Set(["log", "essay"]);
const categories = new Set([
  "AI / Agent", "开发", "阅读", "生活", "其他", "灵感", "学习",
]);

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
