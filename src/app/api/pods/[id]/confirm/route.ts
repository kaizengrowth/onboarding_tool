import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createChannel,
  sendDirectMessage,
  postToChannel,
} from "@/lib/mattermost/client";
import type { LadderRung } from "@/types";

// Facilitator confirms a pending match → instantiate the pod.
// This is the human gate: no member sees a match until this runs.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pod } = await supabase
    .from("pods")
    .select("*, pod_memberships(role, members(name, craft, mattermost_user_id, ladder_rung))")
    .eq("id", id)
    .single();

  if (!pod) return NextResponse.json({ error: "pod not found" }, { status: 404 });

  // 1. Mattermost channel
  const channel = await createChannel(
    `pod-${id.slice(0, 8)}`,
    `Pod: ${pod.template}`,
    process.env.MATTERMOST_TEAM_ID!
  );

  // 2. Jitsi link (deterministic from pod id)
  const jitsiLink = `https://meet.jit.si/thehall-pod-${id.slice(0, 8)}`;

  // 3. Persist
  await supabase
    .from("pods")
    .update({ status: "active", mattermost_channel_id: channel.id })
    .eq("id", id);

  // 4. Facilitator brief
  await postToChannel(channel.id, buildFacilitatorBrief(pod, jitsiLink));

  // 5. Welcome DM to each member
  for (const membership of pod.pod_memberships) {
    const member = membership.members;
    if (member.mattermost_user_id) {
      await sendDirectMessage(
        member.mattermost_user_id,
        buildWelcomeDM(member.ladder_rung as LadderRung, pod.template)
      );
    }
  }

  return NextResponse.json({ channel_id: channel.id, jitsi_link: jitsiLink });
}

function buildFacilitatorBrief(pod: { template: string; pod_memberships: { members: { name: string; craft: string } }[] }, jitsiLink: string): string {
  const memberLines = pod.pod_memberships
    .map((m) => `- ${m.members.name} (${m.members.craft ?? "craft unknown"})`)
    .join("\n");
  return `**New ${pod.template} pod — first meeting:** ${jitsiLink}\n\nMembers:\n${memberLines}`;
}

function buildWelcomeDM(ladderRung: LadderRung, template: string): string {
  return (
    `Welcome to The Hall. You've been matched with a ${template} pod. ` +
    `Your next step: join the channel and introduce yourself.\n\n` +
    `Your current position on the ladder: **${ladderRung.replace(/_/g, " ")}**.`
  );
}
