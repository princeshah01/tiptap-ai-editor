"use client";

import { forwardRef, useCallback } from "react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";

export interface NoSpacingButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

function isNoSpacingActive(editor: Editor | null): boolean {
  if (!editor) return false;
  const { spacing } = editor.getAttributes("paragraph");
  return spacing === "no-spacing";
}

/**
 * Toggle button for "No Spacing" paragraph style.
 * Removes top/bottom margins and tightens line-height.
 */
export const NoSpacingButton = forwardRef<
  HTMLButtonElement,
  NoSpacingButtonProps
>(({ editor: providedEditor, onClick, ...props }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const isActive = editor ? isNoSpacingActive(editor) : false;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !editor) return;
      (editor.commands as any).toggleNoSpacing();
    },
    [editor, onClick],
  );

  return (
    <Button
      type="button"
      disabled={!editor}
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      role="button"
      tabIndex={-1}
      aria-label="No Spacing"
      aria-pressed={isActive}
      tooltip="No Spacing"
      onClick={handleClick}
      {...props}
      ref={ref}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tiptap-button-icon"
      >
        {/* Letter P */}
        <path d="M6 4h5a4 4 0 0 1 0 8H6V4z" />
        <path d="M6 12v8" />
        {/* Tight spacing lines */}
        <line x1="17" y1="14" x2="22" y2="14" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="20" x2="22" y2="20" />
      </svg>
    </Button>
  );
});

NoSpacingButton.displayName = "NoSpacingButton";

export default NoSpacingButton;
