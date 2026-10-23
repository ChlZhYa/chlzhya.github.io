import test from "node:test";
import assert from "node:assert/strict";
import { maximumEntries, parseSnapshot } from "../dist/entry-model.js";

const firstId = "local-00000000-0000-0000-0000-000000000001";
const timestamp = "2026-10-23T01:00:00.000Z";
const baseEntry = {
  id: firstId, kind: "log", title: "旧标题", date: "2026-10-21",
  category: "AI / Agent", tags: ["旧标签"], body: "旧正文", updatedAt: timestamp,
};

test("v1 snapshots retain legacy categories and reject invalid or duplicate records", () => {
  const source = JSON.stringify({ version: 1, entries: [baseEntry] });
  assert.deepEqual(parseSnapshot(source).entries, [baseEntry]);
  assert.deepEqual(parseSnapshot(null), { version: 1, entries: [] });
  assert.throws(() => parseSnapshot("{"), { code: "snapshot" });
  assert.throws(() => parseSnapshot(JSON.stringify({ version: 2, entries: [] })), { code: "snapshot" });
  assert.throws(() => parseSnapshot(JSON.stringify({ version: 1, entries: [baseEntry, baseEntry] })), { code: "snapshot" });
});

test("a full snapshot still reads back and malformed records are rejected", () => {
  const full = {
    version: 1,
    entries: Array.from({ length: maximumEntries }, (_, i) => ({
      ...baseEntry,
      id: `local-00000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`,
    })),
  };
  assert.equal(parseSnapshot(JSON.stringify(full)).entries.length, maximumEntries);
  for (const broken of [
    { ...baseEntry, id: "local-not-a-uuid" },
    { ...baseEntry, date: "2026-02-30" },
    { ...baseEntry, title: "  " },
    { ...baseEntry, tags: ["", "标签"] },
  ]) {
    assert.throws(
      () => parseSnapshot(JSON.stringify({ version: 1, entries: [broken] })),
      { code: "snapshot" },
    );
  }
});
