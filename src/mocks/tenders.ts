import type { Approval, Tender, TenderStage } from "@/types/tender";

const HASH = "sha256:9a71c2e4…";
const approval = (
  gate: Approval["gate"],
  title: string,
  role: Approval["role"],
  state: Approval["state"] = "Pending",
  approver: Approval["approver"] = "Pending",
): Approval => ({ gate, title, role, state, approver, versionHash: HASH });

const basicRequirements = [
  {
    id: "R-01",
    requirement: "Provide a delivery schedule and installation plan",
    sourceDocument: "Invitation to Bid.pdf",
    page: 14,
    exactQuote: "The supplier shall provide a detailed delivery and installation schedule.",
    verified: true,
    mandatory: true,
    response: "Four-week delivery plan included",
    evidence: "Technical proposal · Section 3",
    status: "Met" as const,
  },
  {
    id: "R-02",
    requirement: "Submit proof of comparable project experience",
    sourceDocument: "Invitation to Bid.pdf",
    page: 18,
    exactQuote: "At least two projects of similar size completed within the last five years.",
    verified: true,
    mandatory: true,
    response: "Reference letters requested",
    evidence: "Not yet attached",
    status: "Gap" as const,
  },
  {
    id: "R-03",
    requirement: "Warranty and local support commitment",
    sourceDocument: "Technical Specifications.pdf",
    page: 7,
    exactQuote: "AI-extracted quote pending human verification",
    verified: false,
    mandatory: false,
    response: "Response in progress",
    evidence: "Pending verification",
    status: "Unknown" as const,
  },
];

