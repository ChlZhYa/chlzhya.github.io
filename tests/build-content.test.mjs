import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseFrontmatter,
  entryFromMarkdown,
  validDate,
  renderPublishedJs,
  build,
  escapeJsString,
} from "../scripts/build-content.mjs";

test("parseFrontmatter reads simple YAML-like keys and body", () => {
  const raw = `---
title: 你好
date: 2026-10-27
category: 生活
tags: [a, b]
updatedAt: 2026-10-27T09:00:00.000Z
id: hello-note
---
第一行

第二行
`;
  const { meta, body } = parseFrontmatter(raw);
  assert.equal(meta.title, "你好");
  assert.equal(meta.date, "2026-10-27");
  assert.equal(meta.category, "生活");
  assert.deepEqual(meta.tags, ["a", "b"]);
  assert.equal(meta.id, "hello-note");
  assert.equal(body, "第一行\n\n第二行\n");
});

test("validDate rejects impossible calendar days", () => {
  assert.equal(validDate("2026-10-27"), true);
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("2026/10/27"), false);
});

test("entryFromMarkdown defaults id and updatedAt from filename/date", () => {
  const raw = `---
title: 短记
date: 2026-10-01
category: 灵感
---
正文内容
`;
  const entry = entryFromMarkdown(raw, { kind: "log", filename: "short-note.md" });
  assert.equal(entry.id, "short-note");
  assert.equal(entry.kind, "log");
  assert.equal(entry.updatedAt, "2026-10-01T09:00:00.000Z");
  assert.deepEqual(entry.tags, []);
  assert.equal(entry.body, "正文内容");
});

test("entryFromMarkdown requires title date category", () => {
  assert.throws(
    () =>
      entryFromMarkdown(
        `---
date: 2026-10-01
category: 生活
---
x
`,
        { kind: "log", filename: "x.md" },
      ),
    /title/,
  );
});

test("escapeJsString and renderPublishedJs are safe for quotes and backticks", () => {
  const escaped = escapeJsString('say "hi" and `code` and ${x}');
  assert.equal(JSON.parse(escaped), 'say "hi" and `code` and ${x}');
  const js = renderPublishedJs([
    {
      id: "t1",
      kind: "log",
      title: '引号"测试',
      date: "2026-10-27",
      category: "生活",
      tags: ["标签"],
      updatedAt: "2026-10-27T09:00:00.000Z",
      body: "line1\nline2 with `ticks` and ${oops}",
    },
  ]);
  assert.match(js, /export const publishedEntries = Object\.freeze\(\[/);
  assert.match(js, /Object\.freeze/);
});

test("build writes empty published.js and loads markdown from folders", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "build-content-"));
  try {
    fs.mkdirSync(path.join(tmp, "dist"));
    fs.mkdirSync(path.join(tmp, "content", "flow"), { recursive: true });
    fs.mkdirSync(path.join(tmp, "content", "essays"), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, "content", "README.md"),
      "# skip me\n",
      "utf8",
    );
    const { count } = build(tmp);
    assert.equal(count, 0);
    const empty = fs.readFileSync(path.join(tmp, "dist", "published.js"), "utf8");
    assert.equal(empty, "export const publishedEntries = Object.freeze([]);\n");

    fs.writeFileSync(
      path.join(tmp, "content", "flow", "alpha.md"),
      `---
title: Alpha
date: 2026-10-20
category: 生活
---
flow body
`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(tmp, "content", "essays", "beta.md"),
      `---
title: Beta
date: 2026-10-25
category: 学习
tags: [长文]
id: beta-essay
---
essay body
`,
      "utf8",
    );
    const second = build(tmp);
    assert.equal(second.count, 2);
    const out = fs.readFileSync(path.join(tmp, "dist", "published.js"), "utf8");
    // date desc: beta (10-25) before alpha (10-20)
    const betaPos = out.indexOf('"beta-essay"');
    const alphaPos = out.indexOf('"alpha"');
    assert.ok(betaPos > 0 && alphaPos > betaPos);
    assert.match(out, /kind: "essay"/);
    assert.match(out, /kind: "log"/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
