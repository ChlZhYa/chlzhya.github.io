import test from "node:test";
import assert from "node:assert/strict";
import {
  categoryGroup,
  monthDays,
  selectFlow,
  shiftMonth,
  titleFromBody,
} from "../dist/flow-model.js";

test("month navigation crosses years and uses the real leap-day length", () => {
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(monthDays("2024-02"), 29);
  assert.equal(monthDays("2026-02"), 28);
});

test("legacy categories are visible under 学习", () => {
  for (const category of ["AI / Agent", "开发", "阅读", "学习"])
    assert.equal(categoryGroup(category), "学习");
});

test("date and category intersect, with activity counted before pagination", () => {
  const entries = [
    { kind: "log", date: "2026-10-22", category: "灵感" },
    { kind: "log", date: "2026-10-22", category: "开发" },
    { kind: "log", date: "2026-10-21", category: "学习" },
    { kind: "log", date: "2026-09-22", category: "灵感" },
    { kind: "essay", date: "2026-10-22", category: "灵感" },
  ];
  const state = {
    month: "2026-10",
    selectedDate: "2026-10-22",
    category: "学习",
    visibleCount: 1,
    allTime: false,
  };
  const selection = selectFlow(entries, state);
  assert.equal(selection.total, 1);
  assert.equal(selection.featured.length, 1);
  assert.equal(selection.activity.get("2026-10-22"), 2);
  assert.equal(selection.activity.get("2026-10-21"), 1);
  assert.equal(selection.activity.has("2026-09-22"), false);
  assert.equal(selectFlow(entries, { ...state, selectedDate: null }).total, 2);
  assert.equal(
    selectFlow(entries, {
      ...state,
      selectedDate: null,
      allTime: true,
      category: "灵感",
    }).total,
    2,
  );
});

test("body-first title uses the first nonempty line and is bounded", () => {
  assert.equal(titleFromBody("\n  一闪而过的念头  \n后续"), "一闪而过的念头");
  assert.equal(Array.from(titleFromBody("想".repeat(80))).length, 48);
});
