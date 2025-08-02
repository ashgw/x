import { TextContent } from "@ashgw/components";

import type { BlockProps } from "../types";
import { CodeBlock } from "~/app/components/pages/[post]/components/code";
import { Divider } from "~/app/components/pages/[post]/components/Divider";
import { H1, H2, H3 } from "~/app/components/pages/[post]/components/headers";
import { BlogLink } from "~/app/components/pages/[post]/components/link/Link";
import {
  Spacer1,
  Spacer2,
  Spacer3,
} from "~/app/components/pages/[post]/components/spacers";

export const HeadingOneWrapper = ({ text }: BlockProps) => <H1>{text}</H1>;

export const HeadingTwoWrapper = ({ text }: BlockProps) => <H2>{text}</H2>;

export const HeadingThreeWrapper = ({ text }: BlockProps) => <H3>{text}</H3>;

export const TextWrapper = ({ text }: BlockProps) => (
  <TextContent>{text}</TextContent>
);

export const CodeWrapper = ({ code, language }: BlockProps) => (
  <CodeBlock
    code={code ?? ""}
    language={language ?? "typescript"}
    showLineNumbers={true}
  />
);

export const DividerWrapper = () => <Divider />;

export const LinkWrapper = ({ text, href }: BlockProps) => (
  <BlogLink href={href ?? "#"}>{text}</BlogLink>
);

export const SmallSpacerWrapper = () => <Spacer1 />;
export const MediumSpacerWrapper = () => <Spacer2 />;
export const LargeSpacerWrapper = () => <Spacer3 />;
