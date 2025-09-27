import { createAuthClient } from "better-auth/client";
import { env } from "@ashgw/env";
import { authEndpoints } from "./consts";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BLOG_URL + authEndpoints.basePath,
});
