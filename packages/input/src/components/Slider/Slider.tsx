import React, { useCallback, useRef, useState, useEffect } from "react";
import { SliderProps } from "./Slider.types";

export const Slider: React.FC<SliderProps> = ({
  label,
  helperText,
  error,
  required,
  disabled,
  className = "",
  labelClassName = "",
  theme,
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  range,
  rangeValue = [0, 100],
  onRangeChange,
  showValue,
  showMinMax,
  formatValue = (v) => String(v),
  name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getPercent = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
  };

  const handleRangeChange = (index: 0 | 1, val: number) => {
    const nextRange: [number, number] = [...rangeValue];
    nextRange[index] = val;
    
    // Clamp
    if (index === 0 && nextRange[0] > nextRange[1]) nextRange[0] = nextRange[1];
    if (index === 1 && nextRange[1] < nextRange[0]) nextRange[1] = nextRange[0];
    
    onRangeChange?.(nextRange);
  };

  return (
    <div className={`input-wrapper ${className}`} data-theme={theme}>
      {label && (
        <label className={`input-label ${labelClassName} ${required ? "required" : ""}`}>
          {label}
        </label>
      )}

      <div className={`slider-container ${disabled ? "disabled" : ""}`} ref={containerRef}>
        <div className="slider-track">
          <div 
            className="slider-fill" 
            style={{
              left: `${range ? getPercent(rangeValue[0]) : 0}%`,
              width: `${range ? getPercent(rangeValue[1]) - getPercent(rangeValue[0]) : getPercent(value)}%`
            }}
          />
          
          {!range ? (
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleSingleChange}
              disabled={disabled}
              className="slider-native-input"
              style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 3 }}
            />
          ) : (
            <>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={rangeValue[0]}
                onChange={(e) => handleRangeChange(0, Number(e.target.value))}
                disabled={disabled}
                className="slider-native-input range-0"
                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: rangeValue[0] > max / 2 ? 5 : 4 }}
              />
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={rangeValue[1]}
                onChange={(e) => handleRangeChange(1, Number(e.target.value))}
                disabled={disabled}
                className="slider-native-input range-1"
                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: rangeValue[1] < max / 2 ? 5 : 4 }}
              />
            </>
          )}

          {!range && (
            <div className="slider-thumb" style={{ left: `${getPercent(value)}%` }}>
              {showValue && <span className="slider-value-tooltip">{formatValue(value)}</span>}
            </div>
          )}

          {range && (
            <>
              <div className="slider-thumb" style={{ left: `${getPercent(rangeValue[0])}%` }}>
                {showValue && <span className="slider-value-tooltip">{formatValue(rangeValue[0])}</span>}
              </div>
              <div className="slider-thumb" style={{ left: `${getPercent(rangeValue[1])}%` }}>
                {showValue && <span className="slider-value-tooltip">{formatValue(rangeValue[1])}</span>}
              </div>
            </>
          )}
        </div>
        
        {showMinMax && (
          <div className="slider-minmax" style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--input-helper)" }}>
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
