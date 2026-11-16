import { INITIAL_TENDERS } from "@/mocks/tenders";
import { DEMO_USERS, type ApprovalGate, type AuditEntry, type DemoUser, type Tender, type TenderStage, type UserRole } from "@/types/tender";

let tenders = structuredClone(INITIAL_TENDERS);
const roleForGate: Record<ApprovalGate, UserRole> = {
  G1: "CEO", G2: "SOLUTION_LEAD", G3: "CEO", G4: "SOLUTION_LEAD", G5: "CEO", GC: "CEO",
};

export async function getTenders(): Promise<Tender[]> {
  return structuredClone(tenders);
}

export async function getTender(id: string): Promise<Tender | undefined> {
  const tender = tenders.find((item) => item.id === id);
  return tender ? structuredClone(tender) : undefined;
}

export async function getDemoUsers(): Promise<DemoUser[]> {
  return structuredClone(DEMO_USERS);
}

export function canApprove(role: UserRole, gate: ApprovalGate): boolean {
  return roleForGate[gate] === role;
}

export async function approveGate(input: {
  tenderId: string;
  gate: ApprovalGate;
  actor: DemoUser;
  decision: "Approved" | "Returned" | "Rejected";
  reason: string;
  aiRecommendation?: Tender["recommendation"];
  bidDecision?: "BID" | "NO BID";
}): Promise<Tender> {
  const tender = tenders.find((item) => item.id === input.tenderId);
  if (!tender) throw new Error("Tender not found.");
  if (!canApprove(input.actor.role, input.gate)) throw new Error("This role cannot approve this gate.");
  if (!input.reason.trim()) throw new Error("A reason is required for every approval action.");
  if (input.gate === "G1" && input.aiRecommendation && input.bidDecision && input.aiRecommendation !== input.bidDecision && !input.reason.trim()) {
    throw new Error("A reason is required when the CEO disagrees with the AI recommendation.");
  }
  if (input.gate === "G4" && tender.preparedBy === input.actor.name) throw new Error("The proposal preparer cannot approve final QA.");
  if (tender.hasMaterialAmendment) throw new Error("Material amendment requires updated package review before approval.");
  if (tender.stage !== "Discovered" && (tender.owner === "Unassigned" || tender.backupOwner === "Unassigned" || tender.owner === tender.backupOwner)) {
    throw new Error("Assign a tender owner and a different backup owner before moving past Discovered.");
  }

  tender.approvals = tender.approvals.map((item) => item.gate === input.gate
    ? { ...item, state: input.decision, approver: input.actor.name, time: "16 Nov 2026 · just now", reason: input.reason, versionHash: tender.versionHash }
    : item);
  const stageByGate: Partial<Record<ApprovalGate, TenderStage>> = {
    G1: input.bidDecision === "NO BID" ? "NO_BID" : "AI drafting",
    G2: input.decision === "Approved" ? "Costing" : "AI drafting",
    G3: "G4 · Final QA",
    G4: "G5 · Release",
    G5: "Ready to submit",
    GC: tender.stage,
  };
  if (input.decision === "Rejected" && input.gate !== "G1") tender.stage = "WITHDRAWN";
  else if (stageByGate[input.gate]) tender.stage = stageByGate[input.gate] as TenderStage;

  const entry: AuditEntry = {
    id: `${tender.id}-${Date.now()}`,
    action: `${input.gate} ${input.decision.toLowerCase()}`,
    actor: input.actor.name,
    time: "16 Nov 2026 · just now",
    detail: input.reason,
    versionHash: tender.versionHash,
  };
  tender.audit.unshift(entry);
  return structuredClone(tender);
}

export async function updateTenderFields(
  tenderId: string,
  actor: DemoUser,
  updates: Pick<Tender, "owner" | "backupOwner">,
): Promise<Tender> {
  const tender = tenders.find((item) => item.id === tenderId);
  if (!tender) throw new Error("Tender not found.");
  if (actor.role !== "ADMIN" && actor.role !== "CEO") throw new Error("Only Admin or CEO may assign ownership.");
  if (updates.owner !== "Unassigned" && updates.owner === updates.backupOwner) throw new Error("Primary and backup owners must be different people.");
  tender.owner = updates.owner;
  tender.backupOwner = updates.backupOwner;
  tender.audit.unshift({ id: `${tender.id}-${Date.now()}`, action: "Ownership updated", actor: actor.name, time: "16 Nov 2026 · just now", detail: `Owner: ${updates.owner}; backup: ${updates.backupOwner}.`, versionHash: tender.versionHash });
  return structuredClone(tender);
}

export async function updateCosting(tenderId: string, actor: DemoUser, price: number, margin: number): Promise<Tender> {
  const tender = tenders.find((item) => item.id === tenderId);
  if (!tender) throw new Error("Tender not found.");
  if (actor.role !== "CEO") throw new Error("Only the CEO may edit price and margin.");
  tender.price = price;
  tender.margin = margin;
  tender.audit.unshift({ id: `${tender.id}-${Date.now()}`, action: "Costing updated", actor: actor.name, time: "16 Nov 2026 · just now", detail: `Price set to $${price.toLocaleString()} with ${margin}% margin.`, versionHash: tender.versionHash });
  return structuredClone(tender);
}

export function resetDemoTenders(): void {
  tenders = structuredClone(INITIAL_TENDERS);
}