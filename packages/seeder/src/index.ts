import { logger } from "@ashgw/logger";
import { seedPosts } from "./seeds/posts";
import { seedUser } from "./seeds/user";

async function seed() {
  await seedPosts();
  await seedUser();
}

seed().catch((error) => logger.error("Error happned while seeding", error));
