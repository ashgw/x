import { db } from "@ashgw/db";

export const seed = async () => {
  await db.post.create({
    data: {},
  });
};
