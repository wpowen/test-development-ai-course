export type DocumentType = "beginner-tutorial" | "professional-how-to" | "reference" | "explanation" | "decision-report";
export type ReaderJob = "learn" | "do" | "look-up" | "understand" | "report-decide";
export type Audience = "beginner" | "practitioner" | "reviewer" | "decision-owner";

type PageContractSeed = {
  id: string;
  type: "概念" | "跟做" | "诊断" | "参考" | "项目";
  summary: string;
  why: string;
  prerequisites: string[];
  outcomes: string[];
  artifact: string;
  blocks: Array<{ title: string }>;
  practice: string[];
  completion: string[];
  evidenceBoundary: string;
};

export type PageDocumentContract = {
  documentType: DocumentType;
  readerJob: ReaderJob;
  audience: Audience[];
  scope: {
    inScope: string[];
    outOfScope: string[];
    assumptions: string[];
  };
  claims: string[];
  learningContract?: {
    objective: string;
    workedExample: string;
    guidedPractice: string[];
    feedbackChecks: string[];
    independentArtifact: string;
    transferPrompt: string;
  };
  procedure?: {
    prerequisites: string[];
    inputs: string[];
    steps: string[];
    expectedResults: string[];
    recovery: string[];
    rollback: string;
  };
  referenceContract?: {
    definitions: string[];
    versionScope: string;
    limitations: string[];
    failureAction: string;
  };
  explanationContract?: {
    mechanism: string[];
    causalQuestions: string[];
    tradeoffs: string[];
    counterexamples: string[];
    applicability: string;
  };
  reportContract?: {
    question: string;
    method: string[];
    expectedEvidence: string[];
    uncertainty: string;
    limitations: string[];
    recommendation: string;
    decisionOwner: string;
    decisionDeadline: string;
  };
};

type DocumentAssignment = { documentType: DocumentType; readerJob: ReaderJob };

// Explicit page ownership. This table is reviewed as content metadata; it must
// not be inferred from the legacy visual/activity `page.type` field.
export const PAGE_DOCUMENT_ASSIGNMENTS = {
  "TD-F01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-P01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-P02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-P03": { documentType: "professional-how-to", readerJob: "do" },
  "TD-P04": { documentType: "explanation", readerJob: "understand" },
  "TD-P05": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-P06": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-P07": { documentType: "professional-how-to", readerJob: "do" },
  "TD-P08": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-PS01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-PS02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-PS03": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS04": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-PS05": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS06": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS07": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS08": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS09": { documentType: "professional-how-to", readerJob: "do" },
  "TD-PS10": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-PS11": { documentType: "explanation", readerJob: "understand" },
  "TD-PS12": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X101": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-FP01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-F02": { documentType: "explanation", readerJob: "understand" },
  "TD-F03": { documentType: "explanation", readerJob: "understand" },
  "TD-F04": { documentType: "explanation", readerJob: "understand" },
  "TD-T01": { documentType: "reference", readerJob: "look-up" },
  "TD-T02": { documentType: "explanation", readerJob: "understand" },
  "TD-T03": { documentType: "explanation", readerJob: "understand" },
  "TD-T04": { documentType: "reference", readerJob: "look-up" },
  "TD-T05": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T06": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T07": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T08": { documentType: "professional-how-to", readerJob: "do" },
  "TD-A01": { documentType: "explanation", readerJob: "understand" },
  "TD-A02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-A03": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-A04": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-A05": { documentType: "professional-how-to", readerJob: "do" },
  "TD-A06": { documentType: "professional-how-to", readerJob: "do" },
  "TD-T09": { documentType: "professional-how-to", readerJob: "do" },
  "TD-T10": { documentType: "professional-how-to", readerJob: "do" },
  "TD-T11": { documentType: "professional-how-to", readerJob: "do" },
  "TD-T12": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X501": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X502": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T13": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-T14": { documentType: "professional-how-to", readerJob: "do" },
  "TD-T15": { documentType: "explanation", readerJob: "understand" },
  "TD-T16": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-T17": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-T18": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-T19": { documentType: "professional-how-to", readerJob: "do" },
  "TD-W01": { documentType: "explanation", readerJob: "understand" },
  "TD-W02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-W03": { documentType: "professional-how-to", readerJob: "do" },
  "TD-X603": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X604": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X602": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-X601": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T20": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T21": { documentType: "reference", readerJob: "look-up" },
  "TD-T22": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T23": { documentType: "reference", readerJob: "look-up" },
  "TD-T24": { documentType: "professional-how-to", readerJob: "do" },
  "TD-X805": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-B01": { documentType: "explanation", readerJob: "understand" },
  "TD-B02": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-B03": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-B04": { documentType: "professional-how-to", readerJob: "do" },
  "TD-B05": { documentType: "professional-how-to", readerJob: "do" },
  "TD-B06": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-QP01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-QP02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-QP03": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-QP04": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-T25": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-C01": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-C02": { documentType: "explanation", readerJob: "understand" },
  "TD-C03": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-C04": { documentType: "reference", readerJob: "look-up" },
  "TD-F05": { documentType: "reference", readerJob: "look-up" },
  "TD-T26": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-R01": { documentType: "reference", readerJob: "look-up" },
  "TD-AP01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP03": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP04": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP05": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AP06": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP07": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AP08": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-00": { documentType: "explanation", readerJob: "understand" },
  "TD-AG-01": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AG-02": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AG-03": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AG-04": { documentType: "beginner-tutorial", readerJob: "learn" },
  "TD-AG-05": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-06": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-07": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-08": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-09": { documentType: "decision-report", readerJob: "report-decide" },
  "TD-AG-10": { documentType: "decision-report", readerJob: "report-decide" },
} as const satisfies Record<string, DocumentAssignment>;

