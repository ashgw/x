import { createAuthClient } from "better-auth/client";
import { env } from "@ashgw/env";
import { authEndpoints } from "./consts";

// TODO: remove this &    remove the endpoint too
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BLOG_URL + authEndpoints.basePath,
});
