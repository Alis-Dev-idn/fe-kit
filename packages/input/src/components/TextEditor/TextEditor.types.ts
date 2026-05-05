import { BaseInputProps } from "../../types";

export interface TextEditorToolbarConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  heading?: boolean | { levels: number[] };
  quote?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
  link?: boolean;
  image?: boolean;
  codeBlock?: boolean;
  table?: boolean;
  align?: boolean;
  undo?: boolean;
  redo?: boolean;
}

export interface TextEditorProps extends Omit<BaseInputProps, "variant" | "type"> {
  /** HTML string value */
  value?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Toolbar configuration */
  toolbar?: TextEditorToolbarConfig;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum height, default: "200px" */
  minHeight?: string;
  /** Maximum height before scrolling */
  maxHeight?: string;
  /** Editable state, default: true */
  editable?: boolean;
  /** Image upload callback */
  onImageUpload?: (file: File) => Promise<string>;
}
