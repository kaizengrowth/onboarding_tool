import { LADDER_RUNGS, NEXT_STEP } from "@/types";
import type { Member } from "@/types";

export function LadderCard({ member }: { member: Member }) {
  const currentIndex = LADDER_RUNGS.indexOf(member.ladder_rung);

  return (
    <div>
      <h2>{member.name}</h2>

      <ol>
        {LADDER_RUNGS.map((rung, i) => (
          <li
            key={rung}
            aria-current={rung === member.ladder_rung ? "step" : undefined}
            data-state={
              i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming"
            }
          >
            {rung.replace(/_/g, " ")}
          </li>
        ))}
      </ol>

      <p>
        <strong>Your next step:</strong> {NEXT_STEP[member.ladder_rung]}
      </p>
    </div>
  );
}
