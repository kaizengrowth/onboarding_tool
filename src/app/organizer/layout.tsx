import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// All /organizer routes require an authenticated session with organizer role.
export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return <>{children}</>;
}
