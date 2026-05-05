export type ValidateOn = "submit" | "change" | "blur";

export interface UseFormOptions<T> {
  initialValues?: Partial<T>;
  validateOn?: ValidateOn;          // default: "submit"
  onSubmit: (values: T) => Promise<unknown>;
  transform?: {
    beforeSubmit?: (values: T) => unknown;
    beforePopulate?: (values: unknown) => Partial<T>;
  };
}

export interface FieldError {
  field: string;
  message: string;
}

export interface UseFormResult<T> {
  values: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  dirtyFields: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: unknown) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: () => Promise<void>;
  setValue: (field: keyof T, value: unknown) => void;
  setError: (field: keyof T, message: string) => void;
  reset: (values?: Partial<T>) => void;
  watch: <K extends keyof T>(field: K | K[]) => any;
  /**
   * Helper to bind input components to form state.
   * Returns: { name, value, onChange, onBlur, error }
   */
  field: <K extends keyof T>(key: K) => {
    name: string;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
  };
}
