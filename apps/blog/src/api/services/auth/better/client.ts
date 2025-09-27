import { createAuthClient } from "better-auth/react";
import { env } from "@ashgw/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BLOG_URL,
});
