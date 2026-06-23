export const siteConfig = {
  name: "行间",
  nav: [
    { label: "首页", target: "/" },
    { label: "学习", target: "/learning" },
    { label: "旅行", target: "/travel" },
  ],
  hero: {
    title: "内容索引",
    description: "学习、项目判断与旅行记录，按本地结构持续整理。",
    primaryAction: "浏览学习",
    secondaryAction: "查看旅行轨迹",
  },
};

export const learningConfig = {
  enabled: true,
  sections: {
    paths: true,
    notes: false,
    projects: false,
    resources: true,
  },
};

export const travelConfig = {
  enabled: true,
  sections: {
    route: true,
    itinerary: true,
    destinations: true,
    gallery: true,
  },
};
