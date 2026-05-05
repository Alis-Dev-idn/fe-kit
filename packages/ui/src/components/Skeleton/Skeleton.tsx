import React from "react";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  circle, 
  className = "" 
}) => {
  return (
    <div 
      className={`animate-shimmer rounded-[var(--ui-radius-sm)] ${circle ? "rounded-full" : ""} ${className}`}
      style={{ 
        width: width ?? "100%", 
        height: height ?? "1rem" 
      }}
    />
  );
};
