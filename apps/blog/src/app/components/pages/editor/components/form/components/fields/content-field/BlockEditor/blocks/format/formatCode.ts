// BlockEditor/format/formatCode.ts
// Lightweight, client-side formatters with dynamic imports.
// Supports: typescript, javascript, json, css, html, markdown, yaml, sql

type Supported =
  | "typescript"
  | "javascript"
  | "json"
  | "css"
  | "html"
  | "markdown"
  | "yaml"
  | "sql";

type Plugin =
  | "babel"
  | "estree"
  | "typescript"
  | "postcss"
  | "html"
  | "markdown"
  | "yaml";

const PRETTIER_CONFIG: Record<
  Exclude<Supported, "sql">,
  {
    parser: string;
    plugins: Plugin[];
  }
> = {
  typescript: {
    parser: "typescript",
    plugins: ["babel", "estree", "typescript"],
  },
  javascript: { parser: "babel", plugins: ["babel", "estree"] },
  json: { parser: "json", plugins: ["babel"] },
  css: { parser: "css", plugins: ["postcss"] },
  html: { parser: "html", plugins: ["html"] },
  markdown: { parser: "markdown", plugins: ["markdown"] },
  yaml: { parser: "yaml", plugins: ["yaml"] },
};

function isPrettierLanguage(lang: string): lang is Exclude<Supported, "sql"> {
  return Object.prototype.hasOwnProperty.call(PRETTIER_CONFIG, lang);
}

export function isFormatterAvailable(lang: string): boolean {
  return isPrettierLanguage(lang) || lang === "sql";
}

export async function formatCode(code: string, lang: string): Promise<string> {
  if (!code || code.trim() === "") return code;

  if (isPrettierLanguage(lang)) {
    const prettier = await import("prettier/standalone");
    // Load plugins explicitly to keep bundlers happy
    const plugins = [];
    const config = PRETTIER_CONFIG[lang];

    for (const key of config.plugins) {
      if (key === "babel") {
        const mod = await import("prettier/plugins/babel");
        plugins.push(mod.default);
      } else if (key === "estree") {
        const mod = await import("prettier/plugins/estree");
        plugins.push(mod.default);
      } else if (key === "typescript") {
        const mod = await import("prettier/plugins/typescript");
        plugins.push(mod.default);
      } else if (key === "postcss") {
        const mod = await import("prettier/plugins/postcss");
        plugins.push(mod.default);
      } else if (key === "html") {
        const mod = await import("prettier/plugins/html");
        plugins.push(mod.default);
      } else if (key === "markdown") {
        const mod = await import("prettier/plugins/markdown");
        plugins.push(mod.default);
      } else {
        // yml
        const mod = await import("prettier/plugins/yaml");
        plugins.push(mod.default);
      }
    }

    return prettier.format(code, {
      parser: config.parser,
      plugins,
      printWidth: 100,
      tabWidth: 2,
      singleQuote: true,
      semi: true,
      trailingComma: "all",
    });
  }

  if (lang === "sql") {
    const sql = await import("sql-formatter");
    return sql.format(code, { language: "postgres" });
  }

  throw new Error(`No formatter available for ${lang}`);
}
