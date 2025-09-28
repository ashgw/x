import { env } from "@ashgw/env";
import { EmailSenders } from "./index";
import { logger as Lager } from "@ashgw/logger";

async function main(): Promise<void> {
  await EmailSenders.sendVerifyEmail({
    to: env.PERSONAL_EMAIL,
    verifyUrl: `${env.NEXT_PUBLIC_BLOG_URL}/verify?token=example`,
    userName: "AG",
  });
  Lager.info("Sent verify email");
}

void main();
