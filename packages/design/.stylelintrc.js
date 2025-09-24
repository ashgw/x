export default {
  extends: [
    "stylelint-config-recommended",
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
  ],
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    // Allow Tailwind at-rules and utilities in CSS
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],

    // Project preferences
    "declaration-block-no-duplicate-custom-properties": true,
    "selector-class-pattern": null,
    "no-descending-specificity": null,
  },
};
