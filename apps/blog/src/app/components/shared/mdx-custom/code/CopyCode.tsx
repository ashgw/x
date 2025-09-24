"use client";

import type { FC } from "react";
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "react-use";

import { cn } from "@ashgw/ui";

interface CopyButtonProps {
  code: string;
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ code, className }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  return (
    <button
      className={cn(
        "transition-200 hover:average-translate glowsup rounded-xl border-2 border-[#191919] p-2 px-3 py-2 hover:border-[#340929]",
        className,
      )}
      onClick={() => {
        copyToClipboard(code);
      }}
    >
      <AnimatedCopyButton />
    </button>
  );
};

const AnimatedCopyButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied((prev) => !prev);

    setTimeout(() => {
      setCopied((prev) => !prev);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-200 ${copied ? "scale-0" : "scale-100"}`}
    >
      {copied ? <Check color="#4ade80" /> : <Copy />}
    </button>
  );
};
