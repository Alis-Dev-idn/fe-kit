import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled && editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Handle value sync from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Handle disabled state sync
  useEffect(() => {
    if (editor) {
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
        {editable && !disabled && (
          <Toolbar editor={editor} config={toolbar} onImageUpload={onImageUpload} />
        )}
        
        <div 
          className="text-editor-content" 
          style={{ minHeight, maxHeight, overflowY: maxHeight ? "auto" : "visible" }}
        >
          <EditorContent editor={editor} />
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
