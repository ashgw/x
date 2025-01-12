import type { MetadataRoute } from "next";

import { env } from "@ashgw/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: env.NEXT_PUBLIC_WWW_URL + "/sitemap.xml",
    host: env.NEXT_PUBLIC_WWW_URL,
  };
}
