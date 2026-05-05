import { BaseInputProps } from "../../types";

export interface SliderProps extends Omit<BaseInputProps, "variant"> {
  /** Minimum value, default: 0 */
  min?: number;
  /** Maximum value, default: 100 */
  max?: number;
  /** Step increment, default: 1 */
  step?: number;

  // Single value
  /** Current value for single thumb */
  value?: number;
  /** Change callback for single thumb */
  onChange?: (value: number) => void;

  // Range
  /** Enable range slider (two thumbs) */
  range?: boolean;
  /** Current values for range thumbs */
  rangeValue?: [number, number];
  /** Change callback for range thumbs */
  onRangeChange?: (value: [number, number]) => void;

  // Display
  /** Show current value above thumb */
  showValue?: boolean;
  /** Show min/max labels at ends */
  showMinMax?: boolean;
  /** Show tick marks at step intervals */
  showTicks?: boolean;
  /** Format display value */
  formatValue?: (value: number) => string;
}
