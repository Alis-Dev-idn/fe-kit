import React from "react";

type CalloutType = "info" | "warning" | "danger" | "tip";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CONFIG = {
  info: {
    color: "#4ea8de",
    bg: "rgba(78, 168, 222, 0.1)",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  warning: {
    color: "var(--warning)",
    bg: "rgba(245, 158, 11, 0.1)",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  },
  danger: {
    color: "var(--danger)",
    bg: "rgba(239, 68, 68, 0.1)",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  tip: {
    color: "var(--success)",
    bg: "rgba(34, 197, 94, 0.1)",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  }
};

export const Callout: React.FC<CalloutProps> = ({ type, title, children }) => {
  const config = CONFIG[type];

  return (
    <div 
      className="my-6 flex gap-4 p-4 rounded-r-lg border-l-[3px]" 
      style={{ backgroundColor: config.bg, borderColor: config.color }}
    >
      <div style={{ color: config.color }} className="shrink-0 mt-0.5">
        {config.icon}
      </div>
      <div>
        {title && <h4 className="text-sm font-bold mb-1 uppercase tracking-wider" style={{ color: config.color }}>{title}</h4>}
        <div className="text-sm text-text-2 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
