import { Paragraph } from "@tiptap/extension-paragraph";
import type { Editor } from "@tiptap/core";
import type { RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraphSpacing: {
      toggleNoSpacing: () => ReturnType;
      setNoSpacing: () => ReturnType;
      unsetNoSpacing: () => ReturnType;
    };
  }
}

/**
 * Extended Paragraph node that supports a `spacing` attribute.
 * When set to `"no-spacing"`, paragraphs render with zero margins.
 */
export const ParagraphSpacing = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      spacing: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-spacing"),
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.spacing) return {};
          return { "data-spacing": attributes.spacing };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleNoSpacing:
        () =>
        ({ commands, editor }: { commands: any; editor: Editor }) => {
          const { spacing } = editor.getAttributes("paragraph");
          if (spacing === "no-spacing") {
            return commands.updateAttributes("paragraph", { spacing: null });
          }
          commands.setParagraph();
          return commands.updateAttributes("paragraph", {
            spacing: "no-spacing",
          });
        },
      setNoSpacing:
        () =>
        ({ commands }: { commands: any }) => {
          commands.setParagraph();
          return commands.updateAttributes("paragraph", {
            spacing: "no-spacing",
          });
        },
      unsetNoSpacing:
        () =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes("paragraph", { spacing: null });
        },
    } as Partial<RawCommands>;
  },
});

export default ParagraphSpacing;
