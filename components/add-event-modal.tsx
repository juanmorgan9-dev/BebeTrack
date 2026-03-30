"use client";

import { useState } from "react";
import { BabyEvent } from "@/lib/types";
import {
  BABIES,
  EVENT_TYPES,
  FEED_SUBTYPES,
  OTHER_SUBTYPES,
  POOP_CONSISTENCY,
  POOP_COLORS,
  BREAST_DURATIONS,
  ML_OPTIONS,
} from "@/lib/constants";
import { toDateTimeLocal } from "@/lib/utils";

interface AddEventModalProps {
  onClose: () => void;
  onSave: (event: Omit<BabyEvent, "id" | "created_at">) => Promise<void>;
  initialBabyId?: string;
  initialType?: string;
}

export function AddEventModal({
  onClose,
  onSave,
  initialBabyId = "santi",
  initialType = "feed",
}: AddEventModalProps) {
  const [babyId, setBabyId] = useState<string | null>(
    initialType === "extraction" ? null : initialBabyId
  );
  const [type, setType] = useState(initialType);
  const [subtype, setSubtype] = useState<string | null>(
    initialType === "feed" ? "breast" : null
  );
  const [otherSubtype, setOtherSubtype] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState(toDateTimeLocal(new Date().toISOString()));
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [ml, setMl] = useState<number | null>(null);
  const [consistency, setConsistency] = useState<string | null>(null);
  const [poopColor, setPoopColor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setSubtype(newType === "feed" ? "breast" : null);
    setOtherSubtype(null);
    setDurationMin(null);
    setMl(null);
    setConsistency(null);
    setPoopColor(null);
    if (newType === "extraction") {
      setBabyId(null);
    } else if (!babyId) {
      setBabyId("santi");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        baby_id: babyId,
        type: type as BabyEvent["type"],
        subtype,
        other_subtype: otherSubtype,
        date_time: new Date(dateTime).toISOString(),
        duration_min: durationMin,
        ml,
        consistency,
        poop_color: poopColor,
        notes: notes || null,
      });
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ background: "#000c", animation: "fadeIn 0.2s" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 pb-9"
        style={{ background: "#12121F", animation: "slideUp 0.25s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">Nuevo registro</h2>
          <button
            onClick={onClose}
            className="text-2xl text-[#555] hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Event Type */}
        <div className="mb-4">
          <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
            Tipo
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(EVENT_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
                className="px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all"
                style={{
                  background: type === key ? `${val.color}30` : "#0D0D1A",
                  border: `1.5px solid ${type === key ? val.color : "#2A2A3E"}`,
                  color: type === key ? val.color : "#555",
                }}
              >
                {val.icon} {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Baby Selection (not for extraction) */}
        {type !== "extraction" && (
          <div className="mb-4">
            <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
              Bebe
            </div>
            <div className="flex gap-2">
              {BABIES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBabyId(b.id)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all"
                  style={{
                    background: babyId === b.id ? `${b.color}30` : "#0D0D1A",
                    border: `1.5px solid ${babyId === b.id ? b.color : "#2A2A3E"}`,
                    color: babyId === b.id ? b.color : "#555",
                  }}
                >
                  {b.emoji} {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feed Subtype */}
        {type === "feed" && (
          <div className="mb-4">
            <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
              Subtipo
            </div>
            <div className="flex flex-wrap gap-2">
              {FEED_SUBTYPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubtype(s.id)}
                  className="px-3 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    background: subtype === s.id ? "#4FC3F730" : "#0D0D1A",
                    border: `1.5px solid ${subtype === s.id ? "#4FC3F7" : "#2A2A3E"}`,
                    color: subtype === s.id ? "#4FC3F7" : "#555",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration for breast */}
        {type === "feed" && subtype === "breast" && (
          <div className="mb-4">
            <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
              Duracion (min)
            </div>
            <div className="flex flex-wrap gap-2">
              {BREAST_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDurationMin(d)}
                  className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    background: durationMin === d ? "#4FC3F730" : "#0D0D1A",
                    border: `1.5px solid ${durationMin === d ? "#4FC3F7" : "#2A2A3E"}`,
                    color: durationMin === d ? "#4FC3F7" : "#555",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ML for pumped, formula, extraction */}
        {((type === "feed" && (subtype === "pumped" || subtype === "formula")) ||
          type === "extraction") && (
          <div className="mb-4">
            <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
              Cantidad (ml)
            </div>
            <div className="flex flex-wrap gap-2">
              {ML_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMl(m)}
                  className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    background: ml === m ? "#4FC3F730" : "#0D0D1A",
                    border: `1.5px solid ${ml === m ? "#4FC3F7" : "#2A2A3E"}`,
                    color: ml === m ? "#4FC3F7" : "#555",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={ml || ""}
              onChange={(e) => setMl(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Otro valor..."
              className="mt-2 w-full rounded-xl p-3 text-sm"
              style={{
                background: "#0D0D1A",
                border: "1px solid #2A2A3E",
                color: "#fff",
              }}
            />
          </div>
        )}

        {/* Poop options */}
        {type === "poop" && (
          <>
            <div className="mb-4">
              <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
                Consistencia
              </div>
              <div className="flex flex-wrap gap-2">
                {POOP_CONSISTENCY.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConsistency(c)}
                    className="px-3 py-2 rounded-xl text-sm font-bold cursor-pointer"
                    style={{
                      background: consistency === c ? "#FFCC8030" : "#0D0D1A",
                      border: `1.5px solid ${consistency === c ? "#FFCC80" : "#2A2A3E"}`,
                      color: consistency === c ? "#FFCC80" : "#555",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
                Color
              </div>
              <div className="flex flex-wrap gap-2">
                {POOP_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setPoopColor(c)}
                    className="px-3 py-2 rounded-xl text-sm font-bold cursor-pointer"
                    style={{
                      background: poopColor === c ? "#FFCC8030" : "#0D0D1A",
                      border: `1.5px solid ${poopColor === c ? "#FFCC80" : "#2A2A3E"}`,
                      color: poopColor === c ? "#FFCC80" : "#555",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Other subtype */}
        {type === "other" && (
          <div className="mb-4">
            <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
              Subtipo
            </div>
            <div className="flex flex-wrap gap-2">
              {OTHER_SUBTYPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setOtherSubtype(s.id)}
                  className="px-3 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    background: otherSubtype === s.id ? "#90A4AE30" : "#0D0D1A",
                    border: `1.5px solid ${otherSubtype === s.id ? "#90A4AE" : "#2A2A3E"}`,
                    color: otherSubtype === s.id ? "#90A4AE" : "#555",
                  }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date/Time */}
        <div className="mb-4">
          <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
            Fecha y hora
          </div>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-xl p-3 text-sm"
            style={{
              background: "#0D0D1A",
              border: "1px solid #2A2A3E",
              color: "#fff",
            }}
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <div className="text-[11px] text-[#555] font-bold tracking-wide uppercase mb-2">
            Notas (opcional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-xl p-3 text-sm resize-none"
            style={{
              background: "#0D0D1A",
              border: "1px solid #2A2A3E",
              color: "#fff",
            }}
            placeholder="Agregar nota..."
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl text-base font-extrabold cursor-pointer disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #4FC3F7, #81C784)",
            color: "#000",
          }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
