export type TripStatus = "complete" | "placeholder";

export interface TripItineraryItem {
  day: string;
  title: string;
  detail: string;
}

export interface TripDestination {
  city: string;
  note: string;
  accent: "cyan" | "lime" | "coral";
}

export interface TripGalleryItem {
  title: string;
  src: string;
}

export interface Trip {
  /** 路由 slug，用于 /travel/:slug 详情页 */
  slug: string;
  /** 时间标签，如「下一次旅行」「2025 秋」 */
  period: string;
  /** 旅行标题 */
  title: string;
  /** 一句话简介 */
  summary: string;
  /** 卡片封面图 */
  cover: string;
  /** complete = 有完整行程；placeholder = 仅封面与简介 */
  status: TripStatus;
  /** 路线站点（可选，placeholder 卡片可为空） */
  routeStops?: string[];
  /** 行程时间线（可选） */
  itinerary?: TripItineraryItem[];
  /** 目的地卡片（可选） */
  destinations?: TripDestination[];
  /** 相册（可选） */
  gallery?: TripGalleryItem[];
}

// 旅行集合：每一项都是旅行网格里的一张卡片。
// status = "complete" 的旅行可点开查看完整行程；"placeholder" 仅作归档占位，待补充真实内容。
export const trips: Trip[] = [
  {
    slug: "kansai",
    period: "下一次旅行",
    title: "关西慢行计划",
    summary: "以京都、奈良、大阪为主线，保留机动时间，减少重复换乘和高强度打卡。",
    cover:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    status: "complete",
    routeStops: ["上海", "京都", "奈良", "大阪"],
    itinerary: [
      {
        day: "第 01 天",
        title: "抵达与入住",
        detail: "完成交通、入住和周边熟悉，把第一天控制在低消耗范围内。",
      },
      {
        day: "第 02 天",
        title: "京都核心路线",
        detail: "围绕老街、书店、庭院和咖啡馆安排一整天，减少跨区移动。",
      },
      {
        day: "第 03 天",
        title: "城市切换",
        detail: "通过列车在城市之间移动，预留临时调整和备用路线。",
      },
    ],
    destinations: [
      { city: "京都", note: "老街、庭院、书店", accent: "cyan" },
      { city: "奈良", note: "公园、神社、短途停留", accent: "lime" },
      { city: "大阪", note: "餐食、交通和夜间路线", accent: "coral" },
    ],
    gallery: [
      {
        title: "安静街道",
        src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "列车光影",
        src: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "城市夜色",
        src: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "chuanxi",
    period: "2025 秋",
    title: "成都与川西边缘",
    summary: "成都城区和川西短线的交通、餐食与停留记录。",
    cover:
      "https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=1200&q=80",
    status: "placeholder",
    routeStops: ["成都", "都江堰", "日隆", "四姑娘山"],
  },
  {
    slug: "hongkong",
    period: "2025 夏",
    title: "港岛周末",
    summary: "港岛周末路线，包括步行、交通、餐食和停留点。",
    cover:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
    status: "placeholder",
  },
  {
    slug: "future-list",
    period: "持续更新",
    title: "未来目的地清单",
    summary: "记录待评估城市、路线参考和照片素材。",
    cover:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    status: "placeholder",
  },
];

// 最近一次完整记录的旅行（首页回退展示用）
export const latestTrip = trips.find((t) => t.slug === "chuanxi") ?? trips[0];

// 下一次旅行（首页展示用，当前指向关西计划）
export const nextTrip = trips.find((t) => t.slug === "kansai") ?? trips[0];

// 首页展示的行程：有下次计划就用下次，否则回退到最近一次
export const featuredTrip = nextTrip ?? latestTrip;

export const travelArchive = trips
  .filter((t) => t.slug !== "future-list")
  .map((t) => ({ title: t.title, period: t.period, summary: t.summary }));
