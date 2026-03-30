"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { BabyCard } from "@/components/baby-card";
import { EventRow } from "@/components/event-row";

interface HomeTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
  onViewAll: () => void;
}

function SpecialDayBanner() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  if (m === 9 && d === 11) {
    return (
      <div
        className="rounded-2xl p-4 mb-4 text-center"
        style={{
          background: "linear-gradient(135deg, #FFD70030, #FF8C0030)",
          border: "1px solid #FFD70060",
        }}
      >
        <div className="text-3xl mb-1">🎂</div>
        <div className="text-base font-black" style={{ color: "#FFD700" }}>
          Feliz cumple a Santi y Jero!
        </div>
      </div>
    );
  }

  if (m === 9 && d === 30) {
    return (
      <div
        className="rounded-2xl p-4 mb-4 text-center"
        style={{
          background: "linear-gradient(135deg, #81C78430, #66BB6A20)",
          border: "1px solid #81C78460",
        }}
      >
        <div className="text-2xl mb-1">✝️</div>
        <div className="text-sm font-black" style={{ color: "#81C784" }}>
          Hoy es el dia de San Jeronimo
        </div>
        <div className="text-xs text-[#aaa] mt-1">
          Hoy la Iglesia reza por Jero, para que sea Santo!
        </div>
      </div>
    );
  }

  if (m === 7 && d === 25) {
    return (
      <div
        className="rounded-2xl p-4 mb-4 text-center"
        style={{
          background: "linear-gradient(135deg, #4FC3F730, #29B6F620)",
          border: "1px solid #4FC3F760",
        }}
      >
        <div className="text-2xl mb-1">✝️</div>
        <div className="text-sm font-black" style={{ color: "#4FC3F7" }}>
          Hoy es el dia de Santiago Apostol
        </div>
        <div className="text-xs text-[#aaa] mt-1">
          Hoy la Iglesia reza por Santi, para que sea Santo!
        </div>
      </div>
    );
  }

  return null;
}

export function HomeTab({ events, onDelete, onViewAll }: HomeTabProps) {
  return (
    <div>
      <SpecialDayBanner />
      
      {BABIES.map((baby) => (
        <BabyCard key={baby.id} baby={baby} events={events} />
      ))}

      <div className="mt-2">
        <div className="text-[11px] text-[#333] font-extrabold tracking-wide uppercase mb-2">
          Ultimos eventos
        </div>
        
        {events.length > 0 ? (
          events.slice(0, 7).map((ev) => (
            <EventRow
              key={ev.id}
              event={ev}
              showDelete
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center text-[#444] py-6 text-sm">
            Sin registros aun
          </div>
        )}

        <button
          onClick={onViewAll}
          className="w-full py-3 mt-2 rounded-xl text-xs cursor-pointer"
          style={{
            background: "transparent",
            border: "1px solid #2A2A3E",
            color: "#555",
          }}
        >
          Ver todo →
        </button>
      </div>
    </div>
  );
}
