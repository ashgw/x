import { env } from "@ashgw/env";

const thirdParty = console; // no need for this shit for my personal site

export const log = env.NODE_ENV === "production" ? thirdParty : console;
