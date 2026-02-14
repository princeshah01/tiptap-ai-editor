import { useState } from "react";
import "./App.css";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import { SimpleRenderer } from "./components/tiptap-templates/simple/simple-renderer";
import type { JSONContent } from "@tiptap/core";

function App() {
  const [jsonContent, setJsonContent] = useState<JSONContent | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <SimpleEditor
          aiImproveMaxLength={100}
          onAiImprove={(selectedText) => {
            console.log("AI Improve requested for:", selectedText);
          }}
          onUpdate={({ editor }) => {
            setJsonContent(editor.getJSON());
            console.log("JSON Content:", editor.getJSON());
          }}
        />
      </div>

      {/* Renderer Preview */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderLeft: "1px solid #e0e0e0",
          padding: "2rem",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#888",
          }}
        >
          Preview (Rendered Output)
        </h3>
        {jsonContent ? (
          <SimpleRenderer content={jsonContent} />
        ) : (
          <p style={{ color: "#aaa", fontFamily: "Inter, sans-serif" }}>
            Start typing in the editor to see the preview...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
