import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PodTemplate } from "@/types";

export async function POST(req: NextRequest) {
  const body: { template: PodTemplate; facilitator_id?: string; ritual_cadence?: string } =
    await req.json();

  const supabase = await createClient();
  const { data: pod, error } = await supabase
    .from("pods")
    .insert({ ...body, status: "pending" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(pod, { status: 201 });
}
