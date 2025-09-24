module.exports = {
  customSyntax: "postcss",
  extends: [
    "stylelint-config-recommended",
    "stylelint-config-standard",
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


