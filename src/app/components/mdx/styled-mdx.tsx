import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';

import { highlight } from 'sugar-high';
import React from 'react';

interface CodeProps {
  children: string;
}
export const Code: React.FC<CodeProps> = ({ children, ...props }) => {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
};

let components = {
  code: Code,
};

export function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
const cc = { Code };

export default function StyledMDX({ source }: { source: string }) {
  return <_StyledMDX source={source} components={cc}></_StyledMDX>;
}
