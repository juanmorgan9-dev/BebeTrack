"use client";

import { BabyEvent, Baby } from "@/lib/types";
import { poopColor, feedColor, bathColor, timeStr } from "@/lib/utils";

interface Stats24h {
  feeds: number;
  totalMl: number;
  pees: number;
  poops: number;
  lastFeedH: number | null;
  lastPoopH: number | null;
  lastBathH: number | null;
}

function getStats24h(events: BabyEvent[], babyId: string): Stats24h {
  const since = new Date(Date.now() - 86400000);
  const evs = events.filter(
    (e) => e.baby_id === babyId && new Date(e.date_time) >= since
  );
  const feeds = evs.filter((e) => e.type === "feed");
  const lastFeed = events
    .filter((e) => e.baby_id === babyId && e.type === "feed")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];
  const lastPoop = events
    .filter((e) => e.baby_id === babyId && e.type === "poop")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];
  const lastBath = events
    .filter((e) => e.baby_id === babyId && e.type === "bath")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];

  return {
    feeds: feeds.length,
    totalMl: feeds.reduce((a, e) => a + (e.ml || 0), 0),
    pees: evs.filter((e) => e.type === "pee").length,
    poops: evs.filter((e) => e.type === "poop").length,
    lastFeedH: lastFeed
      ? (Date.now() - new Date(lastFeed.date_time).getTime()) / 3600000
      : null,
    lastPoopH: lastPoop
      ? (Date.now() - new Date(lastPoop.date_time).getTime()) / 3600000
      : null,
    lastBathH: lastBath
      ? (Date.now() - new Date(lastBath.date_time).getTime()) / 3600000
      : null,
  };
}

interface BabyCardProps {
  baby: Baby;
  events: BabyEvent[];
}

export function BabyCard({ baby, events }: BabyCardProps) {
  const s = getStats24h(events, baby.id);
  const pc = poopColor(s.lastPoopH);
  const fc = feedColor(s.lastFeedH);
  const bc = bathColor(s.lastBathH);

  const statCells = [
    { lbl: "Alimento", val: s.feeds, icon: "🍼" },
    { lbl: "ml (24h)", val: s.totalMl || "—", icon: "📊" },
    { lbl: "Pis", val: s.pees, icon: "💧" },
    { lbl: "Popo", val: s.poops, icon: "💩" },
  ];

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{
        background: "#1A1A2E",
        border: `1px solid ${baby.color}30`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{baby.emoji}</span>
          <span
            className="text-xl font-extrabold"
            style={{ color: baby.color }}
          >
            {baby.name}
          </span>
        </div>
        <div
          className="text-[10px] font-extrabold tracking-wide px-3 py-1 rounded-xl"
          style={{
            background: "#151525",
            border: "1px solid #2A2A3E",
            color: "#666",
          }}
        >
          ULTIMAS 24H
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {statCells.map((x) => (
          <div
            key={x.lbl}
            className="rounded-xl py-2 px-1 text-center"
            style={{ background: "#0D0D1A" }}
          >
            <div className="text-base">{x.icon}</div>
            <div className="text-base font-extrabold text-white">{x.val}</div>
            <div className="text-[8px] text-[#555] mt-0.5">{x.lbl}</div>
          </div>
        ))}
      </div>

      {/* Poop Line */}
      <div
        className="flex items-center gap-2 rounded-lg p-2 mb-1.5"
        style={{
          background: `${pc.color}18`,
          border: `1px solid ${pc.color}40`,
        }}
      >
        <span className="text-base">💩</span>
        <span
          className="text-xs font-bold flex-1"
          style={{ color: pc.color }}
        >
          {s.lastPoopH !== null
            ? `Ultimo popo: ${timeStr(s.lastPoopH)}`
            : "Sin popo registrado"}
        </span>
        {pc.icon && <span className="text-sm">{pc.icon}</span>}
      </div>

      {/* Feed Line */}
      {s.lastFeedH !== null && (
        <div
          className="flex items-center gap-2 rounded-lg p-2 mb-1.5"
          style={{
            background: `${fc}18`,
            border: `1px solid ${fc}40`,
          }}
        >
          <span className="text-base">🍼</span>
          <span className="text-xs font-bold flex-1" style={{ color: fc }}>
            Ultima toma: {timeStr(s.lastFeedH)}
          </span>
        </div>
      )}

      {/* Bath Line */}
      <div
        className="flex items-center gap-2 rounded-lg p-2"
        style={{
          background: `${bc.color}18`,
          border: `1px solid ${bc.color}40`,
        }}
      >
        <span className="text-base">🛁</span>
        <span
          className="text-xs font-bold flex-1"
          style={{ color: bc.color }}
        >
          {s.lastBathH !== null
            ? `Ultimo bano: ${timeStr(s.lastBathH)}`
            : "Sin banos registrados"}
        </span>
        {bc.icon && <span className="text-sm">{bc.icon}</span>}
      </div>
    </div>
  );
}
