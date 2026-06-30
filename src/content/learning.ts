/**
 * Workbench 学习数据 — Agent Harness 双项目学习地图。
 *
 * 9 条核心分支（stream），覆盖 Agent 开发与 Harness 工程的关键知识点。
 * 数据模型：stream（路线）+ current resources（当前阶段资料）+ weekly plan。
 * 22 周双项目：Research Agent（W01-12）+ Coding Agent（W13-22）。
 */

export type StreamStatus = "active" | "growing" | "seedling";

export type Stream = {
  id: string;
  name: string;
  code: string;
  summary: string;
  status: StreamStatus;
  /** 分层：inner=基础 / mid=能力 / outer=系统 */
  ring: "inner" | "mid" | "outer";
};

export type RoadmapStep = {
  phase: string;
  horizon: string;
  focus: string;
  deliverables: string[];
  interviewSignal: string;
};

export type CapstoneProject = {
  title: string;
  subtitle: string;
  why: string;
  modules: string[];
  proof: string[];
};

export type WeeklyPlan = {
  week: string;
  theme: string;
  streams: string[];
  learn: string[];
  build: string[];
  output: string;
  /** 执行状态：done=已完成 / active=进行中 / upcoming=未开始。默认 upcoming。 */
  status?: "done" | "active" | "upcoming";
};

/** Agent 开发的 9 条核心分支，按递进阶段归组 */
export const streams: Stream[] = [
  // 内层 · Agent 接口
  {
    id: "runtime", name: "Agent Runtime", code: "RUN", status: "active", ring: "inner",
    summary: "Agent loop、step、state、budget、stop condition 与执行恢复。",
  },
  {
    id: "retrieval", name: "Retrieval", code: "RAG", status: "active", ring: "inner",
    summary: "Retrieval as Tool、多轮迭代检索、引用证据、来源冲突与检索评估。",
  },
  {
    id: "prompting", name: "Prompting", code: "PRM", status: "active", ring: "inner",
    summary: "任务协议、结构化输出、综合简报、澄清、拒答与格式修复。",
  },
  // 中层 · Agent 能力
  {
    id: "tool-use", name: "Tool Use", code: "TLS", status: "active", ring: "mid",
    summary: "工具注册、参数校验、错误恢复、检索/代码工具、MCP、工具组合。",
  },
  {
    id: "context", name: "Context & Memory", code: "CTX", status: "growing", ring: "mid",
    summary: "上下文预算、短期状态、长期记忆、知识沉淀、污染与失效防护。",
  },
  {
    id: "workflow", name: "Workflow", code: "WFL", status: "active", ring: "mid",
    summary: "任务分解、多轮状态机、多工具编排、repair loop、debug 重试。",
  },
  // 外层 · 可靠性
  {
    id: "guardrails", name: "Guardrails", code: "GRD", status: "active", ring: "outer",
    summary: "权限、安全、高风险动作（push/publish/部署）审批、沙箱与拦截。",
  },
  {
    id: "evaluation", name: "Evaluation", code: "VAL", status: "growing", ring: "outer",
    summary: "任务集、trace、引用真实率、resolved rate、失败归因、策略对比。",
  },
  {
    id: "multi-agent", name: "Multi-Agent", code: "MUL", status: "seedling", ring: "outer",
    summary: "角色拆分（研究/代码场景）、委派策略、结果合并与成本控制。",
  },
];

