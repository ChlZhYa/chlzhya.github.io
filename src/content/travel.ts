/**
 * Journey 旅行数据 — 行程 + 照片记录。
 *
 * 简单直给：一次旅行 = 一个 trip，带日期、地点、简介、照片集。
 * 不做坐标/地形/探险那套。以下为示例占位，后续替换为真实行程。
 */

export type Photo = {
  id: string;
  /** 图片地址（占位用 picsum，真实内容替换为本地 /public/photos 或外链） */
  src: string;
  /** 简短图说 */
  caption?: string;
};

export type Trip = {
  id: string;
  /** slug，用于 /journey/[slug] 详情页 */
  slug: string;
  /** 行程名 */
  title: string;
  /** 地点（可多个，逗号分隔） */
  places: string;
  /** 时间段 */
  period: string;
  /** 一句话简介 */
  summary: string;
  /** 行程天数 */
  days: number;
  /** 封面图（与照片集第一张可不同） */
  cover: string;
  /** 照片集 */
  photos: Photo[];
  /** 按天的行程要点（可选，时间线展示） */
  itinerary?: { day: number; title: string; note?: string }[];
};

export const trips: Trip[] = [
  {
    id: "t1",
    slug: "hokkaido-winter",
    title: "Hokkaido · Winter",
    places: "Sapporo, Otaru, Furano",
    period: "2025 · Feb",
    summary: "雪国的安静与暖灯，一次极寒里的慢行。",
    days: 7,
    cover:
      "https://picsum.photos/seed/hokkaido-cover/1200/800",
    photos: [
      { id: "p1", src: "https://picsum.photos/seed/hk1/800/1000", caption: "运河边的雪堆" },
      { id: "p2", src: "https://picsum.photos/seed/hk2/800/600", caption: "清晨的札幌街角" },
      { id: "p3", src: "https://picsum.photos/seed/hk3/800/800" },
      { id: "p4", src: "https://picsum.photos/seed/hk4/600/800", caption: "富良野的雪原" },
      { id: "p5", src: "https://picsum.photos/seed/hk5/800/600" },
      { id: "p6", src: "https://picsum.photos/seed/hk6/700/900" },
    ],
    itinerary: [
      { day: 1, title: "Sapporo 抵达", note: "大通公园的雪祭灯光。" },
      { day: 3, title: "Otaru 运河", note: "傍晚的煤气灯与雪。" },
      { day: 5, title: "Furano 雪原", note: "一整天的白。" },
    ],
  },
  {
    id: "t2",
    slug: "yunnan-spring",
    title: "Yunnan · Spring",
    places: "Dali, Lijiang, Shangri-La",
    period: "2024 · Apr",
    summary: "从苍山洱海到雪山草甸，一路往高走。",
    days: 9,
    cover:
      "https://picsum.photos/seed/yunnan-cover/1200/800",
    photos: [
      { id: "p1", src: "https://picsum.photos/seed/yn1/800/600", caption: "洱海的晨雾" },
      { id: "p2", src: "https://picsum.photos/seed/yn2/700/900", caption: "古城的瓦顶" },
      { id: "p3", src: "https://picsum.photos/seed/yn3/800/800" },
      { id: "p4", src: "https://picsum.photos/seed/yn4/800/600", caption: "雪山下的草甸" },
      { id: "p5", src: "https://picsum.photos/seed/yn5/600/800" },
    ],
    itinerary: [
      { day: 1, title: "Dali 大理", note: "环洱海骑行。" },
      { day: 4, title: "Lijiang 丽江", note: "玉龙雪山远眺。" },
      { day: 7, title: "Shangri-La 香格里拉", note: "普达措的高原湖。" },
    ],
  },
  {
    id: "t3",
    slug: "iceland-ring",
    title: "Iceland · Ring Road",
    places: "Reykjavík, Vík, Akureyri",
    period: "2023 · Sep",
    summary: "环岛公路、黑沙滩与极光，荒原上的公路片。",
    days: 12,
    cover:
      "https://picsum.photos/seed/iceland-cover/1200/800",
    photos: [
      { id: "p1", src: "https://picsum.photos/seed/ic1/800/600", caption: "黑沙滩的浪" },
      { id: "p2", src: "https://picsum.photos/seed/ic2/700/900", caption: "瀑布与彩虹" },
      { id: "p3", src: "https://picsum.photos/seed/ic3/800/800" },
      { id: "p4", src: "https://picsum.photos/seed/ic4/800/600", caption: "极光夜" },
    ],
    itinerary: [
      { day: 1, title: "Reykjavík 出发", note: "黄金圈三连。" },
      { day: 5, title: "Vík 南岸", note: "黑沙滩与冰河湖。" },
      { day: 9, title: "Akureyri 北部", note: "观鲸与峡谷。" },
    ],
  },
];

/** 获取单个 trip（供详情页服务端使用） */
export function getTrip(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
