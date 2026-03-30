"use client";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-none text-2xl font-black cursor-pointer z-50 flex items-center justify-center active:scale-95 transition-transform"
      style={{
        background: "linear-gradient(135deg, #4FC3F7, #81C784)",
        color: "#000",
        boxShadow: "0 4px 20px #4FC3F740",
      }}
    >
      +
    </button>
  );
}
