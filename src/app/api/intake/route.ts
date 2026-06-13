import { NextRequest, NextResponse } from "next/server";
import { getLLMProvider } from "@/lib/llm";
import { INTAKE_SYSTEM } from "@/lib/llm/prompts/intake";
import type { LLMMessage } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const { messages }: { messages: LLMMessage[] } = await req.json();

  const llm = getLLMProvider();
  const response = await llm.chat([
    { role: "system", content: INTAKE_SYSTEM },
    ...messages,
  ]);

  // LLM signals structured actions via JSON responses
  try {
    const parsed = JSON.parse(response.content);

    if (parsed.action === "crisis_handoff") {
      return NextResponse.json({ action: "crisis_handoff" });
    }

    if (parsed.action === "complete") {
      // TODO: create member record + intake row, then trigger matching
      return NextResponse.json({ action: "complete", extracted: parsed.extracted });
    }
  } catch {
    // Normal conversational turn — not JSON
  }

  return NextResponse.json({ message: response.content });
}