function makeTender(input: {
  id: string;
  title: string;
  agency: string;
  type: string;
  reference: string;
  country: string;
  location: string;
  deadlineNotice: string;
  utcOffset?: number;
  stage: TenderStage;
  score: number;
  recommendation: Tender["recommendation"];
  owner: Tender["owner"];
  backupOwner: Tender["backupOwner"];
  source?: Tender["source"];
  amendment?: boolean;
  amendmentLabel?: string;
  preparedBy?: Tender["preparedBy"];
}): Tender {
  const isAdvanced = ["G2 · Technical", "Costing", "G3 · Price & margin", "G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage);
  const approvals: Approval[] = [
    approval("G1", "Bid / no-bid decision", "CEO", isAdvanced ? "Approved" : "Pending", isAdvanced ? "Bernard George" : "Pending"),
    approval("G2", "Technical approval", "SOLUTION_LEAD", ["Costing", "G3 · Price & margin", "G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Approved" : "Pending", ["Costing", "G3 · Price & margin", "G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Kowsalya" : "Pending"),
    approval("G3", "Price & margin", "CEO", ["G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Approved" : "Pending", ["G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Bernard George" : "Pending"),
    approval("G4", "Final QA", "SOLUTION_LEAD", ["G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Approved" : "Pending", ["G5 · Release", "Ready to submit", "Submitted"].includes(input.stage) ? "Kowsalya" : "Pending"),
    approval("G5", "One-time package release", "CEO", ["Ready to submit", "Submitted"].includes(input.stage) ? "Approved" : "Pending", ["Ready to submit", "Submitted"].includes(input.stage) ? "Bernard George" : "Pending"),
    approval("GC", "Outgoing email approval", "CEO"),
  ];
  const hash = input.amendment ? "sha256:2d48bb91…" : HASH;
  const technicalComplete = ["Costing", "G3 · Price & margin", "G4 · Final QA", "G5 · Release", "Ready to submit", "Submitted"].includes(input.stage);
  const qaComplete = ["G5 · Release", "Ready to submit", "Submitted"].includes(input.stage);
  return {
    ...input,
    utcOffset: input.utcOffset ?? 2,
    source: input.source ?? "UNGM",
    ungmUrl: `https://www.ungm.org/Public/Notice/${input.reference}`,
    submissionRules: ["Submit through UNGM before deadline", "English language", "Prices in USD", "Include signed supplier declaration"],
    summary: `${input.agency} seeks ${input.type.toLowerCase()} support for ${input.location}. GREEN DigitALL can meet the core technical scope, with local delivery and support coverage to confirm before submission.`,
    versionHash: hash,
    hasMaterialAmendment: input.amendment ?? false,
    amendmentLabel: input.amendmentLabel,
    approvals: approvals.map((item) => input.amendment && item.state === "Approved" ? { ...item, state: "Voided" } : item),
    requirements: basicRequirements.map((item) => ({ ...item, id: `${input.id}-${item.id}` })),
    documents: [
      { name: "Invitation to Bid.pdf", hash: "SHA-256 · b72f…18ad", source: "UNGM notice", date: "12 Nov 2026" },
      { name: "Technical Specifications.pdf", hash: "SHA-256 · 31c0…a625", source: input.amendment ? "Amendment No. 2" : "UNGM notice", date: input.amendment ? "15 Nov 2026" : "12 Nov 2026" },
    ],
    quotes: [
      { supplier: "Pacific Systems Ltd", item: input.type, amount: 18400, currency: "USD", expires: "21 Nov 2026", status: "Received" as const },
      { supplier: "Island Tech Services", item: input.type, amount: 19650, currency: "USD", expires: "17 Nov 2026", status: "Received" as const },
      { supplier: "Solara Pacific", item: input.type, amount: 0, currency: "USD", expires: "—", status: "Requested" as const },
    ],
    costLines: [
      { label: "Supplier equipment", amount: 18400, source: "Pacific Systems Ltd · Quote Q-118" },
      { label: "Freight & customs", amount: 2400, source: "Logistics estimate · 12 Nov" },
      { label: "Installation & training", amount: 3600, source: "GREEN delivery estimate" },
      { label: "Contingency", amount: 1200, source: "10% of delivery costs" },
    ],
    price: 34000,
    margin: 25,
    proposal: [
      { title: "Executive summary", body: "AI-assisted draft · GREEN DigitALL proposes a locally supported delivery designed around the agency's operational requirements and timeline.", comments: 2 },
      { title: "Technical approach", body: "AI-assisted draft · Supply, configure, test and hand over equipment with practical training for the designated team.", comments: 1 },
      { title: "Delivery schedule", body: "AI-assisted draft · Mobilisation begins after award; milestones are confirmed against site access and shipping lead times.", comments: 0 },
    ],
    clarifications: [
      { date: "12 Nov 2026", title: "Tender published", detail: "Notice imported from UNGM." },
      ...(input.amendment ? [{ date: "15 Nov 2026", title: input.amendmentLabel ?? "Material amendment issued", detail: "Scope and submission schedule updated. Review changes before proceeding.", material: true }] : []),
    ],
    audit: [
      { id: `${input.id}-a1`, action: "Tender discovered", actor: "Zain", time: "12 Nov 2026 · 09:22", detail: `${input.source ?? "UNGM"} notice added to the workspace.`, versionHash: hash },
      ...(input.amendment ? [{ id: `${input.id}-a2`, action: "Amendment received", actor: "Zain" as const, time: "15 Nov 2026 · 14:05", detail: "Prior approvals voided; re-approval required.", versionHash: hash }] : []),
    ],
    preparedBy: input.preparedBy,
    aiReasons: [
      `Strong scope match for ${input.type.toLowerCase()} delivery`,
      `Local supplier coverage identified in ${input.country}`,
      input.amendment ? "Material amendment needs fresh approval review" : "Submission window allows preparation time",
    ],
    ...(technicalComplete ? {} : {}),
    _qaComplete: qaComplete,
  } as Tender;
}

export const INITIAL_TENDERS: Tender[] = [
  makeTender({ id: "tea-001", title: "Supply and delivery of solar-powered cold chain equipment", agency: "FAO", type: "Solar cold chain", reference: "2026/FRETH/FRZIM/138792", country: "Papua New Guinea", location: "Port Moresby", deadlineNotice: "18-Nov-2026 16:00 (GMT 2.00)", stage: "G4 · Final QA", score: 91, recommendation: "BID", owner: "Kowsalya", backupOwner: "Bernard George", amendment: true, amendmentLabel: "Amendment No. 2", preparedBy: "Kowsalya" }),
  makeTender({ id: "tea-002", title: "Solar energy systems for rural health facilities", agency: "UNDP", type: "Solar energy", reference: "UNDP-PNG-2026-044", country: "Papua New Guinea", location: "Eastern Highlands", deadlineNotice: "24-Nov-2026 12:00 (GMT 2.00)", stage: "G3 · Price & margin", score: 86, recommendation: "BID", owner: "Bernard George", backupOwner: "Kowsalya" }),
  makeTender({ id: "tea-003", title: "ICT equipment supply for learning centres", agency: "UNICEF", type: "ICT equipment", reference: "UNICEF-FJI-2026-019", country: "Fiji", location: "Suva", deadlineNotice: "28-Nov-2026 15:00 (GMT 2.00)", stage: "G2 · Technical", score: 78, recommendation: "BID", owner: "Kowsalya", backupOwner: "Zain" }),
  makeTender({ id: "tea-004", title: "Network infrastructure and connectivity upgrade", agency: "UNOPS", type: "Network", reference: "UNOPS-SOL-2026-071", country: "Solomon Islands", location: "Honiara", deadlineNotice: "21-Nov-2026 10:00 (GMT 2.00)", stage: "AI drafting", score: 72, recommendation: "CLARIFY", owner: "Kowsalya", backupOwner: "Bernard George" }),
  makeTender({ id: "tea-005", title: "Digital skills and ICT training services", agency: "WHO", type: "Training", reference: "WHO-PNG-2026-033", country: "Papua New Guinea", location: "Lae", deadlineNotice: "30-Nov-2026 17:00 (GMT 2.00)", stage: "G1 · Bid decision", score: 83, recommendation: "BID", owner: "Bernard George", backupOwner: "Kowsalya" }),
  makeTender({ id: "tea-006", title: "Solar mini-grid components for island communities", agency: "UNDP", type: "Solar energy", reference: "UNDP-SOL-2026-026", country: "Solomon Islands", location: "Malaita Province", deadlineNotice: "20-Nov-2026 14:00 (GMT 2.00)", stage: "Review summary", score: 67, recommendation: "CLARIFY", owner: "Kowsalya", backupOwner: "Zain" }),
  makeTender({ id: "tea-007", title: "Supply of network switches and wireless access points", agency: "UNOPS", type: "Network", reference: "UNOPS-FJI-2026-058", country: "Fiji", location: "Western Division", deadlineNotice: "02-Dec-2026 11:00 (GMT 2.00)", stage: "Discovered", score: 59, recommendation: "BID", owner: "Unassigned", backupOwner: "Unassigned", source: "UNGM alert" }),
  makeTender({ id: "tea-008", title: "ICT equipment for provincial community offices", agency: "UNICEF", type: "ICT equipment", reference: "UNICEF-PNG-2026-087", country: "Papua New Guinea", location: "Goroka", deadlineNotice: "27-Nov-2026 09:00 (GMT 2.00)", stage: "Submitted", score: 88, recommendation: "BID", owner: "Bernard George", backupOwner: "Kowsalya" }),
];