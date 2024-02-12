// react-syntax-highlighter has no types
/* eslint-disable */
// @ts-nocheck
import { cn } from '@/lib/utils';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import oneDark from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';
import CopyButton from './copy-code';

SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('go', go);

type Props = {
  language: string;
  code: string;
  showLineNumbers?: boolean;
  className?: string;
  copy?: boolean;
};

export default function CodeBlock({
  code,
  language,
  showLineNumbers,
  className,
  copy = true,
}: Props) {
  return (
    <div
      className={cn(
        'mx-2 relative rounded-2xl !bg-black p-4 shadow-lg',
        className
      )}
    >
      {copy && (
        <CopyButton
          code={code}
          className="absolute right-2 top-2 inline-flex items-center"
        />
      )}
      <SyntaxHighlighter
        className="!m-0 overflow-auto !p-0 text-sm dark:!bg-black dark:[&>*]:!bg-black"
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{
          width: '3.25em',
          position: 'sticky',
          left: 0,
          background: 'black',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
