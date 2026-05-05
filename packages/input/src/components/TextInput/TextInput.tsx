import React, { useState, useCallback, useRef, useEffect } from "react";
import { TextInputProps } from "./TextInput.types";
import { InputKit } from "../../core/InputKit";

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error: propError,
  required,
  disabled,
  readOnly,
  loading,
  size: propSize,
  variant: propVariant,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helperClassName = "",
  theme: propTheme,
  type = "text",
  placeholder,
  prefix,
  suffix,
  prefixText,
  suffixText,
  stepper,
  min,
  max,
  step = 1,
  copyable,
  onCopy,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  validation,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(propError);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = InputKit.getConfig();
  const size = propSize || config.size || "md";
  const variant = propVariant || config.variant || "outline";
  
  useEffect(() => {
    setError(propError);
  }, [propError]);

  const handleValidation = useCallback((val: any) => {
    if (validation) {
      const result = validation.safeParse(val);
      if (!result.success) {
        setError(result.error.errors[0].message);
      } else {
        setError(undefined);
      }
    }
  }, [validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: string | number = e.target.value;
    if (type === "number") {
      val = val === "" ? "" : Number(val);
    }
    onChange?.(val);
  };

  const handleBlurInternal = () => {
    handleValidation(value);
    onBlur?.();
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const clearSearch = () => {
    onChange?.("");
    inputRef.current?.focus();
  };

  const handleStep = (increment: boolean) => {
    if (disabled || readOnly) return;
    const current = Number(value) || 0;
    let next = increment ? current + step : current - step;
    
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    
    onChange?.(next);
  };

  const handleCopy = async () => {
    if (value !== undefined) {
      await navigator.clipboard.writeText(String(value));
      onCopy?.();
    }
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  // Sizes mapping
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={propTheme}>
      {label && (
        <label className={`input-label ${labelClassName} ${required ? "required" : ""}`}>
          {label}
        </label>
      )}
      
      <div className={`input-container variant-${variant} size-${size} ${disabled ? "disabled" : ""} ${error ? "has-error" : ""}`}>
        {prefixText && <span className="input-prefix-text">{prefixText}</span>}
        {prefix && <span className="input-prefix-icon">{prefix}</span>}
        
        <div className="input-inner">
          {type === "search" && <span className="search-icon">🔍</span>}
          
          <input
            ref={inputRef}
            name={name}
            type={inputType}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlurInternal}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={`input-element ${inputClassName}`}
            min={min}
            max={max}
            step={step}
          />

          {loading && <span className="loading-spinner"></span>}
          
          {type === "password" && (
            <button type="button" className="password-toggle" onClick={togglePassword} tabIndex={-1}>
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          )}

          {type === "search" && value && !disabled && !readOnly && (
            <button type="button" className="search-clear" onClick={clearSearch} tabIndex={-1}>
              ×
            </button>
          )}

          {copyable && !loading && (
            <button type="button" className="copy-button" onClick={handleCopy} tabIndex={-1}>
              📋
            </button>
          )}
        </div>

        {stepper && type === "number" && !disabled && !readOnly && (
          <div className="stepper-buttons">
            <button type="button" onClick={() => handleStep(false)} tabIndex={-1}>-</button>
            <button type="button" onClick={() => handleStep(true)} tabIndex={-1}>+</button>
          </div>
        )}

        {suffix && <span className="input-suffix-icon">{suffix}</span>}
        {suffixText && <span className="input-suffix-text">{suffixText}</span>}
      </div>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"} ${error ? errorClassName : helperClassName}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
