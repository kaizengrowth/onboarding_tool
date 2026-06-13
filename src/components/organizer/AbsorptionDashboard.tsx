import { LADDER_RUNGS } from "@/types";
import type { Member } from "@/types";

const STALL_DAYS = 7;

export function AbsorptionDashboard({ members }: { members: Member[] }) {
  const now = Date.now();

  const rows = LADDER_RUNGS.map((rung) => {
    const atRung = members.filter((m) => m.ladder_rung === rung);
    const stalled = atRung.filter((m) => {
      const ageDays = (now - new Date(m.created_at).getTime()) / 86_400_000;
      return ageDays > STALL_DAYS;
    });
    return { rung, count: atRung.length, stalled: stalled.length };
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Rung</th>
          <th>Members</th>
          <th>Stalled (&gt;{STALL_DAYS} days)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ rung, count, stalled }) => (
          <tr key={rung} data-stalled={stalled > 0 ? "true" : undefined}>
            <td>{rung.replace(/_/g, " ")}</td>
            <td>{count}</td>
            <td>{stalled}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
