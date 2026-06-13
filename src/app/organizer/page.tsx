import { createClient } from "@/lib/supabase/server";
import { AbsorptionDashboard } from "@/components/organizer/AbsorptionDashboard";
import type { Member } from "@/types";

export default async function OrganizerHome() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("id, name, ladder_rung, created_at")
    .order("created_at", { ascending: false });

  return (
    <main>
      <h1>Absorption Dashboard</h1>
      <AbsorptionDashboard members={(members ?? []) as Member[]} />
    </main>
  );
}
