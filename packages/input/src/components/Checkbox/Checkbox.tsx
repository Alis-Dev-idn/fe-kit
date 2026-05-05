import React from "react";
import { CheckboxProps } from "./Checkbox.types";

export const Checkbox: React.FC<CheckboxProps> = ({
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
  indeterminate,
  onChange,
  onBlur,
  labelPosition = "right",
  name,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    onChange?.(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={theme}>
      <label 
        className={`check-wrapper ${disabled ? "disabled" : ""}`} 
        style={{ flexDirection: labelPosition === "left" ? "row-reverse" : "row", gap: "0.5rem" }}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked || false}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          className={`checkbox-input ${indeterminate ? "indeterminate" : ""}`}
        />
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
