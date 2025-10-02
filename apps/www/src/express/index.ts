import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  getPokemon: {
    method: "GET",
    path: "/pokemon/:id",
    responses: {
      200: z.object({
        name: z.string(),
      }),
    },
  },
});
