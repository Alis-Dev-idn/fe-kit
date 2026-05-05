import React from "react";
import { SwitchGroupProps } from "./Switch.types";
import { Switch } from "./Switch";

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
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
  const handleToggle = (val: string, active: boolean) => {
    if (disabled) return;
    const nextValue = active
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
        className={`switch-group-container ${direction}`}
        style={{ 
          display: "flex", 
          flexDirection: direction === "vertical" ? "column" : "row",
          gap: "1.25rem",
          flexWrap: "wrap"
        }}
      >
        {options.map((option) => (
          <div key={option.value} className="switch-group-item">
            <Switch
              label={option.label}
              checked={value.includes(option.value)}
              onChange={(active) => handleToggle(option.value, active)}
              disabled={disabled || option.disabled}
            />
            {option.description && (
              <p className="input-message helper" style={{ marginLeft: "3.25rem", marginTop: "-0.25rem" }}>
                {option.description}
              </p>
            )}
          </div>
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
