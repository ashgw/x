import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  getPokemon: {
    method: "GET",
    path: "/pokemon/:id",
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        name: z.string(),
      }),
    },
  },
});
