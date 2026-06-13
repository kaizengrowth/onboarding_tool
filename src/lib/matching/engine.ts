import { getLLMProvider } from "@/lib/llm";
import { MATCHING_SYSTEM, buildMatchingPrompt } from "@/lib/llm/prompts/matching";
import type { IntakeExtracted, MatchProposal } from "@/types";

// Claude proposes; facilitator confirms. The proposal never reaches a member directly.
export async function proposePodMatch(
  intake: IntakeExtracted,
  availablePods: object[]
): Promise<MatchProposal> {
  const llm = getLLMProvider();
  const response = await llm.chat([
    { role: "system", content: MATCHING_SYSTEM },
    { role: "user", content: buildMatchingPrompt(intake, availablePods) },
  ]);
  return JSON.parse(response.content) as MatchProposal;
}
