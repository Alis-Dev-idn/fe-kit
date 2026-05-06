import React from "react";

export type Category = "Data & State" | "UI & Overlay" | "Display" | "Navigation" | "Map";

interface KitBadgeProps {
  category: Category;
}

const CONFIG = {
  "Data & State": { bg: "rgba(78, 168, 222, 0.12)", text: "#4ea8de", border: "rgba(78, 168, 222, 0.25)" },
  "UI & Overlay": { bg: "rgba(110, 86, 207, 0.12)", text: "#a78bfa", border: "rgba(110, 86, 207, 0.25)" },
  "Display": { bg: "rgba(34, 197, 94, 0.12)", text: "#4ade80", border: "rgba(34, 197, 94, 0.25)" },
  "Navigation": { bg: "rgba(245, 158, 11, 0.12)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.25)" },
  "Map": { bg: "rgba(239, 68, 68, 0.12)", text: "#f87171", border: "rgba(239, 68, 68, 0.25)" },
};

export const KitBadge: React.FC<KitBadgeProps> = ({ category }) => {
  const config = CONFIG[category];

  return (
    <span 
      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-4"
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}
    >
      {category}
    </span>
  );
};
