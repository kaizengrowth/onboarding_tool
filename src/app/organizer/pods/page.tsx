import { createClient } from "@/lib/supabase/server";
import { MatchQueue } from "@/components/organizer/MatchQueue";

export default async function PodsPage() {
  const supabase = await createClient();
  const { data: pods } = await supabase
    .from("pods")
    .select("id, template, pod_memberships(role, members(name, craft, ladder_rung))")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main>
      <h1>Pod Match Queue</h1>
      <MatchQueue pods={pods ?? []} />
    </main>
  );
}
