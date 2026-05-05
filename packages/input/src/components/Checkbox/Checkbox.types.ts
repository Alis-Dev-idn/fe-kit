import { BaseInputProps } from "../../types";

export interface CheckboxProps extends Omit<BaseInputProps, "variant"> {
  /** Checked state */
  checked?: boolean;
  /** Partial selection state (dash icon) */
  indeterminate?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Label position, default: "right" */
  labelPosition?: "right" | "left";
}

export interface CheckboxGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<BaseInputProps, "variant" | "onChange"> {
  /** Options for the group */
  options: CheckboxGroupOption[];
  /** Array of selected values */
  value?: string[];
  /** Change callback with array of selected values */
  onChange?: (selected: string[]) => void;
  /** Layout direction, default: "vertical" */
  direction?: "horizontal" | "vertical";
}
