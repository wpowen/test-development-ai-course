#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, sans, mono, xml, defs as dsDefs, headerDef, css as dsCss, header as dsHeader, footer as dsFooter } from "./visual-design-system.mjs";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(SCRIPT_ROOT);
const OUTPUT_ROOTS = [
  path.join(ROOT, "courses/td-ai-agent-architecture-system/learner-materials/visuals"),
  path.join(ROOT, "site/public/materials/agent-architecture-system/visuals"),
];

const diagrams = [
  {
    id: "TD-AG-00",
    eyebrow: "AGENT TEST ARCHITECTURE · OVERVIEW",
    title: "D0–D7 Agent 测试架构总览",
    subtitle: "先校准评估系统，再检查能力、协作、可靠性、安全、经济性与治理；最后按四证据环升级。",
    sources: "来源：用户 Agent 架构材料（经审议）· S24 · S39 · S65",
    nodes: [
      ["input", 34, 116, 220, 86, "输入与风险", "任务、数据、权限、失败成本"],
      ["d0", 298, 116, 210, 86, "D0 评估可信", "Gold / Rubric / Judge Card"],
      ["d1", 552, 116, 210, 86, "D1 单体能力", "Intent / Tool / Span / Memory"],
      ["d2", 806, 116, 210, 86, "D2 编排协作", "Handoff / 隔离 / 熔断"],
      ["d3", 298, 254, 210, 86, "D3 人机协同", "中断 / 接管 / 确认疲劳"],
      ["d4", 552, 254, 210, 86, "D4 鲁棒可靠", "pass^k / Horizon / Recovery"],
      ["d5", 806, 254, 210, 86, "D5 安全对抗", "Injection / MCP / Sandbox"],
      ["d6", 298, 392, 210, 86, "D6 效率经济", "Latency / Goodput / Cost"],
      ["d7", 552, 392, 210, 86, "D7 业务治理", "Rule / Lineage / ROI / Owner"],
      ["rings", 806, 392, 330, 86, "四证据环", "离线 CI → 沙箱回放 → 影子 → 在线持续"],
      ["guard", 34, 530, 330, 92, "运行时护栏", "最小权限 · 预算 · 幂等 · Kill Switch"],
      ["decision", 432, 530, 330, 92, "决策与反馈", "BLOCKED / 证据不足 / 风险接受 / 回滚"],
      ["feedback", 830, 530, 306, 92, "生产反馈回流", "事故、漂移与新样例回到 D0–D7"],
    ],
    edges: [
      ["input", "d0", "先验证评估系统"], ["d0", "d1", "可信 Oracle"], ["d1", "d2", "能力进入协作"],
      ["d0", "d3", "人审与升级"], ["d1", "d4", "重复运行"], ["d2", "d5", "跨边界攻击面"],
      ["d3", "d6", "人工与时延成本"], ["d4", "d7", "可靠性进入治理"], ["d5", "rings", "安全硬门禁"],
      ["d6", "rings", "预算门禁"], ["d7", "rings", "责任与风险"], ["guard", "decision", "运行时强制"],
      ["rings", "decision", "逐环证据"], ["decision", "feedback", "发布/回滚"], ["feedback", "d0", "重新校准"],
    ],
    callout: "高危 blocker 不得用总分抵消；任何一环未运行都必须保持 NOT_RUN。",
    footer: "本图是测试边界与证据升级地图，不代表真实 Agent、企业集成或生产效果已验证。",
  },
  {
    id: "TD-AG-01", eyebrow: "D0 · EVALUATOR TRUST", title: "D0 Judge 校准与停用闭环",
    subtitle: "评估器也是被测系统：先建立金标和人工分歧，再决定 Judge 能自动评什么。", sources: "来源：S05 · S23 · S40",
    nodes: [
      ["gold", 34, 130, 200, 88, "金标样本", "版本、切片、来源"], ["human", 282, 130, 200, 88, "人工标注", "盲法双标 / 仲裁"],
      ["rubric", 530, 130, 200, 88, "Rubric", "构念、尺度、拒判"], ["judge", 778, 130, 200, 88, "Judge", "版本、Prompt、输出"],
      ["probe", 282, 326, 200, 88, "偏差探针", "顺序 / 长度 / 自偏好"], ["disagree", 530, 326, 200, 88, "分歧矩阵", "人人 / 人机 / Slice"],
      ["route", 778, 326, 200, 88, "自动 / 抽检 / 人审", "按风险选择路径"], ["stop", 530, 526, 248, 92, "停用与重校准", "FAIL → 修 Rubric / 换 Judge"],
    ],
    edges: [["gold","human","独立标注"],["human","rubric","争议塑造规则"],["rubric","judge","版本化执行"],["judge","probe","反偏差测试"],["probe","disagree","保留不一致"],["disagree","route","按风险分流"],["disagree","stop","超出适用域"],["stop","rubric","修订后重跑"],["stop","judge","换版桥接"]],
    callout: "Judge 不得审批自己的 Oracle；分歧样本不能被删除来制造一致。", footer: "Fixture 只验证合同和故障检测；真实模型 Judge、标注员和业务金标仍需独立运行。",
  },
  {
    id: "TD-AG-02", eyebrow: "D1 · TRAJECTORY", title: "D1 从 Task 到首错 Span 的轨迹判定",
    subtitle: "最终答案只是 Outcome；还要逐步检查工具、参数、观测使用与禁止副作用。", sources: "来源：S10 · S70 · S72",
    nodes: [
      ["task",34,134,190,86,"Task","业务目标 / 禁止动作"],["span",266,134,190,86,"Span","计划与单步意图"],
      ["tool",498,134,190,86,"Tool / Parameter","工具、参数、权限"],["obs",730,134,190,86,"Observation","返回值是否被正确使用"],
      ["first",498,326,190,86,"首错位置","最早偏离不变量"],["outcome",730,326,190,86,"Outcome Oracle","终态与业务结果"],
      ["trajectory",962,326,200,86,"Trajectory Decision","PASS / FAIL / BLOCKED"],["stop",266,526,238,92,"副作用阻断","禁止工具调用立即 FAIL"],
    ],
    edges: [["task","span","展开轨迹"],["span","tool","动作"],["tool","obs","工具结果"],["obs","span","继续 / 修正"],["tool","first","参数或权限错"],["obs","first","曲解观测"],["first","trajectory","定位根因"],["outcome","trajectory","终态证据"],["tool","stop","禁止副作用"],["stop","trajectory","硬失败"]],
    callout: "Outcome 正确不能抵消中途越权；也不能把唯一黄金路径当作唯一正确轨迹。", footer: "图中轨迹来自合成 fixture，不代表生产调用链已经接入。",
  },
  {
    id: "TD-AG-03", eyebrow: "D2 · ORCHESTRATION", title: "D2 Handoff、上下文隔离与级联熔断",
    subtitle: "每次 Agent A → Agent B 的交接都必须传递事实、责任、权限与停止条件。", sources: "来源：S35 · S48 · S74",
    nodes: [
      ["a",34,132,188,86,"Agent A","来源、事实、owner"],["handoff",262,132,210,86,"Handoff Schema","必传字段 / 语义约束"],
      ["isolate",512,132,210,86,"上下文隔离","最小可见 / 秘密隔离"],["b",762,132,188,86,"Agent B","受限任务 / 工具"],
      ["result",990,132,176,86,"返回合同","结果 / Unknown / Error"],["fault",512,326,210,86,"故障注入","超时 / 空结果 / 污染"],
      ["breaker",762,326,210,86,"三重熔断","步数 / 时间 / 成本"],["owner",990,326,176,86,"Owner","停止 / 降级 / 修复"],
      ["blocked",636,526,260,92,"BLOCKED 安全终态","不无限重试，不带病交接"],
    ],
    edges: [["a","handoff","结构化交接"],["handoff","isolate","最小上下文"],["isolate","b","授权执行"],["b","result","返回"],["result","a","受控反馈"],["fault","b","注入异常"],["b","breaker","超时/循环"],["breaker","owner","告警与责任"],["breaker","blocked","预算耗尽"],["owner","blocked","决定停止"]],
    callout: "增加重试次数不是可靠性修复；字段丢失、权限扩张和重复副作用都要有独立 Oracle。", footer: "本图只证明编排合同可教学与 fixture 可重放，不证明真实多 Agent 平台已验证。",
  },
  {
    id: "TD-AG-04", eyebrow: "D3 · HUMAN CONTROL", title: "D3 中断、脏状态、接管与恢复",
    subtitle: "确认按钮不是控制权；必须证明人能停止、看见状态、回滚、接管并安全交回。", sources: "来源：S07 · S23 · S65",
    nodes: [
      ["run",34,134,190,86,"Agent 运行","计划 / 状态 / 工具"],["interrupt",266,134,190,86,"人工中断","写操作前 / 后"],
      ["dirty",498,134,190,86,"脏状态检查","半成品 / 锁 / 队列"],["rollback",730,134,190,86,"回滚或补偿","恢复安全终态"],
      ["takeover",498,326,190,86,"人工接管","新 owner / 新上下文"],["resume",730,326,190,86,"安全恢复","交回或转人工终结"],
      ["audit",962,326,200,86,"审计证据","人、时间、决定、状态"],["blocked",266,526,260,92,"停止 / BLOCKED","无法清理状态则不恢复"],
    ],
    edges: [["run","interrupt","stop signal"],["interrupt","dirty","冻结并检查"],["dirty","rollback","存在副作用"],["dirty","takeover","状态可解释"],["rollback","takeover","清理后移交"],["takeover","resume","人工决定"],["resume","audit","记录结果"],["dirty","blocked","无法确认"],["blocked","audit","留下阻断证据"]],
    callout: "解释文本不等于可控；点击同意也不自动等于有效授权。", footer: "真实用户的确认疲劳与接管成功率仍需目标学习者/从业者实验。",
  },
  {
    id: "TD-AG-05", eyebrow: "D4 · RELIABILITY", title: "D4 pass@k、pass^k 与长时程可靠性",
    subtitle: "同一任务重复运行，分别观察至少一次成功、每次都成功、区间与时长衰减。", sources: "来源：S36 · S38 · S39",
    nodes: [
      ["tasks",34,134,190,86,"任务集","Task / Slice / 版本"],["runs",266,134,190,86,"重复运行","状态重置 / Seed / Retry"],
      ["at",498,134,190,86,"pass@k","k 次至少一次成功"],["all",730,134,190,86,"pass^k","k 次全部成功"],
      ["ci",498,326,190,86,"置信区间","paired / clustered"],["horizon",730,326,190,86,"Horizon","按任务时长看衰减"],
      ["decision",962,326,200,86,"可靠性决定","PASS / FAIL / 不足"],["insufficient",266,526,260,92,"证据不足","样本量或切片不充分"],
    ],
    edges: [["tasks","runs","分层采样"],["runs","at","聚合"],["runs","all","一致性"],["at","ci","不确定性"],["all","ci","不确定性"],["ci","horizon","按时长分层"],["horizon","decision","门禁"],["ci","insufficient","样本不足"],["insufficient","decision","EVIDENCE-INSUFFICIENT"]],
    callout: "pass@k 不能冒充稳定性；同一任务的重复 run 不能直接当作独立 Bernoulli 样本。", footer: "Fixture 展示统计语义；真实阈值、样本量和生产可靠性仍由场景 owner 决定。",
  },
  {
    id: "TD-AG-06", eyebrow: "D5 · CONTINUOUS SECURITY", title: "D5 Agent 攻击面、策略沙箱与爆炸半径",
    subtitle: "攻击可以来自用户、检索、MCP 工具、记忆和委托链；强制控制必须位于模型之外。", sources: "来源：S07 · S08 · S50",
    nodes: [
      ["input",34,120,190,86,"不可信输入","直接 / 间接 / 延迟注入"],["mcp",266,120,190,86,"MCP / Tool Manifest","描述、版本、rug-pull"],
      ["memory",498,120,190,86,"记忆污染","跨轮 / 跨会话"],["delegation",730,120,190,86,"委托链","用户 → Agent → 工具"],
      ["sandbox",498,322,210,92,"策略沙箱","Tenant / Scope / Schema / 额度"],["action",758,322,210,92,"不可逆动作","写入 / 转账 / 删除 / 外发"],
      ["owner",1012,322,154,92,"安全 Owner","升级与处置"],["kill",370,526,260,92,"Kill Switch / BLOCKED","立即停止并保留 Trace"],
    ],
    edges: [["input","sandbox","内容策略"],["mcp","sandbox","签名与实际权限"],["memory","sandbox","写前验证"],["delegation","sandbox","能力 token"],["sandbox","action","允许的最小能力"],["action","owner","高危升级"],["sandbox","kill","越权 / 变更 / 超限"],["action","kill","异常副作用"],["kill","owner","事故证据"]],
    callout: "模型说“不”不是安全证明；0 次成功攻击也不等于真实风险为 0。", footer: "本图与套件使用合成租户和无真实副作用数据；真实 MCP、密钥和生产权限均 NOT_RUN。",
  },
  {
    id: "TD-AG-07", eyebrow: "D6 · ECONOMICS", title: "D6 Task→Step→Tool 的质量、延迟与成本树",
    subtitle: "平均延迟和总 QPS 会掩盖长循环、重试放大、低 Goodput 与尾部成本。", sources: "来源：S51 · S53 · S73",
    nodes: [
      ["workload",34,134,190,86,"Workload","任务类型 / 风险 / 到达率"],["queue",266,134,190,86,"Queue","等待 / 并发 / 隔离"],
      ["llm",498,134,190,86,"LLM Step","TTFT / TPOT / Token"],["tool",730,134,190,86,"Tool Attempt","延迟 / Retry / Error"],
      ["quality",382,326,190,86,"Quality / Goodput","满足质量与时限"],["latency",614,326,190,86,"延迟尾部","P95 / P99 / Timeout"],
      ["cost",846,326,190,86,"成本尾部","模型 / 工具 / Judge / 人审"],["budget",498,526,260,92,"预算门禁 / 停止","Token / 时间 / 步数 / 金钱"],
    ],
    edges: [["workload","queue","施加负载"],["queue","llm","调度"],["llm","tool","工具阶段"],["llm","quality","输出质量"],["queue","latency","排队贡献"],["tool","latency","工具贡献"],["llm","cost","Token 成本"],["tool","cost","重试成本"],["quality","budget","联合决定"],["latency","budget","超限"],["cost","budget","超预算"]],
    callout: "增加预算或重试不能当作默认修复；必须联合看质量、尾延迟、成本与副作用。", footer: "图中的数值字段需绑定 workload、价格时间和版本；不提供通用 P95/P99 门槛。",
  },
  {
    id: "TD-AG-08", eyebrow: "D7 · GOVERNANCE", title: "D7 业务规则、四维版本、审计与风险接受",
    subtitle: "模型、Prompt、工具和 Memory 任一变化都可能改变 Agent；业务规则与发布责任必须独立。", sources: "来源：S24 · S64 · S65",
    nodes: [
      ["rule",34,128,190,86,"业务规则","硬规则 / 失败成本 / Owner"],["version",266,128,210,86,"四维版本","Model / Prompt / Tools / Memory"],
      ["delegate",516,128,190,86,"用户委托","身份 / Scope / Expiry"],["action",746,128,190,86,"工具动作","输入 / 输出 / 副作用"],
      ["audit",516,326,190,86,"审计证据","人、Agent、依据、时间"],["accept",746,326,210,86,"风险接受","补偿控制 / Expiry / 签字"],
      ["rollback",996,326,170,86,"回滚","版本与恢复目标"],["blocked",266,526,260,92,"BLOCKED","规则冲突或证据缺失"],
    ],
    edges: [["rule","version","约束版本"],["version","delegate","运行身份"],["delegate","action","受限授权"],["action","audit","留下链路"],["audit","accept","呈现剩余风险"],["accept","rollback","拒绝或回退"],["rule","blocked","规则冲突"],["audit","blocked","证据缺失"],["blocked","rollback","安全终态"]],
    callout: "平均质量分不能抵消业务硬规则；AI 不得批准 waiver 或签署风险接受。", footer: "Fixture 只验证 lineage 与门禁字段；真实组织责任、ROI 和审批仍为 Unknown/NOT_RUN。",
  },
  {
    id: "TD-AG-09", eyebrow: "FOUR EVIDENCE RINGS", title: "四证据环与三段式质量门禁",
    subtitle: "证据从离线 CI 升级到沙箱、影子和在线；每一环都需要新的输入、责任和回滚。", sources: "来源：S07 · S24 · S65",
    nodes: [
      ["ci",34,126,210,92,"离线 CI","确定性规则 / 小型 Eval"],["sandbox",284,126,210,92,"沙箱回放","轨迹 / 故障注入 / 无副作用"],
      ["shadow",534,126,210,92,"影子 / 灰度","真实流量但不生效"],["online",784,126,210,92,"在线持续","采样 / 高危全量 / 漂移"],
      ["hard",284,338,210,92,"硬红线","安全 / 业务 / D0 失效"],["stat",534,338,210,92,"统计门禁","区间 / Slice / 样本量"],
      ["risk",784,338,210,92,"风险接受","Owner / Expiry / 补偿 / 回滚"],["blocked",484,548,260,92,"BLOCKED / NOT_RUN","缺一环证据不得升级"],
    ],
    edges: [["ci","sandbox","entry/exit"],["sandbox","shadow","真实集成"],["shadow","online","受控升级"],["ci","hard","提交级阻断"],["sandbox","hard","副作用阻断"],["shadow","stat","配对比较"],["online","stat","线上切片"],["hard","blocked","任一红线"],["stat","risk","证据充分后"],["stat","blocked","证据不足"],["risk","blocked","拒绝或过期"]],
    callout: "离线 0/1/0 不能写成线上 PASS；不得用总分抵消安全 blocker。", footer: "当前课程只运行离线/沙箱式 fixture；影子与在线环保持 NOT_RUN。",
  },
  {
    id: "TD-AG-10", eyebrow: "HIGH-RISK ADAPTER", title: "交易/金融 Agent：时效、执行隔离与能力沙箱",
    subtitle: "高风险示例展示实时数据和不可逆动作如何改变测试责任；它不是所有 Agent 的通用阈值。", sources: "来源：S07 · S50 · S65",
    nodes: [
      ["fresh",34,132,190,86,"数据时效","Timestamp / Freshness Oracle"],["advice",266,132,190,86,"建议任务","只读 / UNKNOWN / 转人工"],
      ["execute",498,132,190,86,"执行任务","独立数据集 / 独立 Owner"],["sandbox",730,132,190,86,"能力沙箱","工具白名单 / Scope"],
      ["limit",498,326,190,86,"硬额度","工具层限额 / 频率"],["approval",730,326,190,86,"人工审批","双人确认 / 有效授权"],
      ["rollback",962,326,200,86,"回滚 / Kill Switch","分钟级停止与恢复"],["blocked",266,526,260,92,"BLOCKED","陈旧数据或未授权执行"],
    ],
    edges: [["fresh","advice","时效合格"],["fresh","blocked","过期"],["advice","execute","不得直接相连"],["execute","sandbox","执行入口"],["sandbox","limit","强制控制"],["limit","approval","高危动作"],["approval","rollback","拒绝/异常"],["sandbox","blocked","越权"],["blocked","rollback","保持无副作用"]],
    callout: "建议与执行必须物理隔离；Prompt 中的‘不要超额’不能替代工具硬限额。", footer: "本图不构成交易授权、合规意见或生产安全证明；所有资金系统均 NOT_RUN。",
  },
];

