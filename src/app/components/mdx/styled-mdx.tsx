import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { Navbar } from '@/app/components/reusables/nav';
import { highlight } from 'sugar-high';

export const Code: React.FC<{
  children: string;
}> = ({ children, ...props }) => {
  return (
    <code
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
      {...props}
    />
  );
};

function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{ Code: Code, Nav: Navbar }}
    ></_StyledMDX>
  );
}
