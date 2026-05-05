import { useState, useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import { UseFormOptions, UseFormResult } from "../types";

export function useForm<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  options: UseFormOptions<z.infer<z.ZodObject<T>>>
): UseFormResult<z.infer<z.ZodObject<T>>> {
  type Values = z.infer<z.ZodObject<T>>;
  
  const [values, setValues] = useState<Partial<Values>>(options.initialValues || {});
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Partial<Record<keyof Values, boolean>>>({});
  
  const initialValuesRef = useRef<Partial<Values>>(options.initialValues || {});

  // Deep equality check for isDirty
  useEffect(() => {
    const dirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
    setIsDirty(dirty);
    
    // Compute dirtyFields
    const nextDirtyFields: any = {};
    Object.keys(values).forEach(key => {
      if (values[key as keyof Values] !== initialValuesRef.current[key as keyof Values]) {
        nextDirtyFields[key] = true;
      }
    });
    setDirtyFields(nextDirtyFields);
  }, [values]);

  const validate = useCallback((currentValues: Partial<Values>) => {
    const result = schema.safeParse(currentValues);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach(err => {
        const path = err.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      return fieldErrors;
    }
    return {};
  }, [schema]);

  const setValue = useCallback((field: keyof Values, value: unknown) => {
    setValues(prev => {
      // Handle nested path logic if needed (e.g. items.0.name)
      if (typeof field === 'string' && field.includes('.')) {
        const parts = field.split('.');
        const next = { ...prev } as any;
        let current = next;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          current[part] = Array.isArray(current[part]) ? [...current[part]] : { ...current[part] };
          current = current[part];
        }
        current[parts[parts.length - 1]] = value;
        return next;
      }
      return { ...prev, [field]: value };
    });

    if (options.validateOn === "change") {
      const nextErrors = validate({ ...values, [field]: value });
      setErrors(nextErrors);
    } else {
      // Clear error on change if not validateOn change
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [values, options.validateOn, validate]);

  const handleChange = useCallback((field: keyof Values, value: unknown) => {
    setValue(field, value);
  }, [setValue]);

  const handleBlur = useCallback((field: keyof Values) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (options.validateOn === "blur") {
      const nextErrors = validate(values);
      setErrors(nextErrors);
    }
  }, [values, options.validateOn, validate]);

  const setError = useCallback((field: keyof Values, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const reset = useCallback((newValues?: Partial<Values>) => {
    const nextValues = newValues || initialValuesRef.current;
    setValues(nextValues);
    if (newValues) initialValuesRef.current = newValues;
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setDirtyFields({});
  }, []);

  const handleSubmit = async () => {
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitValues = options.transform?.beforeSubmit 
        ? options.transform.beforeSubmit(values as Values) 
        : values;
      await options.onSubmit(submitValues as Values);
    } catch (err: any) {
      // Handle ApiError injection
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        err.data.errors.forEach((e: any) => {
          if (e.field) setError(e.field as keyof Values, e.message);
        });
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const watch = useCallback((field: keyof Values | Array<keyof Values>) => {
    if (Array.isArray(field)) {
      return field.map(f => values[f]);
    }
    return values[field];
  }, [values]);

  const isValid = Object.keys(validate(values)).length === 0;

  return {
    values,
    errors,
    touched,
    isDirty,
    dirtyFields,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    field: useCallback((key: keyof Values) => ({
      name: key as string,
      value: values[key],
      onChange: (value: unknown) => handleChange(key, value),
      onBlur: () => handleBlur(key),
      error: errors[key]
    }), [values, errors, handleChange, handleBlur]),
  };
}
