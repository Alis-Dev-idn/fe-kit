import React from "react";

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className = "", 
  color = "var(--ui-primary)" 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-[var(--ui-secondary)] rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full transition-all duration-300 ease-in-out"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
};
