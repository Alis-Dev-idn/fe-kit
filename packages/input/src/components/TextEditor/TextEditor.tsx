import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextEditorProps } from "./TextEditor.types";
import { Toolbar } from "./Toolbar";

export const TextEditor: React.FC<TextEditorProps> = ({
  label,
  helperText,
  error,
  required,
  disabled,
  className = "",
  labelClassName = "",
  theme,
  value,
  onChange,
  toolbar,
  placeholder = "Start writing...",
  minHeight = "200px",
  maxHeight,
  editable = true,
  onImageUpload,
}) => {
  // Fix #4 — simpan onChange di ref agar tidak stale di dalam useEditor closure
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,       // Fix #1 — wajib ada
      TableCell,      // Fix #1 — wajib ada
      TableHeader,    // Fix #1 — wajib ada
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? "",  // Fix #2 — fallback string kosong
    editable: !disabled && editable,
    onUpdate: ({ editor }) => {
      onChangeRef.current?.(editor.getHTML()); // Fix #4 — pakai ref
    },
  });

  // Fix #3 — tambahkan isDestroyed check
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (value === undefined) return;
    const currentHTML = editor.getHTML();
    if (currentHTML === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!disabled && editable);
    }
  }, [disabled, editable, editor]);

  return (
    <div className={`input-wrapper ${className}`} data-theme={theme}>
      {label && (
        <label className={`input-label ${labelClassName} ${required ? "required" : ""}`}>
          {label}
        </label>
      )}

      <div className={`text-editor-container ${disabled ? "disabled" : ""} ${error ? "has-error" : ""}`}>
        {editor && editable && !disabled && (
          <Toolbar editor={editor} config={toolbar} onImageUpload={onImageUpload} />
        )}

        <div
          className="text-editor-content"
          style={{ minHeight, maxHeight, overflowY: maxHeight ? "auto" : "visible" }}
        >
          {editor
            ? <EditorContent editor={editor} />
            : <div className="p-4 text-text-3 text-sm">Initializing editor...</div>
          }
        </div>
      </div>

      {(error || helperText) && (
        <p className={`input-message ${error ? "error" : "helper"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};