import { env } from "@ashgw/env";
import { email } from "./index";
import { logger } from "@ashgw/logger";

async function main(): Promise<void> {
  await email.sendVerifyEmail({
    to: env.PERSONAL_EMAIL,
    verifyUrl: `${env.NEXT_PUBLIC_BLOG_URL}/verify?token=example`,
    userName: "AG",
  });
  logger.info("Sent verify email");
}

void main();
