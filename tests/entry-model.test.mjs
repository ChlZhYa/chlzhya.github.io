import test from "node:test";
import assert from "node:assert/strict";
import {
  createEntry, maximumEntries, parseSnapshot, parseWriterSession, updateEntry,
} from "../dist/entry-model.js";

const firstId = "local-00000000-0000-0000-0000-000000000001";
const secondId = "local-00000000-0000-0000-0000-000000000002";
const timestamp = "2026-10-23T01:00:00.000Z";
const baseEntry = {
  id: firstId, kind: "log", title: "旧标题", date: "2026-10-21",
  category: "AI / Agent", tags: ["旧标签"], body: "旧正文", updatedAt: timestamp,
};
const draft = {
  kind: "log", title: "", date: "2026-10-23", category: "灵感",
  tags: "新标签，新标签", body: " 第一行\n第二行 ",
};

test("v1 snapshots retain legacy categories and reject invalid or duplicate records", () => {
  const source = JSON.stringify({ version: 1, entries: [baseEntry] });
  assert.deepEqual(parseSnapshot(source).entries, [baseEntry]);
  assert.deepEqual(parseSnapshot(null), { version: 1, entries: [] });
  assert.throws(() => parseSnapshot("{"), { code: "snapshot" });
  assert.throws(() => parseSnapshot(JSON.stringify({ version: 2, entries: [] })), { code: "snapshot" });
  assert.throws(() => parseSnapshot(JSON.stringify({ version: 1, entries: [baseEntry, baseEntry] })), { code: "snapshot" });
});

test("create preserves newer unrelated records, derives a Flow title, and enforces capacity before write", () => {
  const unrelated = { ...baseEntry, id: secondId, body: "另一个标签页刚写下的内容" };
  const result = createEntry({ version: 1, entries: [unrelated] }, draft, firstId, timestamp);
  assert.deepEqual(result.snapshot.entries[1], unrelated);
  assert.equal(result.entry.title, "第一行");
  assert.equal(result.entry.body, "第一行\n第二行");
  assert.deepEqual(result.entry.tags, ["新标签"]);
  assert.throws(() => createEntry({ version: 1, entries: [unrelated] }, draft, secondId, timestamp), { code: "duplicate" });
  const full = { version: 1, entries: Array.from({ length: maximumEntries }, () => unrelated) };
  assert.throws(() => createEntry(full, draft, firstId, timestamp), { code: "capacity" });
});

test("edit keeps identity, merges unrelated changes, and detects every changed field", () => {
  const other = { ...baseEntry, id: secondId, body: "另一个标签页更新了别的记录" };
  const latest = { version: 1, entries: [baseEntry, other] };
  const result = updateEntry(latest, draft, firstId, baseEntry, "2026-10-23T02:00:00.000Z");
  assert.equal(result.snapshot.entries.length, 2);
  assert.equal(result.entry.id, firstId);
  assert.equal(result.entry.title, "第一行");
  assert.deepEqual(result.snapshot.entries[1], other);
  const reordered = Object.fromEntries(Object.entries(baseEntry).reverse());
  assert.equal(updateEntry({ version: 1, entries: [reordered] }, draft, firstId, baseEntry, timestamp).entry.id, firstId);
  for (const changed of [
    { title: "别人写的标题" }, { date: "2026-10-22" }, { category: "生活" },
    { tags: ["别的标签"] }, { body: "别人写的正文" },
    { updatedAt: "2026-10-23T02:00:00.000Z" },
  ]) {
    const snapshot = { version: 1, entries: [{ ...baseEntry, ...changed }, other] };
    assert.throws(() => updateEntry(snapshot, draft, firstId, baseEntry, timestamp), { code: "conflict" });
  }
  assert.throws(() => updateEntry({ version: 1, entries: [other] }, draft, firstId, baseEntry, timestamp), { code: "conflict" });
});

test("article title is required and partial raw drafts survive independently from entry validation", () => {
  assert.throws(() => createEntry({ version: 1, entries: [] }, { ...draft, kind: "essay" }, firstId, timestamp), { code: "entry" });
  const incomplete = { mode: "create", touched: true, draft: { ...draft, date: "", body: "", title: "" } };
  assert.deepEqual(parseWriterSession(JSON.stringify({ version: 1, session: incomplete })), incomplete);
  const edit = { mode: "edit", touched: false, id: firstId, baseline: baseEntry, draft: incomplete.draft };
  assert.deepEqual(parseWriterSession(JSON.stringify({ version: 1, session: edit })), edit);
  assert.throws(() => parseWriterSession("not json"), { code: "draft" });
  assert.throws(() => parseWriterSession(JSON.stringify({ version: 1, session: { ...edit, id: secondId } })), { code: "draft" });
  assert.throws(() => parseWriterSession(JSON.stringify({ version: 1, session: { ...incomplete, draft: { ...draft, date: "broken" } } })), { code: "draft" });
  assert.throws(() => parseWriterSession(JSON.stringify({ version: 1, session: { ...incomplete, draft: { ...draft, body: "字".repeat(30001) } } })), { code: "draft" });
});
