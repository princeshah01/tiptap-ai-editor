# TipTap Simple Editor

A reusable TipTap-powered editor template packaged with tsup. React is kept as a peer dependency and the bundle ships ESM, CJS, and type definitions for easy consumption.

## Install

Since this is a private repository, you need to install it via git.

### Option 1: SSH (Recommended)

```bash
npm install git+ssh://git@github.com/princeshah01/tiptap-ai-editor.git
# OR for yarn
yarn add git+ssh://git@github.com/princeshah01/tiptap-ai-editor.git
# OR for pnpm
pnpm add git+ssh://git@github.com/princeshah01/tiptap-ai-editor.git
```

### Option 2: HTTPS

```bash
npm install git+https://github.com/princeshah01/tiptap-ai-editor.git
```

## Setup

Import the styles once in your app entry (e.g., `main.tsx`, `App.tsx`, or `layout.tsx`):

```ts
import "tip-tap-source/style.css";
```

## Usage

Here is a complete example showing how to use the `SimpleEditor` for input and `SimpleRenderer` for displaying content.

```tsx
import { useState } from "react";
import { SimpleEditor } from "tip-tap-source";
import { SimpleRenderer } from "tip-tap-source";
import type { JSONContent } from "@tiptap/core";
import "tip-tap-source/style.css"; // Ensure styles are imported

export default function App() {
  const [jsonContent, setJsonContent] = useState<JSONContent | null>(null);

  return (
    <div
      style={{ display: "flex", gap: "2rem", height: "100vh", padding: "2rem" }}
    >
      {/* Editor Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3>Editor</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <SimpleEditor
            aiImproveMaxLength={100}
            onAiImprove={(selectedText) => {
              console.log("AI Improve requested for:", selectedText);
              // Implement your AI call here and return the improved text
              return Promise.resolve(selectedText + " (AI Improved)");
            }}
            onUpdate={({ editor }) => {
              setJsonContent(editor.getJSON());
            }}
          />
        </div>
      </div>

      {/* Renderer/Preview Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3>Preview (Renderer)</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            flex: 1,
            overflow: "auto",
          }}
        >
          {jsonContent ? (
            <SimpleRenderer content={jsonContent} />
          ) : (
            <p style={{ color: "#888" }}>
              Start typing in the editor to see the preview...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Component Props

### `SimpleEditor`

| Prop | Type | Description |
|Data | --- | --- |
| `initialContent` | `JSONContent` \| `string` | Initial content for the editor. |
| `onUpdate` | `(props: { editor: Editor }) => void` | Callback fired when editor content changes. |
| `onAiImprove` | `(text: string) => Promise<string>` | Callback for AI text improvement features. |
| `aiImproveMaxLength` | `number` | Max length for AI improvement input. |
| `className` | `string` | Optional class for the root wrapper. |

### `SimpleRenderer`

| Prop        | Type          | Description                          |
| ----------- | ------------- | ------------------------------------ |
| `content`   | `JSONContent` | The JSON content to render.          |
| `className` | `string`      | Optional class for the root wrapper. |

## Commands

- `npm run dev` – playground with Vite
- `npm run build` – build the library with tsup
- `npm run build:demo` – build the Vite demo shell
- `npm run typecheck` – type-check the source
- `npm run lint` – run ESLint
