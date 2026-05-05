import { BaseInputProps } from "../../types";

export interface SwitchProps extends Omit<BaseInputProps, "variant"> {
  /** Checked state */
  checked?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Label position, default: "right" */
  labelPosition?: "right" | "left";
  /** Override active color (CSS var) */
  activeColor?: string;
  /** Override inactive color (CSS var) */
  inactiveColor?: string;
}

export interface SwitchGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
  /** Subtitle below label */
  description?: string;
}

export interface SwitchGroupProps extends Omit<BaseInputProps, "variant" | "onChange"> {
  /** Options for the group */
  options: SwitchGroupOption[];
  /** Array of active values */
  value?: string[];
  /** Change callback with array of active values */
  onChange?: (active: string[]) => void;
  /** Layout direction, default: "vertical" */
  direction?: "horizontal" | "vertical";
}
