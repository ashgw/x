import React from "react";

// Use these components in the CodeBlockEditor

import type { BlockEditorProps } from "../types";

// Add type annotations

const Select = ({
  _value,
  _onValueChange,
  children,
}: {
  _value: string;
  _onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => <div>{children}</div>;

const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
  <button>{children}</button>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span>{placeholder}</span>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const SelectItem = ({
  _value,
  children,
}: {
  _value: string;
  children: React.ReactNode;
}) => <div>{children}</div>;

// Implement Textarea

const Textarea = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className: string;
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
);

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "bash",
  "css",
  "html",
  "json",
  "yaml",
  "markdown",
  "sql",
] as const;

export const CodeBlockEditor = React.memo(function CodeBlockEditor({
  value,
  onChange,
  isPreview,
}: BlockEditorProps) {
  if (isPreview) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Select
        _value={value.language ?? "typescript"}
        _onValueChange={(language) => onChange({ ...value, language })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang} _value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        value={value.code ?? ""}
        onChange={(e) => onChange({ ...value, code: e.target.value })}
        placeholder="Enter code..."
        className="min-h-[200px] w-full font-mono"
      />
    </div>
  );
});
