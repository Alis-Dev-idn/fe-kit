import React from "react";

interface DemoAreaProps {
  children: React.ReactNode;
  label?: string;
}

export const DemoArea: React.FC<DemoAreaProps> = ({ children, label = "Live Demo" }) => {
  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="pulse-dot" />
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">
          {label}
        </span>
      </div>
      <div className="demo-area min-h-[100px] flex items-center justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
