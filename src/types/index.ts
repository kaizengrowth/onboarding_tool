export type LadderRung =
  | "arrived"
  | "supported"
  | "in_a_pod"
  | "contributing"
  | "trained"
  | "facilitating"
  | "leading";

export const LADDER_RUNGS: LadderRung[] = [
  "arrived",
  "supported",
  "in_a_pod",
  "contributing",
  "trained",
  "facilitating",
  "leading",
];

export const NEXT_STEP: Record<LadderRung, string> = {
  arrived: "Connect with a support pod",
  supported: "Join your first pod meeting",
  in_a_pod: "Take on a task in your pod",
  contributing: "Complete a training module",
  trained: "Co-facilitate a pod session",
  facilitating: "Lead your own pod",
  leading: "You're helping build what comes next.",
};

export type PodTemplate = "support" | "study" | "build" | "interview" | "action";

export interface Member {
  id: string;
  name: string;
  contact: string;
  region: string | null;
  craft: string | null;
  cohort_id: string | null;
  ladder_rung: LadderRung;
  mattermost_user_id: string | null;
  created_at: string;
}

export interface Cohort {
  id: string;
  employer: string;
  rif_date: string;
  source: string;
}

export interface IntakeExtracted {
  employer?: string;
  role?: string;
  timing?: string;
  region?: string;
  needs?: string[];
  craft?: string;
  offers?: string[];
}

export interface Intake {
  id: string;
  member_id: string;
  raw_conversation: { role: string; content: string }[];
  extracted: IntakeExtracted;
  created_at: string;
}

export interface Pod {
  id: string;
  template: PodTemplate;
  facilitator_id: string | null;
  mattermost_channel_id: string | null;
  ritual_cadence: string;
  status: "pending" | "active" | "archived";
  created_at: string;
}

export interface PodMembership {
  pod_id: string;
  member_id: string;
  role: "member" | "facilitator";
  joined_at: string;
}

export interface MatchProposal {
  pod_id: string;
  rationale: string;
  score: number;
}
