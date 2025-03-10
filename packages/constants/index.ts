import { env } from "@ashgw/env";

import { getSiteName } from "./utils";

export const BUSINESS_CONTENT_PATH = "/public/services";
export const EMAIL = "contact@ashgw.me";

export const SITE_NAME =
  getSiteName({
    url: env.NEXT_PUBLIC_WWW_URL,
  }) ?? "";

export const REPO_SOURCE = "https://github.com/ashgw/ashgw.me";
export const CREATOR = "Ashref Gwader";
export const BOOKING_LINK = "https://cal.com/ashgw/30min";
