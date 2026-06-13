export const siteConfig = {
  name: "行间",
  nav: [
    { label: "首页", target: "/" },
    { label: "学习", target: "/learning" },
    { label: "旅行", target: "/travel" },
  ],
  hero: {
    title: "行远自迩",
    description: "把每一步走慢，把每一段写下。",
    primaryAction: "查看学习路径",
    secondaryAction: "查看旅行记录",
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
