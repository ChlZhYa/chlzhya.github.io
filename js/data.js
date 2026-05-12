/**
 * 个人旅程 - 内容数据中心
 * 编辑此文件即可修改全站内容，无需后台接口。
 * 使用方式：改完保存，刷新页面即可看到更新。
 */

// ============================================================
// 站点设置
// ============================================================
const SITE_CONFIG = {
  name: 'Journey Scholar',
  tagline: '记录学习成长 · 珍藏旅途风景',
  author: 'Ovr Ivy',
  year: 2026,
};

// ============================================================
// 导航
// ============================================================
const NAV_LINKS = [
  { label: '首页', href: 'index.html', icon: 'home' },
  { label: '学习路径', href: 'learning.html', icon: 'menu_book' },
  { label: '旅行时间表', href: 'travel.html', icon: 'explore' },
  { label: '管理', href: 'admin.html', icon: 'settings' },
];

// ============================================================
// 旅途记录（时间线页面用）
// ============================================================
const TRAVEL_ITEMS = [
  {
    id: 1,
    title: '东京与大阪探险',
    dates: '2025年5月10日 - 5月12日',
    summary: '超现代都市景观与深厚传统文化的不可思议的融合。从穿梭于涩谷的繁忙街道到在道顿堀享受地道街头美食，这种对比令人着迷。',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    tags: ['日本', '城市', '美食'],
  },
  {
    id: 2,
    title: '欧洲艺术之旅',
    dates: '2024年9月5日 - 9月18日',
    summary: '深入探索巴黎和阿姆斯特丹的古典与当代艺术。几天时间漫步于卢浮宫和国立博物馆，在每一个画廊中寻找灵感。',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    tags: ['法国', '荷兰', '艺术'],
    side: 'right',
  },
  {
    id: 3,
    title: '高山疗养',
    dates: '2024年1月12日 - 1月20日',
    summary: '一次宁静的瑞士阿尔卑斯山逃亡，专注于反思和冬季运动。清新的空气、充满挑战的斜坡以及炉火旁舒适的夜晚提供了完美的重置。',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    tags: ['瑞士', '山脉', '户外'],
  },
  {
    id: 4,
    title: '京都之春',
    dates: '2023年4月1日 - 4月5日',
    summary: '樱花盛开的季节漫步于京都古寺与竹林小径，体验传统茶道与怀石料理的禅意之美。',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    tags: ['日本', '京都', '春季'],
    side: 'right',
  },
  {
    id: 5,
    title: '波特兰周末',
    dates: '2023年3月15日 - 3月17日',
    summary: '探索美国西北部的创意之都——精酿啤酒、独立书店、美食餐车，还有哥伦比亚河谷的壮丽瀑布。',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    tags: ['美国', '城市', '自然'],
  },
];

// ============================================================
// 旅行详情（行程日）
// ============================================================
const TRAVEL_DETAIL = {
  title: '东京与大阪探险',
  subtitle: '连接霓虹闪烁的涩谷街道与美食中心道顿堀的高速子弹头列车之旅。',
  dates: '5月10日 - 5月12日',
  heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  days: [
    {
      day: 1,
      title: '第一天：抵达与涩谷',
      date: '5月10日，东京',
      events: [
        {
          time: '上午 10:00',
          type: '交通',
          title: '抵达成田机场',
          description: '落地日本。通过海关，领取JR Pass，并乘坐成田特快前往东京市区。',
          icon: 'flight_land',
          color: 'primary',
          detail: '建议在机场兑换日元并租用随身WiFi。成田特快约1小时到达东京站，票价约3000日元。JR Pass可在机场JR办事处激活。',
        },
        {
          time: '下午 02:00',
          type: '住宿',
          title: '入住涩谷Stream酒店',
          description: '在位于涩谷站正上方的酒店放下行李并梳洗一番，欣赏涩谷十字路口的全景。',
          icon: 'hotel',
          color: 'secondary',
          detail: '酒店位于涩谷Stream大厦，与涩谷站直连。房间可俯瞰著名的涩谷十字路口——世界上最繁忙的人行横道。',
        },
        {
          time: '晚上 07:00',
          type: '餐饮',
          title: '在饮兵卫横丁享用晚餐',
          description: '探索"醉汉巷"狭窄的小巷，品尝地道的烤鸡肉串，感受当地人的夜生活氛围。',
          icon: 'restaurant',
          color: 'tertiary',
          detail: '这条小巷紧邻全向十字路口，挤满了微型酒吧和烤鸡肉串摊，许多地方只能容纳4-5人。这是战后东京夜生活的真实写照。推荐：尝试鸡肉丸（tsukune）和高球鸡尾酒。',
        },
      ],
    },
    {
      day: 2,
      title: '第二天：乘坐子弹头列车前往大阪',
      date: '5月11日，交通',
      events: [
        {
          time: '上午 08:00',
          type: '交通',
          title: '乘坐新干线前往大阪',
          description: '从品川站搭乘希望号新干线，约2.5小时抵达新大阪站，沿途欣赏富士山风光。',
          icon: 'train',
          color: 'primary',
          detail: '建议提前购买便当（駅弁）在列车上享用。选右侧座位可在天气晴朗时看到富士山。',
        },
        {
          time: '下午 01:00',
          type: '餐饮',
          title: '道顿堀美食探索',
          description: '在道顿堀运河沿岸漫步，品尝章鱼烧、御好烧和串炸等大阪名物。',
          icon: 'restaurant',
          color: 'tertiary',
          detail: '道顿堀是大阪的美食天堂。必试：蟹道乐的大螃蟹招牌下的螃蟹料理、格力高跑步者广告牌前的经典打卡照。',
        },
        {
          time: '晚上 06:00',
          type: '景点',
          title: '登上梅田蓝天大厦',
          description: '在梅田蓝天大厦的空中庭院展望台观赏大阪夜景，360度全景尽收眼底。',
          icon: 'attractions',
          color: 'secondary',
          detail: '梅田蓝天大厦的空中庭院在B1和39层，日落前一小时到达可同时看到白天、黄昏和夜景。',
        },
      ],
    },
    {
      day: 3,
      title: '第三天：文化深度 & 返程',
      date: '5月12日，大阪',
      events: [
        {
          time: '上午 09:00',
          type: '景点',
          title: '参观大阪城',
          description: '游览日本最具历史意义的城堡之一，了解丰臣秀吉的故事，在城顶俯瞰大阪市景。',
          icon: 'account_balance',
          color: 'primary',
          detail: '大阪城公园免费进入，天守阁门票600日元。春天是赏樱名所，秋季红叶同样壮观。',
        },
        {
          time: '下午 02:00',
          type: '购物',
          title: '心斋桥筋购物',
          description: '在大阪最繁华的购物街采购伴手礼、药妆和日本零食。',
          icon: 'shopping_bag',
          color: 'tertiary',
          detail: '心斋桥筋商店街长达600米，汇聚了各大药妆店、服饰品牌和特色纪念品店。',
        },
        {
          time: '晚上 07:00',
          type: '交通',
          title: '关西机场返程',
          description: '从难波站乘坐南海电铁前往关西国际机场，结束美好的日本之旅。',
          icon: 'flight_takeoff',
          color: 'secondary',
          detail: '南海电铁特急列车约40分钟到达关西机场。建议提前2.5-3小时到达机场办理退税和登机。',
        },
      ],
    },
  ],
};