const nodeMap = (diagram) => new Map(diagram.nodes.map(([id, x, y, width, height, title, detail]) => [id, { id, x, y, width, height, title, detail }]));
const edgePath = (from, to) => {
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;
  const endX = to.x;
  const endY = to.y + to.height / 2;
  const midX = (startX + endX) / 2;
  if (endX >= startX) return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX - 8} ${endY}`;
  const below = Math.max(from.y + from.height, to.y + to.height) + 52;
  return `M ${startX} ${startY} C ${startX + 52} ${below}, ${endX - 52} ${below}, ${endX - 8} ${endY}`;
};

const toneForNode = (id) => {
  const stop = new Set(["blocked", "stop", "kill", "insufficient", "fault", "breaker"]);
  const gate = new Set(["guard", "sandbox", "approval", "owner", "budget", "decision", "rollback", "risk", "accept", "hard", "stat", "fresh"]);
  const calibrate = new Set(["d0", "gold", "judge", "probe", "rubric", "disagree"]);
  if (stop.has(id)) return { fill: tokens.redFill, stroke: "#e3a89f" };
  if (gate.has(id)) return { fill: tokens.amberFill, stroke: "#e0b76a" };
  if (calibrate.has(id)) return { fill: tokens.purpleFill, stroke: "#c9b8ea" };
  if (id === "rings") return { fill: tokens.mint, stroke: tokens.lime };
  return { fill: tokens.mint, stroke: tokens.sage };
};

const renderSvg = (diagram) => {
  const nodes = nodeMap(diagram);
  const edges = diagram.edges.map(([fromId, toId, label], index) => {
    const from = nodes.get(fromId);
    const to = nodes.get(toId);
    if (!from || !to) throw new Error(`${diagram.id} edge references missing node: ${fromId} -> ${toId}`);
    const labelX = (from.x + from.width + to.x) / 2;
    const labelY = (from.y + from.height / 2 + to.y + to.height / 2) / 2 - (index % 2 ? 8 : -10);
    return `<g class="edge"><path d="${edgePath(from, to)}" marker-end="url(#ds-arw-forest)"/><text x="${labelX}" y="${labelY}">${xml(label)}</text></g>`;
  }).join("\n");
  const nodeGroups = diagram.nodes.map(([id, x, y, width, height, title, detail], index) => {
    const tone = toneForNode(id);
    const isStop = ["blocked", "stop", "kill", "insufficient"].includes(id);
    return `
    <g class="node ${id}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="15" fill="${tone.fill}" stroke="${tone.stroke}" stroke-width="${isStop ? 2 : 1.4}" filter="url(#shadow)"/>
      <rect x="${x}" y="${y}" width="5" height="${height}" rx="2.5" fill="${tone.stroke}"/>
      <text class="node-index" x="${x + 20}" y="${y + 23}">${String(index + 1).padStart(2, "0")}</text>
      <text class="node-title" x="${x + 20}" y="${y + 48}">${xml(title)}</text>
      <text class="node-detail" x="${x + 20}" y="${y + 70}">${xml(detail)}</text>
    </g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 1200 760" width="1200" height="760">
  <title id="title">${xml(diagram.title)}</title>
  <desc id="desc">${xml(diagram.subtitle)} ${xml(diagram.footer)}</desc>
  ${headerDef()}
  ${dsDefs()}
  <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0e3026" flood-opacity=".10"/></filter>
  <style>
    .bg{fill:${tokens.paper}}.header{fill:url(#ds-header-grad)}.eyebrow{font:700 12px ${mono};letter-spacing:.14em;fill:${tokens.lime}}.title{font:800 28px ${sans};fill:white}.subtitle{font:450 13px ${sans};fill:${tokens.onDark}}.source{font:500 10.5px ${mono};fill:${tokens.onDarkMuted}}.node-index{font:800 10px ${mono};fill:${tokens.soft}}.node-title{font:800 15px ${sans};fill:${tokens.ink}}.node-detail{font:500 11px ${sans};fill:${tokens.muted}}.edge path{fill:none;stroke:${tokens.forest};stroke-width:2}.edge text{font:600 9px ${sans};fill:${tokens.muted};paint-order:stroke;stroke:${tokens.paper};stroke-width:4px}.callout{fill:${tokens.amberFill};stroke:#e3c07b;stroke-width:1.5}.callout-title{font:800 11px ${mono};letter-spacing:.1em;fill:${tokens.amber}}.callout-text{font:650 13px ${sans};fill:${tokens.ink}}.footer{font:500 11px ${sans};fill:${tokens.muted}}
  </style>
  <rect class="bg" width="1200" height="760" rx="24"/>
  <rect class="header" width="1200" height="92" rx="24"/><rect class="header" y="68" width="1200" height="24"/>
  <text class="eyebrow" x="34" y="30">${xml(diagram.eyebrow)}</text>
  <text class="title" x="34" y="62">${xml(diagram.title)}</text>
  <text class="subtitle" x="1166" y="30" text-anchor="end">${xml(diagram.subtitle)}</text>
  <text class="source" x="34" y="111">${xml(diagram.sources)}</text>
  ${edges}
  ${nodeGroups}
  <rect class="callout" x="34" y="658" width="1132" height="48" rx="12"/>
  <text class="callout-title" x="52" y="679">FAIL-CLOSED</text><text class="callout-text" x="170" y="681">${xml(diagram.callout)}</text>
  <text class="footer" x="34" y="735">${xml(diagram.footer)}</text>
</svg>\n`;
};

const renderMermaid = (diagram) => {
  const nodes = diagram.nodes.map(([id,,,,,title,detail]) => `  ${id}["${title}<br/><small>${detail}</small>"]`).join("\n");
  const edges = diagram.edges.map(([from, to, label]) => `  ${from} -->|${label}| ${to}`).join("\n");
  return `%% ${diagram.id} · ${diagram.sources}\n%% ${diagram.footer}\nflowchart LR\n${nodes}\n${edges}\n  classDef default fill:#eef8f4,stroke:#176b5b,color:#123f34;\n  classDef stop fill:#fff3db,stroke:#c87819,color:#62430f;\n  class blocked,stop,kill,insufficient stop;\n`;
};

for (const root of OUTPUT_ROOTS) mkdirSync(root, { recursive: true });
for (const diagram of diagrams) {
  const svg = renderSvg(diagram);
  const mermaid = renderMermaid(diagram);
  for (const root of OUTPUT_ROOTS) {
    writeFileSync(path.join(root, `${diagram.id}.svg`), svg, "utf8");
    writeFileSync(path.join(root, `${diagram.id}.mmd`), mermaid, "utf8");
  }
}

console.log(`generated ${diagrams.length} Agent architecture SVG/Mermaid pairs in ${OUTPUT_ROOTS.length} projections`);
