import * as react_jsx_runtime from 'react/jsx-runtime';
import { Content, Editor } from '@tiptap/react';
import { JSONContent } from '@tiptap/core';
export { JSONContent } from '@tiptap/core';

declare const MAX_FILE_SIZE: number;
/**
 * Handles image upload with progress tracking and abort capability
 * @param file The file to upload
 * @param onProgress Optional callback for tracking upload progress
 * @param abortSignal Optional AbortSignal for cancelling the upload
 * @returns Promise resolving to the URL of the uploaded image
 */
declare const handleImageUpload: (file: File, onProgress?: (event: {
    progress: number;
}) => void, abortSignal?: AbortSignal) => Promise<string>;

type SimpleEditorStyles = {
    /** Style for the root wrapper div */
    root?: React.CSSProperties;
    /** Style for the toolbar */
    toolbar?: React.CSSProperties;
    /** Style for the content wrapper */
    content?: React.CSSProperties;
    /** Style for the ProseMirror editor area */
    editor?: React.CSSProperties;
};
type SimpleEditorProps = {
    /**
     * Initial content for the editor. Falls back to the bundled demo content when omitted.
     */
    initialContent?: Content;
    /**
     * Optional hook that runs on every editor update.
     */
    onUpdate?: (context: {
        editor: Editor;
    }) => void;
    /**
     * Custom image upload handler. Defaults to an in-browser data URL uploader.
     */
    onImageUpload?: typeof handleImageUpload;
    /**
     * Optional className applied to the root wrapper.
     */
    className?: string;
    /**
     * Antd-style granular inline styles for each sub-element.
     */
    styles?: SimpleEditorStyles;
    /**
     * Callback fired when "Improve with AI" is clicked on selected text.
     * Receives the selected text as a parameter.
     * Omit or set to undefined to hide the floating button entirely.
     */
    onAiImprove?: (selectedText: string) => void;
    /**
     * Maximum number of characters that can be selected for AI improve.
     * When exceeded the floating button won't appear. Omit for no limit.
     */
    aiImproveMaxLength?: number;
};
declare function SimpleEditor({ initialContent, onUpdate, onImageUpload, className, styles: stylesProp, onAiImprove, aiImproveMaxLength, }: SimpleEditorProps): react_jsx_runtime.JSX.Element;

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
declare function generateRendererHTML(content: JSONContent): string;
type SimpleRendererProps = {
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
declare function SimpleRenderer({ content, className, style, }: SimpleRendererProps): react_jsx_runtime.JSX.Element;

declare function ThemeToggle(): react_jsx_runtime.JSX.Element;

export { MAX_FILE_SIZE, SimpleEditor, type SimpleEditorProps, SimpleRenderer, type SimpleRendererProps, ThemeToggle, generateRendererHTML, handleImageUpload };
