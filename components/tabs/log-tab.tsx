"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, LOG_TYPES, EVENT_TYPES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { formatDate } from "@/lib/utils";

interface LogTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
}

export function LogTab({ events, onDelete }: LogTabProps) {
  const [filterBaby, setFilterBaby] = useState("all");
  const [filterType, setFilterType] = useState("all");

  let filtered = events;
  if (filterBaby !== "all") {
    filtered = filtered.filter((e) => e.baby_id === filterBaby);
  }
  if (filterType !== "all") {
    filtered = filtered.filter((e) => e.type === filterType);
  }

  // Group by date
  const grouped: Record<string, BabyEvent[]> = {};
  filtered.forEach((ev) => {
    const key = formatDate(ev.date_time);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  const babyFilters = [
    { id: "all", label: "Todos", color: "#666" },
    ...BABIES.map((b) => ({ id: b.id, label: b.name, color: b.color })),
  ];

  return (
    <div>
      {/* Baby Filter */}
      <div className="mb-3">
        <div className="text-[10px] text-[#333] font-bold tracking-wide uppercase mb-1.5">
          Por bebe
        </div>
        <div className="flex flex-wrap gap-1.5">
          {babyFilters.map((f) => {
            const active = filterBaby === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterBaby(f.id)}
                className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                style={{
                  background: active ? `${f.color}30` : "#0D0D1A",
                  border: `1.5px solid ${active ? f.color : "#2A2A3E"}`,
                  color: active ? f.color : "#555",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-3">
        <div className="text-[10px] text-[#333] font-bold tracking-wide uppercase mb-1.5">
          Por tipo
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LOG_TYPES.map((f) => {
            const active = filterType === f.id;
            const et = EVENT_TYPES[f.id];
            const color = et?.color || "#666";
            return (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                style={{
                  background: active ? `${color}25` : "#0D0D1A",
                  border: `1.5px solid ${active ? color : "#2A2A3E"}`,
                  color: active ? color : "#555",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, evts]) => (
          <div key={date}>
            <div className="text-[10px] text-[#333] font-extrabold tracking-wide uppercase my-3">
              {date}
            </div>
            {evts.map((ev) => (
              <EventRow
                key={ev.id}
                event={ev}
                showDelete
                onDelete={onDelete}
              />
            ))}
          </div>
        ))
      ) : (
        <div className="text-center text-[#444] py-10">Sin registros</div>
      )}
    </div>
  );
}
