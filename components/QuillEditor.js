import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Embed = Quill.import("blots/embed");

class ClickableLinkBlot extends Embed {
  static create(value) {
    const node = super.create();
    node.setAttribute("href", value.url || "#");
    node.setAttribute("onclick", value.onclick || "");
    node.textContent = value.text || "Clickable Link";
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("href"),
      onclick: node.getAttribute("onclick"),
      text: node.textContent,
    };
  }
}

ClickableLinkBlot.blotName = "clickable-link";
ClickableLinkBlot.tagName = "a";
Quill.register(ClickableLinkBlot);

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
  theme = "snow",
}) => {
  const quillRef = useRef(null);
  const quillEditorRef = useRef(null);

  useEffect(() => {
    if (!quillEditorRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: theme,
        placeholder: placeholder,
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
            [{ size: ["small", "normal", "large", "huge"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            ["link"],
            [{ indent: "-1" }, { indent: "+1" }],
            ["clean"],
            ["image", "video"],
          ],
        },
      });

      quillEditorRef.current = quill;

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        onChange(content);
      });
    }

    if (
      quillEditorRef.current &&
      value !== quillEditorRef.current.root.innerHTML
    ) {
      quillEditorRef.current.root.innerHTML = value || "";
    }
  }, [value, onChange, placeholder, theme]);

  return <div ref={quillRef}></div>;
};

export default QuillEditor;
