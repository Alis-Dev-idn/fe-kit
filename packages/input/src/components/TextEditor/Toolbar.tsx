import React from "react";
import { Editor } from "@tiptap/react";
import { TextEditorToolbarConfig } from "./TextEditor.types";

interface ToolbarProps {
  editor: Editor | null;
  config?: TextEditorToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, config, onImageUpload }) => {
  if (!editor) return null;

  const show = (key: keyof TextEditorToolbarConfig) => config?.[key] !== false;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.[0]) {
        const file = input.files[0];
        if (onImageUpload) {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            editor.chain().focus().setImage({ src: reader.result as string }).run();
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  return (
    <div className="text-editor-toolbar">
      {show("bold") && (
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive("bold") ? "is-active" : ""}`}
        >
          <b>B</b>
        </button>
      )}
      {show("italic") && (
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive("italic") ? "is-active" : ""}`}
        >
          <i>I</i>
        </button>
      )}
      {show("underline") && (
        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive("underline") ? "is-active" : ""}`}
        >
          <u>U</u>
        </button>
      )}
      {show("strike") && (
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbar-btn ${editor.isActive("strike") ? "is-active" : ""}`}
        >
          <s>S</s>
        </button>
      )}
      
      <div className="toolbar-separator" style={{ width: "1px", background: "var(--input-border)", margin: "0 0.5rem" }} />

      {show("heading") && (
        <>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`toolbar-btn ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`}
          >
            H1
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`toolbar-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
          >
            H2
          </button>
        </>
      )}

      <div className="toolbar-separator" style={{ width: "1px", background: "var(--input-border)", margin: "0 0.5rem" }} />

      {show("bulletList") && (
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
        >
          • List
        </button>
      )}
      {show("orderedList") && (
        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
        >
          1. List
        </button>
      )}

      {show("image") && (
        <button onClick={addImage} className="toolbar-btn">
          🖼️
        </button>
      )}

      {show("undo") && (
        <button onClick={() => editor.chain().focus().undo().run()} className="toolbar-btn">
          ↩️
        </button>
      )}
      {show("redo") && (
        <button onClick={() => editor.chain().focus().redo().run()} className="toolbar-btn">
          ↪️
        </button>
      )}
    </div>
  );
};
