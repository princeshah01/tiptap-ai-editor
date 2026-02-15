"use client";

import { useEffect, useRef, useState } from "react";
import {
  EditorContent,
  EditorContext,
  useEditor,
  type Content,
  type Editor,
} from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ParagraphSpacing } from "@/components/tiptap-node/paragraph-spacing/paragraph-spacing-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { NoSpacingButton } from "@/components/tiptap-ui/no-spacing-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

// --- Lib ---
import {
  cn,
  handleImageUpload as defaultHandleImageUpload,
  MAX_FILE_SIZE,
} from "@/lib/tiptap-utils";

// --- Styles ---
import "@/styles/_keyframe-animations.scss";
import "@/styles/_variables.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

export type SimpleEditorStyles = {
  /** Style for the root wrapper div */
  root?: React.CSSProperties;
  /** Style for the toolbar */
  toolbar?: React.CSSProperties;
  /** Style for the content wrapper */
  content?: React.CSSProperties;
  /** Style for the ProseMirror editor area */
  editor?: React.CSSProperties;
};

export type SimpleEditorProps = {
  /**
   * Initial content for the editor. Falls back to the bundled demo content when omitted.
   */
  initialContent?: Content;
  /**
   * Optional hook that runs on every editor update.
   */
  onUpdate?: (context: { editor: Editor }) => void;
  /**
   * Custom image upload handler. Defaults to an in-browser data URL uploader.
   */
  onImageUpload?: typeof defaultHandleImageUpload;
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

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <NoSpacingButton />
        <HeadingDropdownMenu portal={isMobile} />
        <ListDropdownMenu portal={isMobile} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export function SimpleEditor({
  initialContent,
  onUpdate,
  onImageUpload,
  className,
  styles: stylesProp,
  onAiImprove,
  aiImproveMaxLength,
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main",
  );
  const toolbarRef = useRef<HTMLDivElement>(null);
  const uploadImage = onImageUpload ?? defaultHandleImageUpload;

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        paragraph: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
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
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadImage,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent,
    onUpdate: onUpdate
      ? ({ editor }) => {
          onUpdate({ editor });
        }
      : undefined,
  });

  useEffect(() => {
    if (!editor || initialContent === undefined) return;
    editor.commands.setContent(initialContent, { emitUpdate: false });
  }, [editor, initialContent]);

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  useEffect(() => {
    if (!editor || !stylesProp?.editor) return;
    const el = editor.view.dom as HTMLElement;
    Object.assign(el.style, stylesProp.editor);
  }, [editor, stylesProp?.editor]);

  return (
    <div
      className={cn("simple-editor-wrapper", className)}
      style={stylesProp?.root}
    >
      <EditorContext.Provider value={{ editor }}>
        <Toolbar ref={toolbarRef} style={stylesProp?.toolbar}>
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
          style={stylesProp?.content}
        />

        {editor && onAiImprove && (
          <AiImproveBubble
            editor={editor}
            onAiImprove={onAiImprove}
            maxLength={aiImproveMaxLength}
          />
        )}
      </EditorContext.Provider>
    </div>
  );
}

/**
 * Floating "Improve with AI" button that appears above selected text.
 */
function AiImproveBubble({
  editor,
  onAiImprove,
  maxLength,
}: {
  editor: Editor;
  onAiImprove: (selectedText: string) => void;
  maxLength?: number;
}) {
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const editorDom = editor.view.dom as HTMLElement;

    const onMouseUp = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    editorDom.addEventListener("mouseup", onMouseUp);
    return () => editorDom.removeEventListener("mouseup", onMouseUp);
  }, [editor]);

  useEffect(() => {
    const updatePosition = () => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");

      if (!selectedText.trim() || from === to) {
        setCoords(null);
        return;
      }

      // Enforce character limit
      if (maxLength && selectedText.length > maxLength) {
        setCoords(null);
        return;
      }

      try {
        const wrapper = editor.view.dom.closest(
          ".simple-editor-wrapper",
        ) as HTMLElement;
        if (!wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const mouse = mouseRef.current;

        // Check if mouse is inside the editor content area
        if (
          mouse &&
          mouse.x >= wrapperRect.left &&
          mouse.x <= wrapperRect.right &&
          mouse.y >= wrapperRect.top &&
          mouse.y <= wrapperRect.bottom
        ) {
          // Position above the mouse cursor
          setCoords({
            top: mouse.y - wrapperRect.top + wrapper.scrollTop - 40,
            left: mouse.x - wrapperRect.left,
          });
        } else {
          // Fallback: position above the first word of the selection
          const startCoords = editor.view.coordsAtPos(from);
          setCoords({
            top: startCoords.top - wrapperRect.top + wrapper.scrollTop - 40,
            left: startCoords.left - wrapperRect.left,
          });
        }
      } catch {
        setCoords(null);
      }
    };

    editor.on("selectionUpdate", updatePosition);
    editor.on("blur", () => setCoords(null));

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("blur", () => setCoords(null));
    };
  }, [editor]);

  if (!coords) return null;

  return (
    <button
      ref={bubbleRef}
      className="ai-improve-bubble-btn"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        transform: "translateX(-50%)",
        zIndex: 50,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, " ");
        if (selectedText.trim()) {
          onAiImprove(selectedText);
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="14px"
        height="14px"
      >
        <radialGradient
          id="oDvWy9qKGfkbPZViUk7TCa"
          cx="-670.437"
          cy="617.13"
          r=".041"
          gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1ba1e3" />
          <stop offset="0" stopColor="#1ba1e3" />
          <stop offset=".3" stopColor="#5489d6" />
          <stop offset=".545" stopColor="#9b72cb" />
          <stop offset=".825" stopColor="#d96570" />
          <stop offset="1" stopColor="#f49c46" />
        </radialGradient>
        <path
          fill="url(#oDvWy9qKGfkbPZViUk7TCa)"
          d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024	c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08	c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258	l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"
        />
        <radialGradient
          id="oDvWy9qKGfkbPZViUk7TCb"
          cx="-670.437"
          cy="617.13"
          r=".041"
          gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1ba1e3" />
          <stop offset="0" stopColor="#1ba1e3" />
          <stop offset=".3" stopColor="#5489d6" />
          <stop offset=".545" stopColor="#9b72cb" />
          <stop offset=".825" stopColor="#d96570" />
          <stop offset="1" stopColor="#f49c46" />
        </radialGradient>
        <path
          fill="url(#oDvWy9qKGfkbPZViUk7TCb)"
          d="M39.21,44.246l-0.494,1.132	c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676	c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0	l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676	C41.677,40.619,40.091,42.227,39.21,44.246z"
        />
      </svg>
      <span>Improve with AI</span>
    </button>
  );
}
