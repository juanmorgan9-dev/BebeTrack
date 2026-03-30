"use client";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full text-[26px] font-black cursor-pointer z-[65] flex items-center justify-center active:scale-[0.93] transition-transform"
      style={{
        bottom: "32px",
        background: "linear-gradient(135deg, #4FC3F7, #81C784)",
        border: "3px solid #0A0A15",
        color: "#000",
        boxShadow: "0 4px 20px #4FC3F760",
      }}
    >
      +
    </button>
  );
}
