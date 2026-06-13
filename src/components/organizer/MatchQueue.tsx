"use client";

import { useRouter } from "next/navigation";

interface PodMember {
  name: string;
  craft: string | null;
  ladder_rung: string;
}

interface QueuedPod {
  id: string;
  template: string;
  pod_memberships: { role: string; members: PodMember }[];
}

// Facilitator confirms a match here — that's the human gate before any member is notified.
export function MatchQueue({ pods }: { pods: QueuedPod[] }) {
  const router = useRouter();

  async function confirm(podId: string) {
    await fetch(`/api/pods/${podId}/confirm`, { method: "POST" });
    router.refresh();
  }

  if (pods.length === 0) {
    return <p>No pending matches.</p>;
  }

  return (
    <ul>
      {pods.map((pod) => (
        <li key={pod.id}>
          <strong>{pod.template}</strong>
          <ul>
            {pod.pod_memberships.map((m, i) => (
              <li key={i}>
                {m.members.name}
                {m.members.craft ? ` — ${m.members.craft}` : ""}
              </li>
            ))}
          </ul>
          <button onClick={() => confirm(pod.id)}>
            Confirm &amp; instantiate pod
          </button>
        </li>
      ))}
    </ul>
  );
}
