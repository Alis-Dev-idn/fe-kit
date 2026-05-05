import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = "primary", 
    size = "md", 
    loading, 
    disabled, 
    fullWidth, 
    leftIcon, 
    rightIcon, 
    className = "", 
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] hover:bg-[var(--ui-primary-hover)]",
      secondary: "bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] hover:bg-[var(--ui-secondary-hover)]",
      outline: "border border-[var(--ui-border)] bg-transparent hover:bg-[var(--ui-secondary)] text-[var(--ui-text)]",
      ghost: "bg-transparent hover:bg-[var(--ui-secondary)] text-[var(--ui-text)]",
      danger: "bg-[var(--ui-danger)] text-white hover:opacity-90",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm rounded-[var(--ui-radius-sm)]",
      md: "h-11 px-4 text-base rounded-[var(--ui-radius)]",
      lg: "h-12 px-6 text-lg rounded-[var(--ui-radius-lg)]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
