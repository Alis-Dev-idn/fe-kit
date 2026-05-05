import React from "react";

export const Divider: React.FC<{ className?: string; vertical?: boolean }> = ({ 
  className = "", 
  vertical 
}) => (
  <div className={`
    bg-[var(--ui-border)] 
    ${vertical ? "w-[1px] h-full mx-4" : "h-[1px] w-full my-4"}
    ${className}
  `} />
);

export interface StackProps {
  children: React.ReactNode;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  gap?: number | string;
  className?: string;
  responsive?: boolean; // if true, column on mobile, row on desktop
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = "column",
  align = "stretch",
  justify = "start",
  gap = "1rem",
  className = "",
  responsive
}) => {
  const aligns = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" };
  const justifies = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" };

  return (
    <div 
      className={`
        flex 
        ${responsive ? "flex-col md:flex-row" : ""}
        ${!responsive && direction === "row" ? "flex-row" : ""}
        ${!responsive && direction === "column" ? "flex-col" : ""}
        ${aligns[align]}
        ${justifies[justify]}
        ${className}
      `}
      style={{ gap }}
    >
      {children}
    </div>
  );
};
