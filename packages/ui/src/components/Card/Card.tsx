import React from "react";

export interface CardProps {
  children?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = "md", 
  hoverable, 
  className = "" 
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-3 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  };

  return (
    <div className={`
      bg-[var(--ui-surface)] 
      border border-[var(--ui-border)] 
      rounded-[var(--ui-radius-lg)] 
      shadow-[var(--ui-shadow-sm)]
      ${paddings[padding]}
      ${hoverable ? "hover:shadow-[var(--ui-shadow-md)] transition-shadow cursor-pointer" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; className?: string }> = ({ 
  title, subtitle, action, className = "" 
}) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-[var(--ui-text)]">{title}</h3>
      {subtitle && <p className="text-sm text-[var(--ui-text-muted)]">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`mt-6 pt-4 border-t border-[var(--ui-border)] ${className}`}>{children}</div>
);