export const streamRoadmaps: Record<string, RoadmapStep[]> = {
  runtime: [
    {
      phase: "agent kernel",
      horizon: "week 1-2",
      focus: "实现最小 observe -> decide -> act/respond loop，并记录每一步 trace。",
      deliverables: ["runtime skeleton", "trace JSON", "step budget"],
      interviewSignal: "能手写 Agent 执行内核，而不是只配置框架。",
    },
    {
      phase: "execution control",
      horizon: "week 8-15",
      focus: "补齐状态机、异步任务、持久化、配置化模型与工具。",
      deliverables: ["server runtime", "task states", "config system"],
      interviewSignal: "能把 demo loop 推进到可运行系统。",
    },
  ],
  retrieval: [
    {
      phase: "research retrieval",
      horizon: "week 3-5",
      focus: "把 web 搜索/页面抓取作为 Agent 工具，多轮迭代检索，带引用综合。",
      deliverables: ["web_search/fetch_page 工具", "带引用研究简报"],
      interviewSignal: "能解释多轮检索和引用质量如何保证。",
    },
    {
      phase: "evidence & eval",
      horizon: "week 6-8",
      focus: "评估引用真实性、覆盖度，处理来源冲突和不确定。",
      deliverables: ["citation checker", "检索策略对比报告"],
      interviewSignal: "能证明检索模块是否真的提升研究质量。",
    },
  ],
  prompting: [
    {
      phase: "task contract",
      horizon: "week 1-6",
      focus: "把 prompt 设计成稳定任务协议：问题类型、综合结构、引用规则、失败修复。",
      deliverables: ["brief output schema", "repair prompt", "synthesis prompt"],
      interviewSignal: "能把提示词设计成稳定协议，而不是临时文案。",
    },
  ],
  "tool-use": [
    {
      phase: "research tools",
      horizon: "week 2-3",
      focus: "实现研究 Agent 的只读工具：web_search、fetch_page、record_gaps。",
      deliverables: ["tool registry", "3 个检索工具", "工具调用 trace"],
      interviewSignal: "能把外部 API 变成可观测的 Agent tool。",
    },
    {
      phase: "code tools",
      horizon: "week 13-14",
      focus: "实现代码 Agent 工具：read_file、grep、apply_patch、run_tests、git_diff。",
      deliverables: ["代码工具集", "apply_patch/run_tests", "测试驱动评测"],
      interviewSignal: "能把代码库操作变成安全、可观测的 Agent tool。",
    },
  ],
  context: [
    {
      phase: "context & memory",
      horizon: "week 9, 18",
      focus: "设计短期状态、长期记忆、知识沉淀、记忆失效与污染防护。",
      deliverables: ["memory store", "知识/修复历史记忆", "记忆污染案例"],
      interviewSignal: "能说明哪些记忆值得保存，哪些会带来风险。",
    },
  ],
  workflow: [
    {
      phase: "research workflow",
      horizon: "week 4-8",
      focus: "让研究 Agent 在多轮中完成搜索、阅读、综合、校验、再搜索。",
      deliverables: ["研究流程状态机", "多轮搜索 demo"],
      interviewSignal: "能把 Agent 接入真实研究流程，而不是只搜一次。",
    },
    {
      phase: "code workflow",
      horizon: "week 14-17",
      focus: "让代码 Agent 完成定位→改→测→审的端到端修复流程。",
      deliverables: ["代码修复状态机", "debug retry"],
      interviewSignal: "能把 Agent 接入真实代码修复流程。",
    },
  ],
  guardrails: [
    {
      phase: "code approval gates",
      horizon: "week 15",
      focus: "git push、npm publish、部署只生成 proposal，必须人工审批；沙箱隔离执行。",
      deliverables: ["approval queue", "沙箱", "路径越界拦截测试"],
      interviewSignal: "能把安全和权限作为 Coding Harness 的一等能力。",
    },
  ],
  evaluation: [
    {
      phase: "benchmark & tracing",
      horizon: "week 6-8, 16",
      focus: "构造任务集，记录 trace，评估引用真实率、覆盖度、resolved rate。",
      deliverables: ["benchmark runner", "citation checker", "SWE-bench 集成"],
      interviewSignal: "能用指标证明 Agent 系统是否可靠。",
    },
  ],
  "multi-agent": [
    {
      phase: "role split",
      horizon: "week 10, 17",
      focus: "研究 Agent（Planner/Searcher/Reader/Synthesizer/Verifier）与代码 Agent（Reproducer/Fixer/Tester/Reviewer）的角色拆分。",
      deliverables: ["delegation policy", "单 vs 多 Agent 对比"],
      interviewSignal: "能证明多 Agent 是否带来收益，而不是角色扮演。",
    },
  ],
};

export const capstoneProject = {
  title: "Agent Harness · 双项目作品集",
  subtitle: "用 22 周做出两个生产级 Agent Harness：Research Agent（检索/综合/引用）+ Coding Agent（改代码/跑测试/审批）",
  why: "两个项目复用同一套 runtime/trace/eval 骨架，覆盖 9 个 Agent 能力 stream。Research Agent 以读为主打基础，Coding Agent 复用骨架进代码工具实战，危险动作进人工审批。",
  modules: [
    "Research Agent: 多轮检索、阅读综合、带引用证据的研究简报",
    "Research 工具: web_search / fetch_page / record_gaps，引用校验防编造",
    "Coding Agent: 读代码库、定位 bug、改代码、跑测试、生成 patch",
    "Coding 工具: read_file / grep / apply_patch / run_tests / git_diff",
    "Guardrails: git push / npm publish / 部署 进人工审批，沙箱隔离执行",
    "Evaluator: Research 引用真实率 + Coding SWE-bench 风格 resolved rate",
  ],
  proof: [
    "Research Agent: 四策略对比（naive/single/multi-round/adaptive）+ 引用编造率指标",
    "Coding Agent: SWE-bench 风格 resolved rate + 四角色多 Agent 对比",
    "两项目共享 trace viewer，附失败 trace 归因分析",
  ],
};

