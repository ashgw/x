import type { Config } from "tailwindcss";
import { designContent } from "./content";
import { designPreset } from "./preset";

export const config = {
  content: [...designContent],
  presets: [designPreset],
} satisfies Config;
