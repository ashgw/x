import { Code2, Heading1, Heading2, Heading3, Minus, Text } from "lucide-react";

import type { BlockProps, BlockRegistry, BlockType } from "./types";
import {
  CodeWrapper,
  DividerWrapper,
  HeadingOneWrapper,
  HeadingThreeWrapper,
  HeadingTwoWrapper,
  LargeSpacerWrapper,
  LinkWrapper,
  MediumSpacerWrapper,
  SmallSpacerWrapper,
  TextWrapper,
} from "./blocks/BlockWrappers";
import { CodeBlockEditor } from "./blocks/CodeBlock";
import { HeadingBlockEditor } from "./blocks/HeadingBlock";
import { LinkBlockEditor } from "./blocks/LinkBlock";
import { TextBlockEditor } from "./blocks/TextBlock";

export const blockRegistry: BlockRegistry = {
  H1: {
    type: "H1",
    label: "Heading 1",
    icon: <Heading1 className="h-4 w-4" />,
    defaultProps: { text: "" },
    Editor: HeadingBlockEditor,
    Preview: HeadingOneWrapper,
    serialize: ({ text }: BlockProps) => `<H1>${text}</H1>`,
  },
  H2: {
    type: "H2",
    label: "Heading 2",
    icon: <Heading2 className="h-4 w-4" />,
    defaultProps: { text: "" },
    Editor: HeadingBlockEditor,
    Preview: HeadingTwoWrapper,
    serialize: ({ text }: BlockProps) => `<H2>${text}</H2>`,
  },
  H3: {
    type: "H3",
    label: "Heading 3",
    icon: <Heading3 className="h-4 w-4" />,
    defaultProps: { text: "" },
    Editor: HeadingBlockEditor,
    Preview: HeadingThreeWrapper,
    serialize: ({ text }: BlockProps) => `<H3>${text}</H3>`,
  },
  C: {
    type: "C",
    label: "Text",
    icon: <Text className="h-4 w-4" />,
    defaultProps: { text: "" },
    Editor: TextBlockEditor,
    Preview: TextWrapper,
    serialize: ({ text }: BlockProps) => `<C>${text}</C>`,
  },
  Code: {
    type: "Code",
    label: "Code Block",
    icon: <Code2 className="h-4 w-4" />,
    defaultProps: { code: "", language: "typescript" },
    Editor: CodeBlockEditor,
    Preview: CodeWrapper,
    serialize: ({ code, language }: BlockProps) =>
      `<Code code={\`${code}\`} language="${language}" />`,
  },
  D: {
    type: "D",
    label: "Divider",
    icon: <Minus className="h-4 w-4" />,
    defaultProps: {},
    Editor: () => null,
    Preview: DividerWrapper,
    serialize: () => "<D />",
  },
  L: {
    type: "L",
    label: "Link",
    icon: <Text className="h-4 w-4" />,
    defaultProps: { text: "", href: "" },
    Editor: LinkBlockEditor,
    Preview: LinkWrapper,
    serialize: ({ text, href }: BlockProps) => `<L href="${href}">${text}</L>`,
  },
  S: {
    type: "S",
    label: "Small Spacer",
    defaultProps: {},
    Editor: () => null,
    Preview: SmallSpacerWrapper,
    serialize: () => "<S />",
  },
  S2: {
    type: "S2",
    label: "Medium Spacer",
    defaultProps: {},
    Editor: () => null,
    Preview: MediumSpacerWrapper,
    serialize: () => "<S2 />",
  },
  S3: {
    type: "S3",
    label: "Large Spacer",
    defaultProps: {},
    Editor: () => null,
    Preview: LargeSpacerWrapper,
    serialize: () => "<S3 />",
  },
} as const;

export const getBlockByType = (type: BlockType): BlockRegistry[BlockType] => {
  return blockRegistry[type];
};
