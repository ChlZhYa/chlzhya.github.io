export const flowCategories = Object.freeze(["全部", "灵感", "学习", "生活"]);
const legacyStudy = new Set(["AI / Agent", "开发", "阅读"]);
export function categoryGroup(category) {
  if (legacyStudy.has(category)) return "学习";
  return flowCategories.includes(category) ? category : "灵感";
}
export function monthDays(month) {
  const [year, number] = month.split("-").map(Number);
  return new Date(year, number, 0).getDate();
}
export function monthStartWeekday(month) {
  const [year, number] = month.split("-").map(Number);
  return (new Date(year, number - 1, 1).getDay() + 6) % 7;
}
export function shiftMonth(month, offset) {
  const [year, number] = month.split("-").map(Number);
  const next = new Date(year, number - 1 + offset, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}
export function titleFromBody(body) {
  const line =
    body
      .split(/\r?\n/)
      .map((part) => part.trim())
      .find(Boolean) ?? "";
  return Array.from(line).slice(0, 48).join("");
}
export function readingBody(entry) {
  const text = entry.body.trim();
  const firstLine = text.split(/\r?\n/)[0];
  return entry.kind === "log" && firstLine === entry.title
    ? text.slice(firstLine.length).trim()
    : text;
}
export function selectFlow(entries, state) {
  const logs = entries.filter((entry) => entry.kind === "log");
  const activity = new Map();
  for (const entry of logs) {
    if (entry.date.startsWith(state.month))
      activity.set(entry.date, (activity.get(entry.date) ?? 0) + 1);
  }
  const matching = logs.filter(
    (entry) =>
      (state.allTime || entry.date.startsWith(state.month)) &&
      (!state.selectedDate || entry.date === state.selectedDate) &&
      (state.category === "全部" ||
        categoryGroup(entry.category) === state.category),
  );
  return {
    activity,
    total: matching.length,
    featured: matching.slice(0, Math.min(5, state.visibleCount)),
    remaining: matching.slice(5, state.visibleCount),
    hasMore: matching.length > state.visibleCount,
  };
}
