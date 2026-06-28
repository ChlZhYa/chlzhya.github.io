/**
 * Workbench 学习数据 — Support Agent Harness 学习地图。
 *
 * 9 条核心分支（stream），覆盖 Agent 开发与 Harness 工程的关键知识点。
 * 数据模型：stream（路线）+ current resources（当前阶段资料）+ weekly plan。
 * 这里只放 16 周转型当前需要的内容；CS336、论文、LLM 底层资料暂时不进入工作台主线。
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
    summary: "Retrieval as Tool、证据引用、置信度、知识冲突与检索评估。",
  },
  {
    id: "prompting", name: "Prompting", code: "PRM", status: "active", ring: "inner",
    summary: "任务协议、结构化输出、few-shot、澄清、拒答与格式修复。",
  },
  // 中层 · Agent 能力
  {
    id: "tool-use", name: "Tool Use", code: "TLS", status: "active", ring: "mid",
    summary: "工具注册、参数校验、错误恢复、MCP、工具选择与组合调用。",
  },
  {
    id: "context", name: "Context & Memory", code: "CTX", status: "growing", ring: "mid",
    summary: "上下文预算、短期状态、长期记忆、摘要、污染与清除策略。",
  },
  {
    id: "workflow", name: "Workflow", code: "WFL", status: "active", ring: "mid",
    summary: "任务分解、多轮状态机、handoff、repair loop 与流程编排。",
  },
  // 外层 · 可靠性
  {
    id: "guardrails", name: "Guardrails", code: "GRD", status: "active", ring: "outer",
    summary: "权限、安全、人工审批、高风险动作拦截、合规与拒答边界。",
  },
  {
    id: "evaluation", name: "Evaluation", code: "VAL", status: "growing", ring: "outer",
    summary: "任务集、trace、指标、失败归因、策略对比与回归评测。",
  },
  {
    id: "multi-agent", name: "Multi-Agent", code: "MUL", status: "seedling", ring: "outer",
    summary: "角色拆分、委派策略、子 Agent 摘要、结果合并与成本控制。",
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
      phase: "retrieval as tool",
      horizon: "week 3-4",
      focus: "把知识库检索作为 Agent 可选择工具，而不是每次固定 RAG。",
      deliverables: ["FAQ/政策/SOP 文档集", "带引用回答"],
      interviewSignal: "能解释 RAG 在 Agent 中的正确位置和边界。",
    },
    {
      phase: "evidence policy",
      horizon: "week 9-12",
      focus: "评估检索命中、引用质量、知识冲突和不确定升级。",
      deliverables: ["检索评估指标", "知识冲突处理策略"],
      interviewSignal: "能证明检索模块是否真的提升客服质量。",
    },
  ],
  prompting: [
    {
      phase: "task contract",
      horizon: "week 1-6",
      focus: "把 prompt 设计成稳定任务协议：意图、动作、工具参数、最终回复、失败修复。",
      deliverables: ["JSON output schema", "repair prompt", "prompt versioning"],
      interviewSignal: "能把提示词设计成稳定协议，而不是临时文案。",
    },
  ],
  "tool-use": [
    {
      phase: "business tools",
      horizon: "week 5-6",
      focus: "实现业务 API 工具、参数校验、错误恢复和多工具组合。",
      deliverables: ["tool registry", "6 个业务工具", "工具调用 trace"],
      interviewSignal: "能把后端 API 变成安全、可观测的 Agent tool。",
    },
  ],
  context: [
    {
      phase: "context & memory",
      horizon: "week 13-14",
      focus: "设计短期会话状态、长期记忆、摘要、引用、清除和污染防护。",
      deliverables: ["memory store", "记忆污染案例分析"],
      interviewSignal: "能说明哪些记忆值得保存，哪些会带来风险。",
    },
  ],
  workflow: [
    {
      phase: "support workflow",
      horizon: "week 7-8",
      focus: "让 Agent 在多轮会话中完成查证、建议、审批、升级和摘要。",
      deliverables: ["状态机流程", "多轮处置 demo"],
      interviewSignal: "能把 Agent 接入真实客服流程，而不是只回答问题。",
    },
  ],
  guardrails: [
    {
      phase: "approval gates",
      horizon: "week 7-10",
      focus: "退款、补偿、改地址、关闭投诉等动作只生成 proposal，必须人工审批。",
      deliverables: ["approval queue", "危险动作拦截测试"],
      interviewSignal: "能把安全和权限作为 Harness 的一等能力。",
    },
  ],
  evaluation: [
    {
      phase: "benchmark & tracing",
      horizon: "week 9-16",
      focus: "构造任务集，记录 trace，评估意图、检索、工具、审批、升级和回答质量。",
      deliverables: ["benchmark runner", "策略对比报告"],
      interviewSignal: "能用指标证明 Agent 系统是否可靠。",
    },
  ],
  "multi-agent": [
    {
      phase: "delegation policy",
      horizon: "week 14",
      focus: "研究什么时候拆分 Triage、Policy、Response、Reviewer，而不是为了多 Agent 而多 Agent。",
      deliverables: ["delegation policy", "单 Agent vs 多 Agent 对比"],
      interviewSignal: "能证明多 Agent 是否带来收益，而不是角色扮演。",
    },
  ],
};

export const capstoneProject: CapstoneProject = {
  title: "Support Agent Harness Lab",
  subtitle: "面向客服后台的 Agent Harness：问答、工单、业务工具、审批、trace 与评估",
  why: "它把你的客服后台经验转化成 Agent 工程作品：RAG 作为知识工具，业务 API 作为行动工具，Harness 负责流程、权限、观测与评估。",
  modules: [
    "Support runtime: observe / classify / retrieve / tool / approve / respond / escalate",
    "Knowledge tools: FAQ、政策、SOP、历史工单检索，回答带引用和置信度",
    "Business tools: 用户、订单、退款、优惠券、工单 mock API 与参数校验",
    "Guardrails: 退款、补偿、关单等高风险动作进入人工审批队列",
    "Evaluator: 80-100 个客服场景，覆盖分类、检索、工具、升级和话术质量",
    "Trace UI: 每一步检索、工具调用、审批判断、成本、耗时和失败归因",
  ],
  proof: [
    "比较 no-retrieval、fixed-RAG、agentic-retrieval、tool+retrieval 四种策略",
    "展示意图准确率、工具选择准确率、引用覆盖率、升级正确率和违规动作拦截率",
    "附 50 条失败 trace 的归因分析：缺证据、错工具、误升级、话术风险、记忆污染",
  ],
};

export const supportWeeklyPlan: WeeklyPlan[] = [
  {
    week: "01",
    theme: "客服领域建模与最小 Agent Loop",
    streams: ["runtime", "prompting"],
    learn: ["ReAct 基本思想", "OpenAI Agents SDK 核心概念", "客服场景抽象"],
    build: ["定义场景 YAML", "实现 observe -> decide -> respond", "保存 trace JSON"],
    output: "10 个客服场景 + 最小 runtime demo",
    status: "active",
  },
  {
    week: "02",
    theme: "结构化输出与工具注册表",
    streams: ["prompting", "tool-use", "runtime"],
    learn: ["structured output", "tool schema 设计", "错误恢复提示"],
    build: ["intent/action/response schema", "tool registry", "格式失败重试"],
    output: "稳定输出 schema + 20 个场景",
  },
  {
    week: "03",
    theme: "Retrieval as Tool",
    streams: ["retrieval", "workflow"],
    learn: ["Agentic RAG", "文档切分与引用", "检索置信度"],
    build: ["FAQ/政策/SOP 检索工具", "回答引用证据"],
    output: "知识问答 demo + 20 条检索评测",
  },
  {
    week: "04",
    theme: "知识冲突与不确定升级",
    streams: ["retrieval", "evaluation", "workflow"],
    learn: ["检索评估", "冲突证据处理", "拒答/澄清策略"],
    build: ["知识冲突场景", "低置信度升级人工", "检索 trace"],
    output: "fixed-RAG vs agentic-retrieval 对比",
  },
  {
    week: "05",
    theme: "业务工具调用",
    streams: ["tool-use", "runtime"],
    learn: ["function calling", "MCP tools/resources", "API 工具边界"],
    build: ["用户/订单/工单 mock API", "工具参数校验", "工具错误恢复"],
    output: "业务查证 demo + 工具调用 trace",
  },
  {
    week: "06",
    theme: "退款、物流、账号类多工具流程",
    streams: ["tool-use", "workflow", "prompting"],
    learn: ["tool selection", "多工具组合", "状态汇总"],
    build: ["退款政策 + 订单状态组合判断", "工单创建工具", "客服摘要"],
    output: "3 类真实客服流程端到端跑通",
  },
  {
    week: "07",
    theme: "审批与安全护栏",
    streams: ["guardrails", "workflow"],
    learn: ["human-in-the-loop", "guardrails", "权限设计"],
    build: ["approval queue", "危险动作 proposal", "违规动作拦截测试"],
    output: "高风险动作审批 demo",
  },
  {
    week: "08",
    theme: "多轮处置与工作流状态机",
    streams: ["workflow", "runtime", "guardrails"],
    learn: ["LangGraph state", "workflow orchestration", "stop condition"],
    build: ["多轮会话状态", "升级人工", "关单/待补充状态"],
    output: "多轮客服处置 MVP",
  },
  {
    week: "09",
    theme: "评测集与指标体系",
    streams: ["evaluation", "retrieval"],
    learn: ["LLM app evaluation", "failure taxonomy", "LLM-as-judge 风险"],
    build: ["50 个任务 benchmark", "规则指标", "评测 runner"],
    output: "第一版评测报告",
  },
  {
    week: "10",
    theme: "Trace Viewer",
    streams: ["evaluation", "runtime"],
    learn: ["tracing 设计", "LangSmith/OpenAI tracing 思路", "可观测性"],
    build: ["会话列表", "step timeline", "证据/工具/审批面板"],
    output: "可回放 trace UI",
  },
  {
    week: "11",
    theme: "策略对比实验",
    streams: ["evaluation", "retrieval", "tool-use"],
    learn: ["ablation", "Agentic RAG 对比", "成本/质量权衡"],
    build: ["no-retrieval/fixed-RAG/agentic-RAG/tool+retrieval 四策略"],
    output: "四策略 benchmark 对比表",
  },
  {
    week: "12",
    theme: "失败归因与自动修复",
    streams: ["evaluation", "runtime", "workflow"],
    learn: ["trace-based debugging", "retry policy", "repair loop"],
    build: ["失败标签", "错工具重试", "缺证据再检索"],
    output: "50 条失败 trace 归因报告",
  },
  {
    week: "13",
    theme: "客服记忆系统",
    streams: ["context", "runtime"],
    learn: ["semantic/episodic/procedural memory", "记忆写入边界", "隐私风险"],
    build: ["用户历史摘要", "工单摘要记忆", "记忆引用与清除"],
    output: "Memory vs no-memory 对比实验",
  },
  {
    week: "14",
    theme: "多 Agent 角色拆分",
    streams: ["workflow", "multi-agent", "guardrails"],
    learn: ["handoff", "delegation policy", "Reviewer Agent"],
    build: ["Triage/Policy/Response/Reviewer agents", "委派 trace"],
    output: "单 Agent vs 多 Agent 对比",
  },
  {
    week: "15",
    theme: "工程化与部署形态",
    streams: ["runtime", "tool-use", "evaluation"],
    learn: ["FastAPI/队列/数据库设计", "沙箱与审计", "系统边界"],
    build: ["后端 API", "持久化 traces/tasks", "配置化模型与工具"],
    output: "可本地启动的完整工作台",
  },
  {
    week: "16",
    theme: "作品打磨与面试材料",
    streams: ["evaluation", "runtime", "prompting"],
    learn: ["技术叙事", "架构图", "benchmark report 写作"],
    build: ["README", "demo script", "最终报告", "简历项目描述"],
    output: "可投递版本 Support Agent Harness Lab",
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
