import React, { useState, useCallback, useRef, useEffect } from "react";
import { TextAreaProps } from "./TextArea.types";
import { InputKit } from "../../core/InputKit";

export const TextArea: React.FC<TextAreaProps> = ({
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
  placeholder,
  autoResize = true,
  minRows = 3,
  maxRows = 10,
  rows: propRows,
  value,
  onChange,
  onBlur,
  onFocus,
  validation,
  name,
}) => {
  const [error, setError] = useState(propError);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize || propRows !== undefined) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    
    // Calculate line height (approximate if not computed)
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight) || 20;
    
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;
    
    let nextHeight = Math.max(scrollHeight, minHeight);
    if (maxRows) {
      nextHeight = Math.min(nextHeight, maxHeight);
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
    
    textarea.style.height = `${nextHeight}px`;
  }, [autoResize, minRows, maxRows, propRows]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const handleBlurInternal = () => {
    handleValidation(value);
    onBlur?.();
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={propTheme}>
      {label && (
        <label className={`input-label ${labelClassName} ${required ? "required" : ""}`}>
          {label}
        </label>
      )}

      <div className={`input-container variant-${variant} size-${size} ${disabled ? "disabled" : ""} ${error ? "has-error" : ""}`}>
        <div className="input-inner">
          <textarea
            ref={textareaRef}
            name={name}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlurInternal}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={propRows || minRows}
            className={`input-element textarea-element ${inputClassName}`}
          />
          {loading && <span className="loading-spinner"></span>}
        </div>
      </div>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"} ${error ? errorClassName : helperClassName}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
