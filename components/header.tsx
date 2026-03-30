"use client";

import { formatTime, ago } from "@/lib/utils";

interface HeaderProps {
  lastUpdate: string | null;
  isLive: boolean;
}

export function Header({ lastUpdate, isLive }: HeaderProps) {
  const date = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const lastRegStr = lastUpdate
    ? `Ultimo registro ${ago(lastUpdate)} (${formatTime(lastUpdate)})`
    : "";

  return (
    <div
      className="pt-12 pb-3 px-5"
      style={{
        background: "linear-gradient(to bottom, #0A0A15, #0A0A1500)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-black tracking-tight flex items-center gap-2">
            <span>🌙</span> BebeTrack
          </div>
          <div className="text-xs text-[#444] mt-0.5 capitalize">{date}</div>
          {lastUpdate && (
            <div className="text-[11px] text-[#4A4A6A] mt-1 font-semibold">
              {lastRegStr}
            </div>
          )}
        </div>
        {isLive && (
          <div
            className="text-[10px] font-extrabold px-2 py-1 rounded-full"
            style={{
              background: "#66BB6A20",
              color: "#66BB6A",
              border: "1px solid #66BB6A40",
            }}
          >
            🟢 En vivo
          </div>
        )}
      </div>
    </div>
  );
}
