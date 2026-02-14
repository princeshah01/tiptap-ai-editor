import { generateHTML, type JSONContent } from "@tiptap/core";

// --- Tiptap Core Extensions (same set as SimpleEditor) ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";

// --- Custom Nodes ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ParagraphSpacing } from "@/components/tiptap-node/paragraph-spacing/paragraph-spacing-extension";

// --- Node Styles (bundled by the build tool) ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "./simple-renderer.scss";

/**
 * Extensions used for HTML generation.
 * Mirrors the SimpleEditor extension set (minus editor-only ones like Selection, ImageUploadNode).
 */
const rendererExtensions = [
  StarterKit.configure({
    horizontalRule: false,
    paragraph: false,
    link: {
      openOnClick: true,
    },
  }),
  ParagraphSpacing,
  HorizontalRule,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image,
  Typography,
  Superscript,
  Subscript,
];

/**
 * Convert tiptap JSON content to an HTML string.
 * Can be called from any context (server, API route, build script, etc.).
 *
 * @example
 * ```ts
 * import { generateRendererHTML } from "./simple-renderer";
 * const html = generateRendererHTML(jsonContent);
 * ```
 */
export function generateRendererHTML(content: JSONContent): string {
  return generateHTML(content, rendererExtensions);
}

// ─── React Component (works as Server Component — no hooks, no "use client") ───

export type SimpleRendererProps = {
  /**
   * Tiptap JSON content to render.
   * Pass the output of `editor.getJSON()`.
   */
  content: JSONContent;
  /**
   * Optional className applied to the root wrapper.
   */
  className?: string;
  /**
   * Optional inline styles for the root wrapper.
   */
  style?: React.CSSProperties;
};

/**
 * Read-only renderer for tiptap editor content.
 * Works as a React **Server Component** — no client-side hooks or state.
 *
 * Accepts JSON from `editor.getJSON()` and renders it as styled HTML,
 * using the same extensions and styles as `SimpleEditor`.
 *
 * @example
 * ```tsx
 * // In a Next.js Server Component (no "use client" needed)
 * import { SimpleRenderer } from "@/components/tiptap-templates/simple/simple-renderer";
 *
 * export default async function QuestionPage({ json }) {
 *   return <SimpleRenderer content={json} />;
 * }
 * ```
 */
export function SimpleRenderer({
  content,
  className,
  style,
}: SimpleRendererProps) {
  let html = "";
  try {
    html = generateRendererHTML(content);
  } catch (e) {
    console.error("SimpleRenderer: failed to generate HTML", e);
  }

  return (
    <div
      className={
        "simple-renderer tiptap ProseMirror " +
        (className ? " " + className : "")
      }
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default SimpleRenderer;
