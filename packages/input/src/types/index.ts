import { ZodTypeAny } from "zod";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "outline" | "filled" | "underline";
export type InputTheme = "light" | "dark" | "auto";

/**
 * Shared base props for all inputs
 */
export interface BaseInputProps {
  /** Label above input */
  label?: string;
  /** Hint below input */
  helperText?: string;
  /** Error message (overrides helperText) */
  error?: string;
  /** Adds * to label */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Spinner inside input */
  loading?: boolean;
  /** Input size, default: "md" */
  size?: InputSize;
  /** Wrapper className */
  className?: string;
  /** Input element className */
  inputClassName?: string;
  /** Label element className */
  labelClassName?: string;
  /** Error message className */
  errorClassName?: string;
  /** Helper text className */
  helperClassName?: string;
  /** Theme override, default: follows InputKit.setup theme */
  theme?: InputTheme;

  // form-kit integration
  /** Field name for form integration */
  name?: string;
  /** Change callback */
  onChange?: (value: any) => void;
  /** Blur callback */
  onBlur?: () => void;
  /** Current value */
  value?: any;

  // Zod validation
  /** Zod validation schema */
  validation?: ZodTypeAny;
}
