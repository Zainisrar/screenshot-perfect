export type UserRole = "CEO" | "SOLUTION_LEAD" | "ADMIN";
export type PersonName = "Bernard George" | "Kowsalya" | "Zain";

export type TenderStage =
  | "Discovered"
  | "AI analysis"
  | "Review summary"
  | "G1 · Bid decision"
  | "AI drafting"
  | "G2 · Technical"
  | "Costing"
  | "G3 · Price & margin"
  | "G4 · Final QA"
  | "G5 · Release"
  | "Ready to submit"
  | "Submitted"
  | "Awarded"
  | "Not awarded"
  | "NO_BID"
  | "MISSED"
  | "WITHDRAWN"
  | "ARCHIVED";

export type Recommendation = "BID" | "NO BID" | "CLARIFY";
export type ApprovalGate = "G1" | "G2" | "G3" | "G4" | "G5" | "GC";
export type ApprovalState = "Pending" | "Approved" | "Returned" | "Rejected" | "Voided";
export type RequirementState = "Met" | "Gap" | "Unknown";

export interface Approval {
  gate: ApprovalGate;
  title: string;
  approver: PersonName | "Pending";
  role: UserRole;
  state: ApprovalState;
  versionHash: string;
  time?: string;
  reason?: string;
}

export interface Requirement {
  id: string;
  requirement: string;
  sourceDocument: string;
  page: number;
  exactQuote: string;
  verified: boolean;
  mandatory: boolean;
  response: string;
  evidence: string;
  status: RequirementState;
}

export interface TenderDocument {
  name: string;
  hash: string;
  source: string;
  date: string;
}

export interface Quote {
  supplier: string;
  item: string;
  amount: number;
  currency: string;
  expires: string;
  status: "Received" | "Requested";
}

export interface CostLine {
  label: string;
  amount: number;
  source: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: PersonName;
  time: string;
  detail: string;
  versionHash?: string;
}

export interface ProposalSection {
  title: string;
  body: string;
  comments: number;
}

export interface ClarificationEvent {
  date: string;
  title: string;
  detail: string;
  material?: boolean;
}

export interface Tender {
  id: string;
  title: string;
  agency: string;
  type: string;
  reference: string;
  country: string;
  location: string;
  deadlineNotice: string;
  utcOffset: number;
  stage: TenderStage;
  score: number;
  recommendation: Recommendation;
  aiReasons: string[];
  owner: PersonName | "Unassigned";
  backupOwner: PersonName | "Unassigned";
  source: "UNGM" | "UNGM alert";
  ungmUrl: string;
  submissionRules: string[];
  summary: string;
  versionHash: string;
  hasMaterialAmendment: boolean;
  amendmentLabel?: string;
  approvals: Approval[];
  requirements: Requirement[];
  documents: TenderDocument[];
  quotes: Quote[];
  costLines: CostLine[];
  price: number;
  margin: number;
  proposal: ProposalSection[];
  clarifications: ClarificationEvent[];
  audit: AuditEntry[];
  preparedBy?: PersonName;
  submittedReceipt?: string;
}

export interface DemoUser {
  role: UserRole;
  name: PersonName;
  title: string;
  initials: string;
}

export const DEMO_USERS: DemoUser[] = [
  { role: "CEO", name: "Bernard George", title: "Chief Executive Officer", initials: "BG" },
  {
    role: "SOLUTION_LEAD",
    name: "Kowsalya",
    title: "Solution Engineering Lead",
    initials: "K",
  },
  { role: "ADMIN", name: "Zain", title: "Administrator", initials: "Z" },
];

export const WORKFLOW_STEPS = [
  "Discovered",
  "AI analysis",
  "Review summary",
  "G1 · Bid decision",
  "AI drafting",
  "G2 · Technical",
  "Costing",
  "G3 · Price & margin",
  "G4 · Final QA",
  "G5 · Release",
  "Ready to submit",
  "Submitted",
] as const;