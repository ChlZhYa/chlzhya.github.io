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
];

// ============================================================
// 旅途记录（时间线页面用）
// ============================================================
const TRAVEL_ITEMS = [
  {
    id: 1,
    title: '赣皖双岳：三清山 & 黄山徒步',
    dates: '2026年6月18日 - 6月21日',
    summary: '从广州出发，穿越道教名山三清山的大环线，再挑战黄山天都峰之险与西海大峡谷之幽——四天三夜，赣皖两省的山岳壮游。',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tags: ['江西', '安徽', '徒步', '山岳'],
  },
];

// ============================================================
// 旅行详情（行程日）
// ============================================================
const TRAVEL_DETAIL = {
  title: '赣皖双岳：三清山 & 黄山徒步',
  subtitle: 'D170 广州出发，穿越道教名山三清山的大环线，再到黄山挑战天都峰之险与西海大峡谷之幽。',
  dates: '6月18日 - 6月21日',
  heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  days: [
    {
      day: 1,
      title: '第一天：出发 · 广州 → 上饶',
      date: '6月18日，交通',
      events: [
        {
          time: '全天',
          type: '交通',
          title: 'D170 广州 → 上饶',
          description: '乘坐 D170 次列车从广州出发前往上饶。抵达后入住上饶站附近酒店休整，为第二天登山储备体力。',
          icon: 'train',
          color: 'primary',
          detail: 'D170 为动车组列车。建议提前预订车票，随身携带少量零食和充足饮水。上饶站周边有多家经济型酒店，步行可达。',
        },
      ],
    },
    {
      day: 2,
      title: '第二天：三清山大环线',
      date: '6月19日，三清山',
      events: [
        {
          time: '上午 07:30',
          type: '交通',
          title: '上饶站打车至三清山外双溪',
          description: '从上饶站打车前往三清山外双溪入口，车程约1.5小时。外双溪游客中心提供行李寄存服务。',
          icon: 'directions_car',
          color: 'primary',
          detail: '外双溪是三清山两大主入口之一（另一为金沙索道）。游客中心提供行李寄存，建议只带登山必需物品上山。打车费用约150-200元。',
        },
        {
          time: '上午 09:00',
          type: '景点',
          title: '三清山大环线徒步',
          description: '从外双溪出发，完成三清山大环线徒步——途经三清宫、登顶玉京峰（海拔1819米），领略道教名山的奇峰怪石与云海。',
          icon: 'hiking',
          color: 'secondary',
          detail: '大环线全长约15km，耗时约6-8小时。玉京峰为三清山最高峰，登顶可俯瞰群峰。三清宫为千年道教古观，值得驻足。沿途有巨蟒出山、东方女神等标志性景观。建议自备路餐和2L水。',
        },
        {
          time: '下午 17:00',
          type: '交通',
          title: '打车前往婺源漫心酒店',
          description: '结束三清山徒步后，取回寄存行李，打车前往婺源漫心酒店入住，车程约1.5小时。',
          icon: 'hotel',
          color: 'tertiary',
          detail: '婺源距三清山约80km。漫心酒店为华住旗下中高端品牌，建议提前预订。到达后可前往婺源县城品尝当地徽菜——糊豆腐、粉蒸肉值得一试。',
        },
      ],
    },
    {
      day: 3,
      title: '第三天：黄山后山 · 西海大峡谷',
      date: '6月20日，黄山',
      events: [
        {
          time: '上午 06:30',
          type: '住宿',
          title: '早起出发 · 婺源 → 汤口',
          description: '酒店早餐后（建议打包），约6:30-7:00出发，打车前往黄山汤口镇逍遥溪换乘中心，车程约1-1.5小时。',
          icon: 'directions_car',
          color: 'primary',
          detail: '婺源到黄山汤口约80km，全程高速。建议尽早出发以争取更多山上时间。到达后先到逍遥溪换乘中心旁的亚朵酒店办理入住并寄存行李。',
        },
        {
          time: '上午 08:30',
          type: '景点',
          title: '云谷索道上山 · 北海景区',
          description: '从逍遥溪换乘中心坐景交车到云谷寺，乘云谷索道上山。先游览北海景区——猴子观海是黄山标志性景点之一，巨石如猴蹲坐观云海。',
          icon: 'cable_car',
          color: 'secondary',
          detail: '云谷索道上山约10分钟，节省约2.5小时登山时间。猴子观海位于北海景区狮子峰，是黄山十大名石之一。从此处开始，一路向排云亭方向前进。',
        },
        {
          time: '上午 10:00',
          type: '景点',
          title: '西海大峡谷全程穿越',
          description: '从排云亭进入西海大峡谷，一路下探至谷底，经步仙桥，再爬升至天海。这是黄山最壮丽的徒步路段——悬崖栈道、奇松怪石、深壑绝壁。',
          icon: 'landscape',
          color: 'primary',
          detail: '西海大峡谷全程约2-3小时。排云亭→谷底为连续下坡台阶（约1.5h），谷底→步仙桥→天海为爬升段（约1.5-2h，最陡段）。注意：谷底路段较窄，旺季可能拥挤。全程无补给点，务必带足饮水。',
        },
        {
          time: '下午 13:30',
          type: '景点',
          title: '天海 → 玉屏楼 → 玉屏索道下山',
          description: '从天海经鳌鱼峰前往玉屏楼，欣赏迎客松后乘玉屏索道下山，返回汤口镇亚朵酒店。',
          icon: 'cable_car',
          color: 'tertiary',
          detail: '天海到玉屏楼约1小时，途经鳌鱼峰（黄山36小峰之一）。玉屏楼以迎客松闻名于世。玉屏索道末班约17:00-17:30，务必在此之前到达。预计全程徒步6-7小时。',
        },
      ],
    },
    {
      day: 4,
      title: '第四天：天都峰 · 光明顶 · 返程',
      date: '6月21日，黄山 → 广州',
      events: [
        {
          time: '上午 07:30',
          type: '餐饮',
          title: '早餐后出发 · 慈光阁',
          description: '酒店早餐后，坐景交车从逍遥溪换乘中心前往慈光阁。轻装出发，行李寄存在酒店。',
          icon: 'restaurant',
          color: 'primary',
          detail: '今天是关键一天——下午需要赶高铁回广州。建议轻装快行，控制节奏，保证在14:30前结束徒步。',
        },
        {
          time: '上午 08:00',
          type: '景点',
          title: '挑战天都峰：新道口上，老道口下',
          description: '从慈光阁徒步至新道口，攀爬黄山最险峰——天都峰（海拔1810米）。鲫鱼背是全程最惊险的一段。从老道口下山后，前往光明顶。',
          icon: 'hiking',
          color: 'secondary',
          detail: '天都峰与莲花峰轮换开放，2026年为天都峰开放年。新道口上约1-1.5h（极陡，部分路段需手脚并用），老道口下约1h。鲫鱼背宽仅1米，两侧万丈深渊，有铁链护栏。6月旺季新道口可能排队，尽量8:00前到入口。',
        },
        {
          time: '上午 10:30',
          type: '景点',
          title: '光明顶 → 排云亭 → 猴子观海',
          description: '从老道口前往光明顶（黄山第二高峰，海拔1860米），俯瞰黄山全景。经排云亭后折返北海，再看一次猴子观海的不同角度。',
          icon: 'landscape',
          color: 'primary',
          detail: '天都峰到光明顶约1.5-2h。光明顶是黄山前山和后山的分界点，视野极佳，可远眺莲花峰和天都峰。排云亭以日落闻名，上午则可赏西海群峰的层次感。',
        },
        {
          time: '下午 13:00',
          type: '景点',
          title: '始信峰 · 云谷索道下山',
          description: '前往始信峰——黄山"始信黄山天下奇"的出处，最后乘云谷索道下山，回酒店洗澡退房。',
          icon: 'cable_car',
          color: 'tertiary',
          detail: '始信峰虽不高（海拔1683米），但奇松林立，是黄山松最集中的区域。下山后回亚朵酒店冲澡收拾（约45min），然后赶赴黄山北站。',
        },
        {
          time: '下午 16:45',
          type: '交通',
          title: '赶往黄山北站 · G697',
          description: '打车从汤口镇前往黄山北站（约1h），乘 G697 次高铁（18:06-20:45）前往吉安西站。',
          icon: 'train',
          color: 'primary',
          detail: '⏰ 关键节点：务必在16:00前离开酒店。G697 是当天最后一班黄山北直达吉安西的高铁，不容错过。二等座约274元。',
        },
        {
          time: '晚上 21:00',
          type: '交通',
          title: '吉安西 → 吉安站 → D169 回广州',
          description: '到达吉安西后打车前往吉安站（约30-40min），换乘 D169 次列车（23:03出发）返回广州。',
          icon: 'flight_takeoff',
          color: 'secondary',
          detail: '吉安西站到吉安站约15-20km，打车约30-40min。到达吉安站后有约1.5h候车时间，可在站内用餐休整。D169 为夜间动车，建议备好眼罩和颈枕。',
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
  { title: '赣皖双岳：三清山 & 黄山', type: '旅行', status: '已发布' },
  { title: '高级 React 模式', type: '学习', status: '已发布' },
  { title: '前端基础笔记', type: '学习', status: '草稿' },
];

const ADMIN_LOGS = [
  { text: '内容更新：赣皖双岳行程', time: '刚刚', env: '已发布', active: true },
  { text: '内容更新：旅行日志', time: '2 小时前', env: '已保存草稿', active: false },
  { text: '构建成功', time: '昨天', env: '生产', active: false },
  { text: '模块 3 进度更新至 65%', time: '昨天', env: '学习', active: false },
];
