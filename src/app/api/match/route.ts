import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { proposePodMatch } from "@/lib/matching/engine";

// Generates a match proposal for an organizer to review.
// The proposal never goes to the member until a facilitator confirms it.
export async function POST(req: NextRequest) {
  const { member_id }: { member_id: string } = await req.json();
  const supabase = await createClient();

  const [{ data: intake }, { data: pods }] = await Promise.all([
    supabase.from("intakes").select("extracted").eq("member_id", member_id).single(),
    supabase
      .from("pods")
      .select("id, template, ritual_cadence, pod_memberships(count)")
      .eq("status", "active"),
  ]);

  if (!intake) {
    return NextResponse.json({ error: "intake not found" }, { status: 404 });
  }

  const proposal = await proposePodMatch(intake.extracted, pods ?? []);
  return NextResponse.json(proposal);
}
