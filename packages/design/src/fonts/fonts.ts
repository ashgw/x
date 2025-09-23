import localFont from "next/font/local";

const atkinsonHyperlegible = localFont({
  src: [
    {
      path: "./AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./AtkinsonHyperlegible/AtkinsonHyperlegible-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./AtkinsonHyperlegible/AtkinsonHyperlegible-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-atkinson-hyperlegible",
  display: "swap", // Enable font swapping for better performance
});

export const fonts = {
  atkinsonHyperlegible,
} as const;
