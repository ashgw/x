/* eslint-disable */ // since react-syntax-highlighter has no types
// @ts-nocheck
"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import docker from "react-syntax-highlighter/dist/cjs/languages/prism/docker";
import gherkin from "react-syntax-highlighter/dist/cjs/languages/prism/gherkin";
import go from "react-syntax-highlighter/dist/cjs/languages/prism/go";
import http from "react-syntax-highlighter/dist/cjs/languages/prism/http";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust";
import sass from "react-syntax-highlighter/dist/cjs/languages/prism/sass";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";

import { cn, Skeleton } from "@ashgw/ui";

import { CopyButton } from "./CopyCode";

SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("docker", docker);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("http", http);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("sass", sass);
SyntaxHighlighter.registerLanguage("gherkin", gherkin);

export interface CodeBlockProps {
  language: string;
  code: string;
  id?: string;
  showLineNumbers?: boolean;
  className?: string;
  copy?: boolean;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers,
  className,
  id,
  copy = true,
}: CodeBlockProps) {
  return (
    <Suspense fallback={<Skeleton />}>
      <motion.div
        id={id}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className={cn(
          "relative mx-2 my-2 rounded-2xl !bg-black p-4 shadow-lg",
          className,
        )}
      >
        {copy ? (
          <CopyButton
            code={code}
            className="absolute right-2 top-2 inline-flex items-center"
          />
        ) : null}
        <SyntaxHighlighter
          className="!m-0 overflow-auto !p-0 text-sm dark:!bg-black dark:[&>*]:!bg-black"
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            width: "3.25em",
            position: "sticky",
            left: 0,
            background: "black",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </motion.div>
    </Suspense>
  );
}