export const supportWeeklyPlan: WeeklyPlan[] = [
  // ========== Phase 1: Research Agent Harness (W01-12) ==========
  {
    week: "01",
    theme: "研究场景建模与最小 Agent Loop",
    streams: ["runtime", "prompting"],
    learn: ["ReAct 基本思想", "OpenAI Agents SDK 核心概念", "研究问题抽象"],
    build: ["定义 ResearchTask YAML", "实现 observe -> decide -> respond", "保存 trace JSON"],
    output: "15 个研究任务 + 最小 runtime demo",
    status: "active",
  },
  {
    week: "02",
    theme: "结构化输出与工具注册表",
    streams: ["prompting", "tool-use", "runtime"],
    learn: ["structured output", "tool schema 设计", "JSON repair"],
    build: ["brief output schema", "tool registry", "格式失败重试"],
    output: "稳定输出 schema + 20 个任务",
  },
  {
    week: "03",
    theme: "检索工具与多轮搜索",
    streams: ["retrieval", "workflow"],
    learn: ["web_search/fetch_page", "引用证据格式", "多轮迭代检索"],
    build: ["web_search + fetch_page 工具", "带引用回答", "need_more_search 决策"],
    output: "多轮检索 demo + 25 条任务",
  },
  {
    week: "04",
    theme: "引用质量与流程编排",
    streams: ["retrieval", "evaluation", "workflow"],
    learn: ["引用校验", "来源冲突处理", "研究流程状态机"],
    build: ["citation checker", "冲突测试集", "ResearchState"],
    output: "引用校验 + 流程状态机 + v0.2",
  },
  {
    week: "05",
    theme: "综合写作与证据组织",
    streams: ["prompting", "workflow", "context"],
    learn: ["研究简报结构", "证据聚合去重", "长上下文综合"],
    build: ["brief schema", "evidence aggregator", "synthesis prompt"],
    output: "高质量研究简报 + judge rubric",
  },
  {
    week: "06",
    theme: "评测集与指标体系",
    streams: ["evaluation", "retrieval"],
    learn: ["研究 Agent 指标", "引用真实率", "LLM-as-judge"],
    build: ["50 任务 benchmark", "harness eval", "judge 流水线"],
    output: "第一版评测报告",
  },
  {
    week: "07",
    theme: "策略对比实验",
    streams: ["evaluation", "retrieval", "tool-use"],
    learn: ["ablation", "naive/single/multi/adaptive 对比", "成本质量权衡"],
    build: ["四策略 config", "对比实验"],
    output: "四策略 benchmark 对比表 + v0.3",
  },
  {
    week: "08",
    theme: "失败归因与 Trace Viewer",
    streams: ["evaluation", "runtime", "workflow"],
    learn: ["failure taxonomy", "repair loop", "可观测性 UI"],
    build: ["失败标签表", "无引用重检", "trace viewer v1"],
    output: "失败归因报告 + trace viewer",
  },
  {
    week: "09",
    theme: "Context & Memory",
    streams: ["context", "runtime"],
    learn: ["短期/长期记忆", "知识沉淀", "记忆时效"],
    build: ["分层记忆", "knowledge store", "TTL 刷新"],
    output: "Memory vs no-memory 对比",
  },
  {
    week: "10",
    theme: "Multi-Agent 角色拆分",
    streams: ["multi-agent", "workflow", "guardrails"],
    learn: ["问题分解", "专职 Agent 设计", "委派策略"],
    build: ["Planner/Searcher/Reader/Synthesizer/Verifier"],
    output: "单 vs 多 Agent 对比",
  },
  {
    week: "11",
    theme: "工程化与部署形态",
    streams: ["runtime", "tool-use", "evaluation"],
    learn: ["API/队列/DB 设计", "异步任务", "配置化"],
    build: ["后端 API", "持久化", "任务队列", "config system"],
    output: "可本地启动的完整工作台 + research-v1.0",
  },
  {
    week: "12",
    theme: "Phase 1 作品打磨",
    streams: ["evaluation", "runtime", "prompting"],
    learn: ["技术叙事", "架构图", "benchmark report"],
    build: ["README", "demo script", "最终报告", "简历描述"],
    output: "Research Agent 可投递版本",
  },
  // ========== Phase 2: Coding Agent Harness (W13-22) ==========
  {
    week: "13",
    theme: "代码库读取工具（复用骨架）",
    streams: ["tool-use", "runtime"],
    learn: ["Harness 复用", "代码导航", "代码语义检索"],
    build: ["复用 runtime/trace", "read_file/grep/search_codebase", "代码任务集"],
    output: "coding-agent skeleton + 10 个代码任务",
  },
  {
    week: "14",
    theme: "代码修改与测试验证",
    streams: ["tool-use", "runtime", "evaluation"],
    learn: ["patch 应用", "测试驱动评测", "FAIL_TO_PASS"],
    build: ["apply_patch", "run_tests", "git_diff", "端到端 demo"],
    output: "定位→改→测 端到端 + v0.4",
  },
  {
    week: "15",
    theme: "审批与安全护栏（GRD 核心）",
    streams: ["guardrails", "workflow", "tool-use"],
    learn: ["代码动作风险分级", "push/publish 审批", "沙箱防护"],
    build: ["风险矩阵", "push proposal", "路径越界拦截"],
    output: "高风险动作审批 demo + guardrails 文档",
  },
  {
    week: "16",
    theme: "SWE-bench 风格评测与失败归因",
    streams: ["evaluation", "runtime", "workflow"],
    learn: ["SWE-bench 评测", "resolved rate", "代码失败归因"],
    build: ["SWE-bench 集成", "debug retry", "代码 reviewer"],
    output: "resolved rate 报告 + v0.5",
  },
  {
    week: "17",
    theme: "Multi-Agent 代码协作",
    streams: ["multi-agent", "workflow", "guardrails"],
    learn: ["bug 复现", "角色拆分", "委派编排"],
    build: ["Reproducer/Fixer/Tester/Reviewer", "委派策略"],
    output: "单 vs 多 Agent 代码对比",
  },
  {
    week: "18",
    theme: "Context & Memory（代码场景）",
    streams: ["context", "runtime"],
    learn: ["代码库索引", "修复历史记忆", "记忆失效"],
    build: ["代码缓存", "修复记忆", "持久化索引"],
    output: "代码 memory 对比实验",
  },
  {
    week: "19-20",
    theme: "工程化与 GitHub 集成",
    streams: ["runtime", "tool-use", "evaluation"],
    learn: ["沙箱执行", "GitHub API", "CI 集成"],
    build: ["API + 队列 + 沙箱", "GitHub issue→draft PR", "真实任务回归"],
    output: "可部署形态 + v0.9-rc",
  },
  {
    week: "21",
    theme: "Coding Agent 作品打磨",
    streams: ["evaluation", "runtime", "prompting"],
    learn: ["SWE-bench 指标呈现", "技术叙事", "面试追问"],
    build: ["README", "架构图", "demo", "最终 benchmark", "面试材料"],
    output: "Coding Agent 可投递版本 + coding-v1.0",
  },
  {
    week: "22",
    theme: "双项目复盘与总收尾",
    streams: ["runtime", "evaluation", "multi-agent"],
    learn: ["跨项目抽象", "作品集叙事", "通用 Harness 框架"],
    build: ["双项目对比文档", "作品集页", "总叙事"],
    output: "portfolio-v1.0 双项目作品集",
  },
];

