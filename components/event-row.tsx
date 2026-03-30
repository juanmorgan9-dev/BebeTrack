"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES, EVENT_TYPES, FEED_SUBTYPES, OTHER_SUBTYPES } from "@/lib/constants";
import { formatTime, ago } from "@/lib/utils";

interface EventRowProps {
  event: BabyEvent;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function EventRow({ event, showDelete, onDelete, onClick }: EventRowProps) {
  const baby = event.baby_id ? BABIES.find((b) => b.id === event.baby_id) : null;
  const et = EVENT_TYPES[event.type] || { label: "Otro", icon: "📝", color: "#90A4AE" };
  
  let label = et.label;
  if (event.type === "feed" && event.subtype) {
    label = FEED_SUBTYPES.find((s) => s.id === event.subtype)?.label || label;
  }
  if (event.type === "other" && event.other_subtype) {
    const o = OTHER_SUBTYPES.find((s) => s.id === event.other_subtype);
    if (o) label = o.label;
  }

  const details: string[] = [];
  if (event.ml) details.push(`${event.ml}ml`);
  if (event.duration_min) details.push(`${event.duration_min}min`);
  if (event.consistency) details.push(event.consistency);
  if (event.poop_color) details.push(event.poop_color);

  const detailStr = details.length ? ` · ${details.join(" · ")}` : "";
  const babyColor = baby?.color || "#F48FB1";

  return (
    <div
      className="flex items-center gap-3 py-3 cursor-pointer active:bg-[#1A1A2E30]"
      style={{ borderBottom: "1px solid #1A1A2E" }}
      onClick={onClick}
    >
      <span
        className="text-xl w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${et.color}15` }}
      >
        {et.icon}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white font-bold truncate">
          {baby && (
            <>
              <span style={{ color: babyColor }}>{baby.name}</span>
              <span> · </span>
            </>
          )}
          {label}
          {detailStr}
        </div>
        {event.notes && (
          <div className="text-[11px] text-[#555] mt-0.5 truncate">
            {event.notes}
          </div>
        )}
      </div>
      
      <div className="text-right shrink-0">
        <div className="text-xs text-[#888]">{formatTime(event.date_time)}</div>
        <div className="text-[10px] text-[#444]">{ago(event.date_time)}</div>
      </div>
      
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          className="shrink-0 px-2 py-1.5 rounded-lg text-xs cursor-pointer"
          style={{
            background: "#EF535018",
            border: "1px solid #EF535030",
            color: "#EF5350",
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}
