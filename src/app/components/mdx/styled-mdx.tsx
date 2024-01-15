import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

export default function StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
