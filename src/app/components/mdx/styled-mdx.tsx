import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Link } from '@/app/components/reusables/link';
import { MDXImage } from './mdx-image';
import { Divider } from '@/app/components/reusables/divider';
import CodeBlock from '@/app/components/reusables/code/code-block';
import {
  Heading2,
  Heading3,
  Heading1,
} from '@/app/components/reusables/headers';
import { Spacer1, Spacer2, Spacer3 } from '@/app/components/reusables/spacers';
import { TextContent } from '@/app/components/reusables/content';
import {
  YeetMe,
  FramerMotionFadeInComponent,
} from '@/app/components/blog-mentions/framer-motion';
import CrossedOff from '../reusables/crossed-off';
import { ThreeTrafficLightsMovingObjects } from '@/app/components/blog-mentions/gsap';

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{
        Code: CodeBlock,
        Image: MDXImage,
        H: Heading1,
        H2: Heading2,
        H3: Heading3,
        S: Spacer1,
        S2: Spacer2,
        S3: Spacer3,
        C: TextContent,
        L: Link,
        D: Divider,
        Crossed: CrossedOff,
        ...featuredComponents,
      }}
    ></_StyledMDX>
  );
}
function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}

const featuredComponents = {
  FramerMotionFadeInComponent: FramerMotionFadeInComponent,
  YeetMe: YeetMe,
  TTLMO: ThreeTrafficLightsMovingObjects,
};
