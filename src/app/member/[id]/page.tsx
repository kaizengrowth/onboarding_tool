import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LadderCard } from "@/components/ladder/LadderCard";
import type { Member } from "@/types";

export default async function MemberProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("members")
    .select("*, pod_memberships(role, pods(id, template, status))")
    .eq("id", id)
    .single();

  if (!member) notFound();

  return (
    <main>
      <LadderCard member={member as Member} />
    </main>
  );
}
