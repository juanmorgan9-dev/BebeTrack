export interface BabyEvent {
  id: string;
  baby_id: string | null;
  type: "feed" | "pee" | "poop" | "bath" | "extraction" | "other";
  subtype: string | null;
  other_subtype: string | null;
  date_time: string;
  duration_min: number | null;
  ml: number | null;
  consistency: string | null;
  poop_color: string | null;
  notes: string | null;
  created_at: string;
}

export interface Baby {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface EventType {
  label: string;
  icon: string;
  color: string;
}
