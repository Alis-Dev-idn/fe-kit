import React from "react";
import { CheckboxGroupProps } from "./Checkbox.types";
import { Checkbox } from "./Checkbox";

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value = [],
  onChange,
  direction = "vertical",
  className = "",
  labelClassName = "",
  disabled,
  theme,
  helperText,
  error,
}) => {
  const handleToggle = (val: string, checked: boolean) => {
    if (disabled) return;
    const nextValue = checked
      ? [...value, val]
      : value.filter((v) => v !== val);
    onChange?.(nextValue);
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={theme}>
      {label && (
        <label className={`input-label ${labelClassName}`}>
          {label}
        </label>
      )}
      
      <div 
        className={`checkbox-group-container ${direction}`} 
        style={{ 
          display: "flex", 
          flexDirection: direction === "vertical" ? "column" : "row",
          gap: "1rem",
          flexWrap: "wrap"
        }}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onChange={(checked) => handleToggle(option.value, checked)}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
