import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = "default", 
  className = "" 
}) => {
  const variants = {
    default: "bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)]",
    success: "bg-[#dcfce7] text-[#166534] dark:bg-[#064e3b] dark:text-[#34d399]",
    warning: "bg-[#fef9c3] text-[#854d0e] dark:bg-[#422006] dark:text-[#fbbf24]",
    danger: "bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#f87171]",
    outline: "border border-[var(--ui-border)] text-[var(--ui-text)]",
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};
