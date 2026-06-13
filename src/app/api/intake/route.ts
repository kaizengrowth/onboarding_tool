import { NextRequest, NextResponse } from "next/server";
import { getLLMProvider } from "@/lib/llm";
import { INTAKE_SYSTEM } from "@/lib/llm/prompts/intake";
import { createClient } from "@/lib/supabase/server";
import type { LLMMessage } from "@/lib/llm";
import type { IntakeExtracted } from "@/types";

export async function POST(req: NextRequest) {
  const {
    messages,
    name,
    contact,
  }: { messages: LLMMessage[]; name?: string; contact?: string } =
    await req.json();

  const llm = getLLMProvider();
  const response = await llm.chat([
    { role: "system", content: INTAKE_SYSTEM },
    ...messages,
  ]);

  let parsed: { action?: string; extracted?: IntakeExtracted } | null = null;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    // Normal conversational turn — not JSON
  }

  if (parsed?.action === "crisis_handoff") {
    return NextResponse.json({ action: "crisis_handoff" });
  }

  if (parsed?.action === "complete") {
    const supabase = await createClient();

    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert({
        name: name ?? "Unknown",
        contact: contact ?? "",
        region: parsed.extracted?.region ?? null,
        craft: parsed.extracted?.craft ?? null,
        ladder_rung: "arrived",
      })
      .select("id")
      .single();

    if (memberError) {
      return NextResponse.json(
        { error: "Failed to create member record" },
        { status: 500 }
      );
    }

    // Embedding deferred to matching engine — set null for now
    const { error: intakeError } = await supabase.from("intakes").insert({
      member_id: member.id,
      raw_conversation: messages,
      extracted: parsed.extracted ?? {},
      embedding: null,
    });

    if (intakeError) {
      return NextResponse.json(
        { error: "Failed to save intake" },
        { status: 500 }
      );
    }

    return NextResponse.json({ action: "complete", member_id: member.id });
  }

  return NextResponse.json({ message: response.content });
}
