import type { TutorialPage } from "../course.ts";
import { agentPerformanceDeepBlocks } from "./agent-performance-deep.ts";

/** 在共享实验材料之外，为每页追加逐页不同的深度块（术语、判断表、反例、诊断树、演练、带走物）。 */
const withDeepLayer = (page: TutorialPage): TutorialPage => ({
  ...page,
  blocks: [...page.blocks, ...agentPerformanceDeepBlocks(page.id)],
});

const appendExecutedLabMaterial = (page: TutorialPage): TutorialPage => ({
  ...page,
  materials: [
    ...(page.materials ?? []),
    {
      title: "Agent 性能三态实验脚本",
      description: "各页 manifest 共同调用的确定性 baseline/fault/repair 执行器；仅证明本地 fixture 检测力。",
      href: "materials/agent-load-stability/scripts/agent_performance_lab.py",
      kind: "script",
      validation: "fixture-tested",
    },
  ],
});

export const agentPerformancePages: TutorialPage[] = ([
  {
    "id": "TD-AP01",
    "moduleId": "TD-M11",
    "order": 1,
    "title": "先建工作负载模型：Task 不是 HTTP Request",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "65 分钟",
    "summary": "把任务类型、上下文、工具路径、允许终态和故障分布写成版本化 workload，避免用单一 Prompt 或入口 2xx 假装代表真实 Agent。",
    "why": "Agent 一项用户任务可能展开成多轮模型、工具与重试；分母错了，吞吐、成功率和成本都会假绿。",
    "prerequisites": [],
    "outcomes": [
      "区分 task/run/request/model/tool 五种工作单元",
      "为每个任务切片定义业务 Oracle 与预算",
      "运行缺切片/缺 Oracle 的可检测故障"
    ],
    "artifact": "TD-AP01 工作负载模型与 Oracle 证据卡",
    "architecture": {
      "title": "TD-AP01 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "业务任务与风险切片",
        "版本化 workload fixture",
        "到达调度器",
        "Agent/模型/工具夹具",
        "task 终态 Oracle",
        "Gate 与证据卡"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "先从用户要完成的业务任务切片，而不是从 URL 或 Prompt 文案切片。每条样本同时保存 task_type、token_bucket、expected_tools、allowed_terminal_states、latency_budget 和 provenance。",
          "入口 2xx 只证明接收；task success 要验证最终终态、工具副作用与预算。模型调用、工具调用和 retry 是放大因子，不是用户任务分母。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "用户任务",
              "eligible task",
              "允许终态且副作用正确"
            ],
            [
              "Agent run",
              "run_id",
              "工作流到达合法终态"
            ],
            [
              "模型调用",
              "generation",
              "生成完成，不代表任务正确"
            ],
            [
              "工具调用",
              "tool attempt",
              "返回成功，不代表幂等正确"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "call_amplification = (model_calls + tool_calls) / eligible_tasks\nbusiness_success_rate = allowed_terminal_tasks / eligible_tasks",
          "verification": "逐条核对分母是 eligible_tasks，且 fixture 中每条任务都有 allowed terminal state。"
        },
        "expected": "逐条核对分母是 eligible_tasks，且 fixture 中每条任务都有 allowed terminal state。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "抽样真实但脱敏的 Trace，先按业务风险和路径分层",
          "为每层建立输入长度、步骤、工具、缓存和失败联合分布",
          "把观察流量、预测峰值和 synthetic fault 分开标注",
          "版本化数据、价格、Prompt、工具 schema 与业务 Oracle"
        ],
        "warning": "fault 将 represented_slice_rate 与 business_oracle_rate 同时降到 0.5；删除阈值或用入口 2xx 替代 Oracle 都不算修复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP01 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP01/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP01/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP01/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP01/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP01/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP01-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP01-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP01/baseline/summary.json",
            "reports/TD-AP01/fault/summary.json",
            "reports/TD-AP01/repair/summary.json",
            "reports/TD-AP01/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP01、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP01 cycle 并保存 0/1/0",
      "fault 将 represented_slice_rate 与 business_oracle_rate 同时降到 0.5；删除阈值或用入口 2xx 替代 Oracle 都不算修复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S48",
      "S68",
      "S72",
      "S75",
      "S77"
    ],
    "evidenceBoundary": "工作负载建模机制来自公开来源；示例任务分布是 deterministic fixture。真实峰值、路径和容量仍为 Unknown。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP01.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP01-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP01.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP01/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP02",
    "moduleId": "TD-M11",
    "order": 2,
    "title": "建立指标树：TTFT、TPOT、Queue、Retry、Step",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "把用户等待拆为排队、首 Token、逐 Token、工具、重试和编排，并用 task success 与 goodput 防止只追求吞吐。",
    "why": "单一 E2E 平均值无法说明慢在何处；不控制输入/输出 Token、任务类型与步骤数，版本比较没有可解释性。",
    "prerequisites": [
      "TD-AP01"
    ],
    "outcomes": [
      "正确解释 TTFT、TPOT/ITL、Queue 和 E2E",
      "为 retry 与 step 指标写清分母和门禁",
      "从红灯下钻到可行动的根因候选"
    ],
    "artifact": "TD-AP02 Agent 性能指标字典",
    "architecture": {
      "title": "TD-AP02 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "计划到达时间",
        "Queue wait",
        "Prefill/TTFT",
        "Decode/TPOT",
        "Tool/Retry/Step",
        "Task Goodput Gate"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "TTFT 包含排队与 Prefill；TPOT/ITL 描述首 Token 后的生成节奏；E2E 还包括工具、重试与编排。比较前必须固定或分桶 input/output tokens。",
          "Retry 与 Step 是 Agent 特有放大器。最终成功也可能经过大量尝试，所以要同时看 retry_p95、step_p95、cost_per_success 和 goodput。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "queue_p95",
              "started_at-admitted_at",
              "调度/容量"
            ],
            [
              "TTFT p95",
              "first_token-request",
              "排队+Prefill"
            ],
            [
              "TPOT p95",
              "decode time/token",
              "Decode 竞争"
            ],
            [
              "retry p95",
              "extra attempts/task",
              "依赖不稳/策略"
            ],
            [
              "step p95",
              "model+tool steps/task",
              "循环/路由退化"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "good_task = business_success && e2e_ms <= budget && retry_count <= budget\ngoodput = good_tasks / observed_duration_seconds",
          "verification": "用相同 workload_version 重算 fault 和 repair；任何不满足质量/延迟/重试预算的任务不得进入 goodput。"
        },
        "expected": "用相同 workload_version 重算 fault 和 repair；任何不满足质量/延迟/重试预算的任务不得进入 goodput。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "先按 task_type 与 token bucket 分组",
          "先读 queue，再读 TTFT/TPOT，再读工具与 retry/step",
          "分开成功和失败延迟，保留 p50/p95/p99",
          "每个告警指标写 owner、窗口、阈值来源与动作"
        ],
        "warning": "fault 同时增加 TTFT、TPOT、Queue、Retry 和 Step，五个门禁应全部红；repair 不能删掉任何指标。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP02 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP02/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP02/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP02/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP02/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP02/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP02-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP02/baseline/summary.json",
            "reports/TD-AP02/fault/summary.json",
            "reports/TD-AP02/repair/summary.json",
            "reports/TD-AP02/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP02、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP02 cycle 并保存 0/1/0",
      "fault 同时增加 TTFT、TPOT、Queue、Retry 和 Step，五个门禁应全部红；repair 不能删掉任何指标。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S51",
      "S67",
      "S69",
      "S73",
      "S74"
    ],
    "evidenceBoundary": "指标语义可迁移，阈值不可迁移。当前数字只证明 fixture 检测力，不证明真实模型性能。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP02.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP02-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP02.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP02/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP03",
    "moduleId": "TD-M11",
    "order": 3,
    "title": "锁定 Trace 语义：从 Task Root 到 Tool Attempt",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "设计一条 task 一个根 Trace、generation/tool/retry/handoff 为子 Span 的证据模型，并把标准字段、本地扩展和隐私策略分开。",
    "why": "只有日志和最终延迟时，无法判断排队、模型、工具、重试或未埋点等待；Trace 缺父子关系也会让因果链断裂。",
    "prerequisites": [
      "TD-AP02"
    ],
    "outcomes": [
      "画出 task-rooted Span 树",
      "区分标准 gen_ai 字段与 app 扩展",
      "检测 orphan span、缺终态和高基数风险"
    ],
    "artifact": "TD-AP03 Trace Schema 与字段治理表",
    "architecture": {
      "title": "TD-AP03 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "invoke_agent root",
        "queue.wait span",
        "gen_ai generation span",
        "execute_tool attempt span",
        "task.finalize event",
        "Metric/Trace/Log 存储与访问"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "Span 表示有时长的操作，parent/span context 组成树。一个 task root 下保存 generation、tool、retry、handoff 与 finalize，才能从用户症状追到具体步骤。",
          "OpenTelemetry GenAI Agent 约定仍在 Development。锁定 schema/version；缺少的 task、attempt、budget、oracle 字段放在 app.*，不要冒充稳定标准。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "Metric",
              "低基数速率/分位数",
              "不要放 task_id、原文"
            ],
            [
              "Trace",
              "单任务关键路径/attempt",
              "按风险采样与保留"
            ],
            [
              "Log",
              "离散错误/审计事件",
              "不能替代结构化耗时"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "unattributed_ms = task_e2e_ms - critical_path_ms\ntrace_complete = root && all_required_children_parented && terminal_event",
          "verification": "从 fault traces.jsonl 抽一条 orphan span；验证 trace_complete_rate 门禁拒绝它。"
        },
        "expected": "从 fault traces.jsonl 抽一条 orphan span；验证 trace_complete_rate 门禁拒绝它。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "根 Span 使用低基数操作名，实例标识放属性",
          "模型/工具每次物理尝试单独 Span，逻辑调用另用 parent/link",
          "正文默认不采集，仅保存长度、版本、哈希和分类",
          "慢/错任务提高采样率，但访问、保留和审计另设策略"
        ],
        "warning": "fault 让 45% generation/tool Span 丢失父子关联；repair 恢复关联，而不是在报表端伪造 parent。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP03 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP03/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP03/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP03/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP03/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP03/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP03-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP03/baseline/summary.json",
            "reports/TD-AP03/fault/summary.json",
            "reports/TD-AP03/repair/summary.json",
            "reports/TD-AP03/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP03、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP03 cycle 并保存 0/1/0",
      "fault 让 45% generation/tool Span 丢失父子关联；repair 恢复关联，而不是在报表端伪造 parent。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S49",
      "S70",
      "S71",
      "S72",
      "S80"
    ],
    "evidenceBoundary": "Trace 结构是课程实现；语义约定仍会变化，生产前需锁版本、验证后端兼容并完成隐私评审。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP03.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP03-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP03.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP03/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP04",
    "moduleId": "TD-M11",
    "order": 4,
    "title": "对照开放与封闭负载：识别 Coordinated Omission",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "用同一 workload 分别控制到达率和并发，观察系统变慢时闭环如何自动降速，并记录计划到达与实际完成。",
    "why": "固定并发中，系统越慢发压端越慢，恰好漏掉本应继续到达的用户任务，容易把过载写成健康。",
    "prerequisites": [
      "TD-AP03"
    ],
    "outcomes": [
      "解释 open/closed 模型控制量",
      "识别 coordinated omission",
      "为容量、用户并发和回放选择合适负载"
    ],
    "artifact": "TD-AP04 开闭环对照报告",
    "architecture": {
      "title": "TD-AP04 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "固定 workload",
        "Open arrival scheduler",
        "Closed VU scheduler",
        "同一 Agent fixture",
        "计划/实际到达记录",
        "Queue/Goodput 对照"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "闭环中下次迭代等待上次完成，适合固定并发用户体验；开环到达与完成解耦，更直接测试每秒固定任务到来时的排队和拒绝。",
          "模型不是优劣关系。容量边界、突发和过载优先开环；固定用户/会话并发可用闭环。两者用同一任务分布交叉验证。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "Closed",
              "并发 VU",
              "用户被系统速度反压",
              "可能漏记等待中的到达"
            ],
            [
              "Open",
              "arrival rate",
              "容量/排队/拒绝",
              "需限制队列与发压资源"
            ],
            [
              "Replay",
              "真实时间间隔",
              "已知业务回归",
              "历史不代表未来峰值"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "arrival_fidelity = min(observed_rate,target_rate) / max(observed_rate,target_rate)\ncoordinated_omission_risk = closed_loop && service_time_controls_next_arrival",
          "verification": "比较 fault 的 closed load 与 repair 的 open load；不能只因 closed p95 较低就宣布容量更高。"
        },
        "expected": "比较 fault 的 closed load 与 repair 的 open load；不能只因 closed p95 较低就宣布容量更高。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "固定 task mix、seed、资源和 gate",
          "同时记录 scheduled_at、admitted_at、started_at、completed_at",
          "报告 dropped/queued/rejected，而非无限排队",
          "校验发压端 CPU/连接池，避免负载生成器成为瓶颈"
        ],
        "warning": "fault 把容量实验换成 closed load，并降低 worker、放慢工具；应被 coordinated_omission 与 arrival fidelity 拒绝。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP04 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP04/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP04/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP04/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP04/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP04/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP04-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP04/baseline/summary.json",
            "reports/TD-AP04/fault/summary.json",
            "reports/TD-AP04/repair/summary.json",
            "reports/TD-AP04/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP04、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP04 cycle 并保存 0/1/0",
      "fault 把容量实验换成 closed load，并降低 worker、放慢工具；应被 coordinated_omission 与 arrival fidelity 拒绝。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S48",
      "S68",
      "S75",
      "S77"
    ],
    "evidenceBoundary": "实验说明负载模型差异；它不包含真实 think time、峰值预测或生产资源，因此不能输出生产容量。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP04.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP04-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP04.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP04/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP05",
    "moduleId": "TD-M11",
    "order": 5,
    "title": "寻找容量边界并归因瓶颈：只报告 Synthetic Goodput",
    "type": "项目",
    "status": "fixture-tested",
    "duration": "85 分钟",
    "summary": "在固定合成 workload 上逐级加压，找到第一个 SLO 失效阶梯，并用 queue/prefill/decode/tool/retry 信号给出瓶颈证据。",
    "why": "最大 QPS 可能来自错误、超时或降质任务；没有工作负载版本和瓶颈证据的容量数字不可用于采购或生产承诺。",
    "prerequisites": [
      "TD-AP04"
    ],
    "outcomes": [
      "画出 load-goodput-latency 曲线",
      "识别第一个门禁失效点",
      "用控制变量验证瓶颈假设"
    ],
    "artifact": "TD-AP05 Synthetic 容量曲线与瓶颈证据卡",
    "architecture": {
      "title": "TD-AP05 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "阶梯到达率",
        "Admission/Queue",
        "Agent Scheduler",
        "Model Prefill/Decode",
        "Tool Dependency",
        "Goodput Gate 与瓶颈对照"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "每个阶梯保持足够稳态，记录 offered load、accepted、completed、goodput、queue 与资源。当 latency/quality/cost 任一 gate 首次失败，前一稳定阶梯才是当前夹具的可持续点。",
          "瓶颈归因是证据链：症状→假设→确认/反证指标→一次只改一个变量的复跑。Queue 高并不自动等于 GPU 不足。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "queue↑ TTFT↑",
              "调度/模型饱和",
              "降到达或增 worker 对照"
            ],
            [
              "TTFT↑ token↑",
              "Prefill",
              "固定长度桶"
            ],
            [
              "TPOT↑ GPU高",
              "Decode",
              "固定输出与并发"
            ],
            [
              "tool p95↑ retry↑",
              "依赖/策略",
              "固定工具夹具"
            ],
            [
              "step↑ 资源平",
              "Agent 循环",
              "对比 workflow/prompt"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "synthetic_goodput = good_fixture_tasks / test_seconds\nfirst_failure_step = min(load_step where any versioned gate fails)",
          "verification": "报告必须带 synthetic/fixture 标签、profile hash 与第一个失败 gate；禁止把结果改名为 production capacity。"
        },
        "expected": "报告必须带 synthetic/fixture 标签、profile hash 与第一个失败 gate；禁止把结果改名为 production capacity。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "低负载建立 service-time baseline",
          "阶梯增加 open arrival rate，每阶梯等待稳态",
          "固定 token/path/failure mix，保存 run manifest",
          "用一个变量复跑确认 bottleneck，再讨论扩容或优化"
        ],
        "warning": "fault 压低 worker、提高到达率、放慢 tool 且隐藏 bottleneck；goodput、queue、attribution 应红。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP05 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP05/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP05/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP05/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP05/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP05/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP05-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP05/baseline/summary.json",
            "reports/TD-AP05/fault/summary.json",
            "reports/TD-AP05/repair/summary.json",
            "reports/TD-AP05/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP05、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP05 cycle 并保存 0/1/0",
      "fault 压低 worker、提高到达率、放慢 tool 且隐藏 bottleneck；goodput、queue、attribution 应红。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S51",
      "S67",
      "S68",
      "S69",
      "S75"
    ],
    "evidenceBoundary": "所有容量与 goodput 数字仅属于本地 deterministic synthetic fixture，不能用于生产 Sizing、SLA 或供应商比较。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP05.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP05-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP05.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP05/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP06",
    "moduleId": "TD-M11",
    "order": 6,
    "title": "约束超时与重试：压力下安全降级",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "80 分钟",
    "summary": "把 gateway、SDK、Agent 和 Tool 的多层尝试纳入一个总 deadline/retry budget，并为只读、人工和拒绝终态定义安全降级。",
    "why": "每层各重试 3 次会乘法放大；延迟变长触发更多重试，又进一步加剧排队和依赖过载。",
    "prerequisites": [
      "TD-AP05"
    ],
    "outcomes": [
      "计算多层重试放大",
      "设计总 deadline 与 attempts budget",
      "验证重试风暴被拒绝且 repair 不删 gate"
    ],
    "artifact": "TD-AP06 超时/重试/降级策略与 0/1/0 证据",
    "architecture": {
      "title": "TD-AP06 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "Ingress deadline",
        "Agent task budget",
        "Model SDK retry",
        "Tool retry/breaker",
        "Read-only/Human degrade",
        "Gate + reconciliation"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "重试只适用于暂态且幂等的失败，并尊重 Retry-After；指数退避加 jitter 减少同步重放，但仍需总 attempts 和 deadline。",
          "降级要定义合法终态：高风险写操作可切人工或只读，不能把失败模型输出直接当成功。恢复时逐级放量，避免积压瞬间重放。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "429/503",
              "在预算内重试",
              "Retry-After + jitter"
            ],
            [
              "400/401/403",
              "不重试",
              "修配置/权限"
            ],
            [
              "写工具超时",
              "先对账",
              "不可盲重放"
            ],
            [
              "队列超限",
              "拒绝/人工",
              "不可无限排队"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "worst_attempts_without_budget = gateway * sdk * agent * tool\ntotal_deadline >= sum(per_step_timeout) + bounded_backoff",
          "verification": "fault 的 retry_p95、timeout_budget_valid、task_success 必须红；repair 通过限制 attempts 与安全降级恢复。"
        },
        "expected": "fault 的 retry_p95、timeout_budget_valid、task_success 必须红；repair 通过限制 attempts 与安全降级恢复。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "列出所有重试层与 retryable code",
          "把绝对 deadline 沿调用链传递",
          "写工具携带幂等键并在超时后先 reconciliation",
          "队列/错误预算超限时冻结放量、限重试、切只读/人工"
        ],
        "warning": "fault 允许 3–5 次重试、提高失败率并移除压力降级，形成可见重试风暴。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP06 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP06/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP06/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP06/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP06/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP06/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP06-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP06/baseline/summary.json",
            "reports/TD-AP06/fault/summary.json",
            "reports/TD-AP06/repair/summary.json",
            "reports/TD-AP06/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP06、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP06 cycle 并保存 0/1/0",
      "fault 允许 3–5 次重试、提高失败率并移除压力降级，形成可见重试风暴。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S48",
      "S57",
      "S67",
      "S75"
    ],
    "evidenceBoundary": "当前 0/1/0 证明 fixture gate 与策略方向；真实依赖语义、幂等和补偿责任仍需集成与从业者评审。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP06.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP06-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP06.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP06/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP07",
    "moduleId": "TD-M11",
    "order": 7,
    "title": "运行长稳测试：识别资源泄漏与漂移",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "80 分钟",
    "summary": "用资源斜率、平台期、快照差分、cleanup 成功率和尾延迟趋势区分冷启动、缓存热身、有界缓存与泄漏。",
    "why": "十分钟峰值可能完全看不到内存、连接、线程、KV cache 或会话状态的单调增长；只看终点值也无法证明因果。",
    "prerequisites": [
      "TD-AP06"
    ],
    "outcomes": [
      "设计 soak 负载与观察窗口",
      "计算内存/资源斜率",
      "用快照差分和清理证据验证修复"
    ],
    "artifact": "TD-AP07 长稳趋势与资源差分报告",
    "architecture": {
      "title": "TD-AP07 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "固定长期 workload",
        "Process/GPU/Cache sampler",
        "Task Trace",
        "Periodic snapshots",
        "Cleanup/Reconciliation",
        "Slope + latency gate"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "先设热身窗口，再在稳态窗口计算 slope。缓存增长后平台化与真正泄漏不同；还要看 cleanup、吞吐、p95/p99 和重启/GC 事件。",
          "tracemalloc 等快照工具能定位分配差异，但生产 GPU allocator、驱动和外部进程需各自观测。Issue 只能提供故障线索，不能代替目标版本复现。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "热身",
              "先升后稳",
              "排除初始窗口"
            ],
            [
              "有界缓存",
              "增长后平台",
              "验证淘汰与命中"
            ],
            [
              "泄漏候选",
              "持续正斜率",
              "快照/对象/句柄差分"
            ],
            [
              "清理失效",
              "run 结束仍残留",
              "reconciliation/owner"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "resource_slope = (resource_end - resource_start) / completed_tasks\nleak_candidate = slope > budget && no_plateau && cleanup_rate < target",
          "verification": "fault 注入 0.8MB/task 和 cleanup failure；repair 必须在相同任务数下同时恢复 slope 与 cleanup。"
        },
        "expected": "fault 注入 0.8MB/task 和 cleanup failure；repair 必须在相同任务数下同时恢复 slope 与 cleanup。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "固定任务分布、到达率、资源与版本",
          "分热身/稳态/恢复三个窗口",
          "周期采集 RSS/GPU/cache/FD/thread/queue 与任务指标",
          "对异常窗口做 snapshot diff，并验证 cleanup/restart 后是否回收"
        ],
        "warning": "fault 产生单调内存增长并让四分之一 cleanup 失败；只重启进程不能算根因修复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP07 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP07/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP07/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP07/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP07/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP07/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP07-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP07/baseline/summary.json",
            "reports/TD-AP07/fault/summary.json",
            "reports/TD-AP07/repair/summary.json",
            "reports/TD-AP07/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP07、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP07 cycle 并保存 0/1/0",
      "fault 产生单调内存增长并让四分之一 cleanup 失败；只重启进程不能算根因修复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S51",
      "S67",
      "S68",
      "S75"
    ],
    "evidenceBoundary": "本地用合成 memory slope 教学；生产泄漏必须在目标运行时、驱动、缓存与真实任务切片上复现。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP07.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP07-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP07.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP07/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP08",
    "moduleId": "TD-M11",
    "order": 8,
    "title": "把结果接入 SLO、告警与事故证据",
    "type": "项目",
    "status": "fixture-tested",
    "duration": "90 分钟",
    "summary": "以 good task 为 SLI，把多窗口 burn-rate 告警连接到具体 owner、止血、降级、恢复和事故样例回流。",
    "why": "上线前压测只证明某一版本和环境。模型、Prompt、工具、流量与价格持续变化，生产需要用户症状 SLO 和可执行 Runbook。",
    "prerequisites": [
      "TD-AP07"
    ],
    "outcomes": [
      "定义 task-centered SLI/SLO",
      "区分 Page 症状与诊断指标",
      "交付带 Trace/版本/动作的事故证据卡"
    ],
    "artifact": "TD-AP08 Agent SLO、告警与事故 Runbook",
    "architecture": {
      "title": "TD-AP08 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "Eligible task stream",
        "Good-task evaluator",
        "SLI/Error budget",
        "Multi-window alert",
        "Runbook mitigation",
        "Incident-to-workload regression"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "good task 同时满足正确终态、时延、重试/成本预算、策略和副作用安全。高风险写任务应单独切片；模型 99.9% 可用不能替代业务任务 SLO。",
          "Page 用于需要立即行动的用户症状或错误预算快速燃烧。Queue、TTFT、tool、retry、cost 主要用于诊断，除非它们本身有明确 owner 与动作。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "P1",
              "重复副作用/高风险错终态",
              "停止写工具、回滚、人工"
            ],
            [
              "P2",
              "good-task burn rate",
              "冻结放量、降级"
            ],
            [
              "诊断",
              "queue/TTFT/tool/retry",
              "定位后执行 owner action"
            ],
            [
              "趋势",
              "成本/步骤/长度漂移",
              "容量与流程改进"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "task_sli = good_tasks / eligible_tasks\nburn_rate = observed_bad_task_rate / allowed_bad_task_rate",
          "verification": "fault 同时降低 good-task、移除 alert action 与 incident evidence；任何一项缺失都必须 fail-closed。"
        },
        "expected": "fault 同时降低 good-task、移除 alert action 与 incident evidence；任何一项缺失都必须 fail-closed。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "明确 eligible 与 good-task 判定、窗口和数据源",
          "用快慢多窗口控制 page 灵敏度",
          "Runbook 写三条安全止血、回滚与逐级恢复",
          "把 incident trace、版本和 mutation 回流为新 workload slice"
        ],
        "warning": "fault 让 good-task rate 下降，且没有告警动作和事故证据；repair 要三项同时恢复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP08 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP08/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP08/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP08/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP08/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP08/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP08-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP08/baseline/summary.json",
            "reports/TD-AP08/fault/summary.json",
            "reports/TD-AP08/repair/summary.json",
            "reports/TD-AP08/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP08、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP08 cycle 并保存 0/1/0",
      "fault 让 good-task rate 下降，且没有告警动作和事故证据；repair 要三项同时恢复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S48",
      "S70",
      "S71",
      "S75",
      "S76"
    ],
    "evidenceBoundary": "SLO/告警结构来自 SRE 方法；组织阈值、值班责任、业务等级与合规保留期仍为 Unknown。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP08.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP08-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP08.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP08/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  }
] satisfies TutorialPage[]).map(appendExecutedLabMaterial).map(withDeepLayer);
