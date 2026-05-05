import React from "react";
import { SwitchProps } from "./Switch.types";

export const Switch: React.FC<SwitchProps> = ({
  label,
  helperText,
  error,
  required,
  disabled,
  readOnly,
  className = "",
  labelClassName = "",
  errorClassName = "",
  helperClassName = "",
  theme,
  checked,
  onChange,
  onBlur,
  labelPosition = "right",
  activeColor,
  inactiveColor,
  name,
}) => {
  const handleToggle = () => {
    if (disabled || readOnly) return;
    onChange?.(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={theme}>
      <label 
        className={`check-wrapper ${disabled ? "disabled" : ""}`}
        style={{ flexDirection: labelPosition === "left" ? "row-reverse" : "row", gap: "0.75rem" }}
      >
        <div 
          className={`switch-input ${checked ? "checked" : ""}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="switch"
          aria-checked={checked}
          style={{ 
            backgroundColor: checked ? activeColor : inactiveColor 
          }}
        >
          <div className="switch-thumb" />
          <input 
            type="checkbox" 
            name={name} 
            checked={checked} 
            onChange={handleToggle} 
            style={{ display: "none" }} 
            disabled={disabled}
          />
        </div>
        {label && (
          <span className={`check-label ${labelClassName} ${required ? "required" : ""}`}>
            {label}
          </span>
        )}
      </label>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"} ${error ? errorClassName : helperClassName}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