// ============================================================
// 学习模块
// ============================================================
const LEARNING_MODULES = [
  {
    id: 1,
    title: '前端基础',
    description: '掌握 DOM、可访问性和现代 CSS 布局。深入学习 HTML5 语义化标签与响应式设计模式。',
    icon: 'html',
    progress: 100,
    status: 'completed',
    stats: '课时 1-4',
    links: [
      { label: 'GitHub', icon: 'code', href: '#' },
      { label: '文档', icon: 'menu_book', href: '#' },
    ],
  },
  {
    id: 2,
    title: '后端逻辑',
    description: 'API 设计、数据库建模和服务器端渲染模式。构建基于 Express 的 RESTful 服务。',
    icon: 'terminal',
    progress: 60,
    status: 'active',
    stats: '课时 5-8',
    link: { label: '继续学习', icon: 'play_circle', href: 'learning-detail.html' },
  },
  {
    id: 3,
    title: '云基础设施',
    description: '部署、CI/CD 流水线和可扩展的无服务器架构。掌握 Docker 与容器编排基础。',
    icon: 'cloud',
    progress: 0,
    status: 'locked',
    stats: '需要完成后端逻辑',
    links: [],
  },
];

// ============================================================
// 学习模块详情 — 全栈开发
// ============================================================
const LEARNING_DETAIL = {
  title: '全栈开发架构',
  module: '模块 3',
  description: '掌握从前端界面交互到后端数据库架构的完整链路，构建具备高可用性和扩展性的现代企业级 Web 应用。',
  overallProgress: 65,
  completed: 8,
  total: 12,
  heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  lessons: [
    {
      id: '1-4',
      title: '前端工程化基础',
      description: '深入理解 React 核心机制，虚拟 DOM，状态管理以及现代前端构建工具链 (Vite, Webpack) 的配置与优化。',
      status: 'completed',
      progress: 100,
    },
    {
      id: '5-8',
      title: 'Node.js 与后端架构',
      description: '构建 RESTful API，理解中间件模式，身份验证 (JWT)，以及基于 Express/NestJS 的企业级后端路由设计。',
      status: 'active',
      progress: 50,
      task: 'API 路由模块划分',
    },
    {
      id: '9-12',
      title: '数据库设计与部署',
      description: '关系型与非关系型数据库 (PostgreSQL, MongoDB) 的建模与性能调优，以及基于 Docker 的容器化部署策略。',
      status: 'locked',
      progress: 0,
    },
  ],
  resources: [
    { title: 'Node.js 官方最佳实践', type: '必读文档', duration: '45分钟', icon: 'description' },
    { title: 'JWT 认证机制解析', type: '视频教程', duration: '1.2 小时', icon: 'play_arrow' },
    { title: '模块脚手架代码仓库', type: 'GitHub', duration: '初始模板', icon: 'code' },
  ],
  notes: [
    { title: '中间件洋葱模型', text: 'Express 中间件执行顺序是从外到内，再从内到外，类似洋葱切面。务必注意 next() 的调用位置。', color: 'primary' },
    { title: '跨域资源共享 (CORS)', text: '在前后端分离架构中，需在服务端显式配置 CORS 头，或者使用 proxy 代理。', color: 'secondary' },
  ],
};

// ============================================================
// 管理面板数据
// ============================================================
const ADMIN_CONTENT = [
  { title: '日本 2025 行程', type: '旅行', status: '草稿' },
  { title: '高级 React 模式', type: '学习', status: '已发布' },
  { title: '波特兰周末', type: '旅行', status: '已发布' },
  { title: '京都之春 2023', type: '旅行', status: '已发布' },
  { title: '前端基础笔记', type: '学习', status: '草稿' },
];

const ADMIN_LOGS = [
  { text: '构建成功', time: '5 分钟前', env: '生产', active: true },
  { text: '内容更新：旅行日志', time: '2 小时前', env: '已保存草稿', active: false },
  { text: '构建成功', time: '昨天', env: '生产', active: false },
  { text: '模块 3 进度更新至 65%', time: '昨天', env: '学习', active: false },
];
