"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import { BABIES, RANGES } from "@/lib/constants";
import { rangeStart } from "@/lib/utils";

interface StatsTabProps {
  events: BabyEvent[];
}

interface RangeStats {
  baths: number;
  pees: number;
  poops: number;
  breast: { count: number; totalMin: number };
  pumped: { count: number; totalMl: number };
  formula: { count: number; totalMl: number };
  solid: { count: number };
}

function getStatsForRange(events: BabyEvent[], babyId: string, range: string): RangeStats {
  const since = rangeStart(range);
  const evs = events.filter(
    (e) => e.baby_id === babyId && new Date(e.date_time) >= since
  );
  const br = evs.filter((e) => e.type === "feed" && e.subtype === "breast");
  const pu = evs.filter((e) => e.type === "feed" && e.subtype === "pumped");
  const fo = evs.filter((e) => e.type === "feed" && e.subtype === "formula");
  const so = evs.filter((e) => e.type === "feed" && e.subtype === "solid");

  return {
    baths: evs.filter((e) => e.type === "bath").length,
    pees: evs.filter((e) => e.type === "pee").length,
    poops: evs.filter((e) => e.type === "poop").length,
    breast: {
      count: br.length,
      totalMin: br.reduce((a, e) => a + (e.duration_min || 0), 0),
    },
    pumped: {
      count: pu.length,
      totalMl: pu.reduce((a, e) => a + (e.ml || 0), 0),
    },
    formula: {
      count: fo.length,
      totalMl: fo.reduce((a, e) => a + (e.ml || 0), 0),
    },
    solid: { count: so.length },
  };
}

export function StatsTab({ events }: StatsTabProps) {
  const [statsRange, setStatsRange] = useState("7d");

  return (
    <div>
      {/* Range Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => setStatsRange(r.id)}
            className="px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
            style={{
              background: statsRange === r.id ? "#4FC3F730" : "#0D0D1A",
              border: `1.5px solid ${statsRange === r.id ? "#4FC3F7" : "#2A2A3E"}`,
              color: statsRange === r.id ? "#4FC3F7" : "#555",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Baby Stats Cards */}
      {BABIES.map((baby) => {
        const rs = getStatsForRange(events, baby.id, statsRange);
        const statGrid = [
          { icon: "🛁", lbl: "Banos", val: rs.baths },
          { icon: "💧", lbl: "Pis", val: rs.pees },
          { icon: "💩", lbl: "Popo", val: rs.poops },
          {
            icon: "🤱",
            lbl: "Teta",
            val: `${rs.breast.count}x${rs.breast.totalMin ? ` · ${rs.breast.totalMin}m` : ""}`,
          },
          {
            icon: "🍼",
            lbl: "Mamadera",
            val: `${rs.pumped.count}x${rs.pumped.totalMl ? ` · ${rs.pumped.totalMl}ml` : ""}`,
          },
          {
            icon: "🥛",
            lbl: "Formula",
            val: `${rs.formula.count}x${rs.formula.totalMl ? ` · ${rs.formula.totalMl}ml` : ""}`,
          },
          { icon: "🥣", lbl: "Solido", val: `${rs.solid.count}x` },
        ];

        return (
          <div
            key={baby.id}
            className="rounded-2xl p-4 mb-4"
            style={{
              background: "#1A1A2E",
              border: `1px solid ${baby.color}30`,
            }}
          >
            <div
              className="text-lg font-black mb-3"
              style={{ color: baby.color }}
            >
              {baby.emoji} {baby.name}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {statGrid.map((x) => (
                <div
                  key={x.lbl}
                  className="rounded-xl p-2 flex items-center gap-2"
                  style={{ background: "#0D0D1A" }}
                >
                  <span className="text-lg">{x.icon}</span>
                  <div>
                    <div className="text-sm font-extrabold text-white">
                      {x.val}
                    </div>
                    <div className="text-[8px] text-[#555]">{x.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
