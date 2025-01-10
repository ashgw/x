import nextPlugin from "@next/eslint-plugin-next";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
      "@typescript-eslint/consistent-type-imports": "error",

      // Strict rules for Next.js best practices
      "@next/next/no-img-element": "error", // Force use of next/image
      "@next/next/no-html-link-for-pages": "error", // Force use of next/link
      "@next/next/google-font-display": "error", // Ensure proper font loading
      "@next/next/no-page-custom-font": "error", // Prevent custom fonts in pages
      "@next/next/no-sync-scripts": "error", // Prevent synchronous scripts
      "@next/next/no-unwanted-polyfillio": "error", // Prevent unnecessary polyfills

      // Performance rules
      "@next/next/no-css-tags": "error", // Force CSS imports
      "@next/next/inline-script-id": "error", // Require IDs for inline scripts
      "@next/next/no-head-import-in-document": "error", // Prevent head imports in _document
      "@next/next/no-document-import-in-page": "error", // Prevent document imports in pages

      // Security rules
      "@next/next/no-script-component-in-head": "error", // Prevent Script components in Head
      "@next/next/no-styled-jsx-in-document": "error", // Prevent styled-jsx in _document
      "@next/next/no-title-in-document-head": "error", // Prevent title tags in _document
    },
  },
];
