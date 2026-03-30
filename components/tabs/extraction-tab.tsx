"use client";

import { BabyEvent } from "@/lib/types";
import { BABIES } from "@/lib/constants";
import { EventRow } from "@/components/event-row";
import { timeStr } from "@/lib/utils";

interface ExtractionTabProps {
  events: BabyEvent[];
  onDelete: (id: string) => void;
  onAddExtraction: () => void;
}

export function ExtractionTab({ events, onDelete, onAddExtraction }: ExtractionTabProps) {
  const extractions = events
    .filter((e) => e.type === "extraction")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

  const lastExt = extractions[0] || null;
  const lastBreast = events
    .filter((e) => e.type === "feed" && e.subtype === "breast")
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0] || null;

  const lastBreastBaby = lastBreast
    ? BABIES.find((b) => b.id === lastBreast.baby_id)
    : null;

  const extH = lastExt
    ? (Date.now() - new Date(lastExt.date_time).getTime()) / 3600000
    : null;
  const breastH = lastBreast
    ? (Date.now() - new Date(lastBreast.date_time).getTime()) / 3600000
    : null;

  const bothHigh = extH !== null && breastH !== null && extH > 3 && breastH > 3;
  const bothVeryHigh = extH !== null && breastH !== null && extH > 6 && breastH > 6;
  const bannerColor = bothVeryHigh ? "#EF5350" : bothHigh ? "#FFB74D" : "#F48FB1";

  // Stats
  const last24h = extractions.filter(
    (e) => new Date(e.date_time) >= new Date(Date.now() - 86400000)
  );
  const totalMl24h = last24h.reduce((a, e) => a + (e.ml || 0), 0);

  return (
    <div>
      {/* Status Banner */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{
          background: `${bannerColor}18`,
          border: `1px solid ${bannerColor}40`,
        }}
      >
        <div className="text-base font-black mb-3" style={{ color: bannerColor }}>
          🪣 Estado de Extraccion
        </div>

        <div className="flex gap-3 mb-3">
          <div
            className="flex-1 rounded-xl p-3"
            style={{ background: "#0D0D1A" }}
          >
            <div className="text-xs text-[#555] mb-1">Ultima extraccion</div>
            <div className="text-sm font-bold text-white">
              {extH !== null ? timeStr(extH) : "Sin registro"}
            </div>
            {lastExt?.ml && (
              <div className="text-xs text-[#F48FB1] mt-1">{lastExt.ml}ml</div>
            )}
          </div>
          <div
            className="flex-1 rounded-xl p-3"
            style={{ background: "#0D0D1A" }}
          >
            <div className="text-xs text-[#555] mb-1">Ultima teta</div>
            <div className="text-sm font-bold text-white">
              {breastH !== null ? timeStr(breastH) : "Sin registro"}
            </div>
            {lastBreastBaby && (
              <div
                className="text-xs mt-1"
                style={{ color: lastBreastBaby.color }}
              >
                {lastBreastBaby.emoji} {lastBreastBaby.name}
              </div>
            )}
          </div>
        </div>

        {bothHigh && (
          <div className="text-xs text-center p-2 rounded-lg mb-2" style={{ background: `${bannerColor}20` }}>
            {bothVeryHigh
              ? "⚠️ Mas de 6hs sin teta ni extraccion - conviene extraer pronto"
              : "💡 Mas de 3hs sin teta ni extraccion"}
          </div>
        )}

        <button
          onClick={onAddExtraction}
          className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #F48FB1, #CE93D8)",
            color: "#000",
          }}
        >
          + Nueva extraccion
        </button>
      </div>

      {/* Stats */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#1A1A2E", border: "1px solid #2A2A3E" }}
      >
        <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
          Ultimas 24 horas
        </div>
        <div className="flex gap-4">
          <div>
            <div className="text-2xl font-black text-white">{last24h.length}</div>
            <div className="text-[10px] text-[#555]">extracciones</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: "#F48FB1" }}>
              {totalMl24h}ml
            </div>
            <div className="text-[10px] text-[#555]">total</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="text-[11px] text-[#333] font-extrabold tracking-wide uppercase mb-2">
        Historial de extracciones
      </div>
      {extractions.length > 0 ? (
        extractions.slice(0, 10).map((ev) => (
          <EventRow key={ev.id} event={ev} showDelete onDelete={onDelete} />
        ))
      ) : (
        <div className="text-center text-[#444] py-6 text-sm">
          Sin extracciones registradas
        </div>
      )}
    </div>
  );
}
