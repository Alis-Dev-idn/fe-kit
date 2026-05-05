import { BaseInputProps, InputVariant } from "../../types";
import React from "react";

export type TextInputType =
  | "text" | "password" | "email" | "number"
  | "tel" | "url" | "search" | "date"
  | "time" | "datetime-local";

export interface TextInputProps extends BaseInputProps {
  /** Input type, default: "text" */
  type?: TextInputType;
  /** Input variant override */
  variant?: InputVariant;
  /** Placeholder text */
  placeholder?: string;

  // Prefix & Suffix
  /** React node inside left of input */
  prefix?: React.ReactNode;
  /** React node inside right of input */
  suffix?: React.ReactNode;
  /** Text prefix (e.g. "Rp", "+62") */
  prefixText?: string;
  /** Text suffix (e.g. ".com", "kg") */
  suffixText?: string;

  // Number stepper
  /** Show +/- buttons, only for type="number" */
  stepper?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;

  // Copy to clipboard
  /** Show copy button (useful for readOnly fields) */
  copyable?: boolean;
  /** Callback after copy */
  onCopy?: () => void;

  // State
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
