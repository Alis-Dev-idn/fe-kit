import { BaseInputProps, InputVariant } from "../../types";

export interface TextAreaProps extends BaseInputProps {
  /** Input variant override */
  variant?: InputVariant;
  /** Placeholder text */
  placeholder?: string;

  // Auto resize
  /** Height grows with content, default: true */
  autoResize?: boolean;
  /** Minimum visible rows, default: 3 */
  minRows?: number;
  /** Maximum rows before scroll, default: 10 */
  maxRows?: number;

  // Custom size override
  /** Fixed rows (disables autoResize) */
  rows?: number;

  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}