/** 时间线条目 — 资源与已归档文章统一为时间线项 */
export type FeedKind = "resource" | "note";

export type FeedItem = {
  id: string;
  kind: FeedKind;
  /** 关联的学习路线 streamId（可多个） */
  streams: string[];
  /** 排序用时间（YYYY-MM 或 YYYY-MM-DD） */
  date: string;
  title: string;
  detail?: string;
  /** resource 子类型 */
  resourceKind?: "book" | "course" | "paper" | "doc" | "repo";
  href?: string;
};

/**
 * 全部时间线条目 — 从 content/feed/ 目录自动聚合（每条一个文件）。
 *
 * 维护方式：在 src/content/feed/ 新建 .ts 文件，default 导出一个 FeedItem。
 * 新增文件后在此处的 import 列表与 feed 数组里各加一行即可。
 * 这样把会持续增长的 feed 数据拆成独立文件，便于长期维护。
 */
import f3 from "./feed/f3-langgraph-doc";
import f4 from "./feed/f4-openai-swarm";
import f9 from "./feed/f9-letta-memgpt";
import f13 from "./feed/f13-openai-agents-sdk";
import f14 from "./feed/f14-mcp-spec";
import f19 from "./feed/f19-agentic-rag";
import f20 from "./feed/f20-langgraph-memory";
import f21 from "./feed/f21-human-in-loop";

export const feed: FeedItem[] = [
  f3, f4, f9, f13, f14, f19, f20, f21,
];

/** 按选中的 stream 过滤时间线；未选中时返回全部（按时间倒序） */
export function getFeed(streamId: string | null): FeedItem[] {
  const items = streamId
    ? feed.filter((f) => f.streams.includes(streamId))
    : feed;
  return [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 所有 stream 的 id→meta 映射，便于组件查表 */
export const streamMap: Record<string, Stream> = Object.fromEntries(
  streams.map((s) => [s.id, s]),
);