const audiences: Record<DocumentType, Audience[]> = {
  "beginner-tutorial": ["beginner", "practitioner"],
  "professional-how-to": ["practitioner", "reviewer"],
  reference: ["practitioner", "reviewer"],
  explanation: ["beginner", "practitioner", "reviewer"],
  "decision-report": ["practitioner", "reviewer", "decision-owner"],
};

const failClosedRecovery = "结果与预期不一致时停止，保存输入、版本、实际输出和失败证据；不得修改 Oracle 或删除失败样本来换取通过。";

export const buildPageDocumentContract = (page: PageContractSeed): PageDocumentContract => {
  const assignment = PAGE_DOCUMENT_ASSIGNMENTS[page.id as keyof typeof PAGE_DOCUMENT_ASSIGNMENTS];
  if (!assignment) throw new Error(`missing explicit document assignment for ${page.id}`);
  const { documentType, readerJob } = assignment;
  const base: PageDocumentContract = {
    documentType,
    readerJob,
    audience: audiences[documentType],
    scope: {
      inScope: [page.summary],
      outOfScope: [page.evidenceBoundary],
      assumptions: page.prerequisites.length > 0 ? page.prerequisites : ["不要求额外前置页面；仍需遵守本页证据边界。"],
    },
    claims: [page.why, ...page.outcomes],
  };

  if (documentType === "beginner-tutorial") {
    return {
      ...base,
      learningContract: {
        objective: page.outcomes[0] ?? page.summary,
        workedExample: page.blocks[0]?.title ?? page.summary,
        guidedPractice: page.practice,
        feedbackChecks: page.completion,
        independentArtifact: page.artifact,
        transferPrompt: page.outcomes.at(-1) ?? `把 ${page.artifact} 迁移到一个新场景，并保留证据边界。`,
      },
    };
  }
  if (documentType === "professional-how-to") {
    return {
      ...base,
      procedure: {
        prerequisites: page.prerequisites,
        inputs: [page.summary],
        steps: page.practice,
        expectedResults: page.completion,
        recovery: [failClosedRecovery],
        rollback: "恢复到执行前的版本化输入和配置，并把本轮结果记录为 BLOCKED/UNKNOWN。",
      },
    };
  }
  if (documentType === "reference") {
    return {
      ...base,
      referenceContract: {
        definitions: page.blocks.map((block) => block.title),
        versionScope: page.evidenceBoundary,
        limitations: [page.evidenceBoundary],
        failureAction: failClosedRecovery,
      },
    };
  }
  if (documentType === "explanation") {
    return {
      ...base,
      explanationContract: {
        mechanism: page.blocks.map((block) => block.title),
        causalQuestions: page.outcomes,
        tradeoffs: [page.why],
        counterexamples: page.practice,
        applicability: page.evidenceBoundary,
      },
    };
  }
  return {
    ...base,
    reportContract: {
      question: page.why,
      method: page.practice,
      expectedEvidence: page.completion,
      uncertainty: page.evidenceBoundary,
      limitations: [page.evidenceBoundary],
      recommendation: `基于 ${page.artifact} 形成候选建议；证据不足时保持 UNKNOWN/BLOCKED。`,
      decisionOwner: "由使用组织指定的具名人工决策者",
      decisionDeadline: "由目标系统的风险窗口与证据有效期确定",
    },
  };
};
