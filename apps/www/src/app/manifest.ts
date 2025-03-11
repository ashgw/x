import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "@ashgw",
    short_name: "ashgw",
    description: "AG's personal site",
    start_url: "/",
    display: "standalone",
    background_color: "#21001d",
    theme_color: "#21001d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
