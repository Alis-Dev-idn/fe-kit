import { useCallback } from "react";
import { UseFormResult } from "../types";

export interface UseFieldArrayResult<T> {
  fields: T[];
  append: (value: T) => void;
  prepend: (value: T) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
  update: (index: number, value: T) => void;
  replace: (values: T[]) => void;
}

export function useFieldArray<T, K extends keyof T>(
  form: UseFormResult<T>,
  field: K
): UseFieldArrayResult<T[K] extends Array<infer U> ? U : never> {
  type Item = T[K] extends Array<infer U> ? U : never;

  const fields = (form.values[field] as unknown as Item[]) || [];

  const updateForm = useCallback((newFields: Item[]) => {
    form.setValue(field, newFields as any);
  }, [form, field]);

  const append = (value: Item) => {
    updateForm([...fields, value]);
  };

  const prepend = (value: Item) => {
    updateForm([value, ...fields]);
  };

  const remove = (index: number) => {
    updateForm(fields.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    const next = [...fields];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateForm(next);
  };

  const swap = (indexA: number, indexB: number) => {
    const next = [...fields];
    [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
    updateForm(next);
  };

  const update = (index: number, value: Item) => {
    const next = [...fields];
    next[index] = value;
    updateForm(next);
  };

  const replace = (values: Item[]) => {
    updateForm(values);
  };

  return {
    fields,
    append,
    prepend,
    remove,
    move,
    swap,
    update,
    replace,
  };
}
