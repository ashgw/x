import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

function slugify(str: string) {
  // ... (your existing slugify function)
}

type CustomMDXProps = MDXRemoteProps & {
  // Additional props specific to your component, if any
};

export default function StyledMDX({ components, ...props }: CustomMDXProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
