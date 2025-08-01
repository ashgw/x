"use client";

import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";

import { TextContent } from "@ashgw/components";

import { CodeBlock } from "../code";
import { Divider } from "../Divider";
import { H1, H2, H3 } from "../headers";
import { BlogLink } from "../link/Link";
import { Spacer1, Spacer2, Spacer3 } from "../spacers";

interface MDXProps {
  source: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export function MDX({ source, components }: MDXProps) {
  return (
    <MDXRemote
      {...source}
      components={{
        Code: CodeBlock,
        H: H1,
        H2: H2,
        H3: H3,
        S: Spacer1,
        S2: Spacer2,
        S3: Spacer3,
        C: TextContent,
        L: BlogLink,
        D: Divider,
        ...components,
      }}
    />
  );
}
