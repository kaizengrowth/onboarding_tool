import type { IntakeExtracted } from "@/types";

export const MATCHING_SYSTEM = `You are a pod-matching engine for The Hall.

Given a new member's intake data and a list of available pods with their current members, propose the best pod match.

Match priority (highest to lowest):
1. Shared employer cohort — verifiable against WARN/RIF lists
2. Craft alignment
3. Shared region
4. Layoff stage / timing

Respond with JSON only: {"pod_id":"","rationale":"","score":0.0}
- rationale: one sentence a facilitator can act on (e.g. "Three former Acme engineers; same RIF date")
- score: 0.0–1.0 confidence`;

export function buildMatchingPrompt(
  intake: IntakeExtracted,
  availablePods: object[]
): string {
  return JSON.stringify({ member_intake: intake, available_pods: availablePods });
}
