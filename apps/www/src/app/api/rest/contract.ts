import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

// Shared simple error body for non-2xx
const errorBody = z.string().min(1);

export const v1Contract = c.router({
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    summary: "Fetch dotfiles bootstrap script (raw text)",
    responses: {
      200: z.string(), // text/plain
      424: errorBody, // upstream failure
      500: errorBody, // internal error
    },
  },

  gpg: {
    method: "GET",
    path: "/gpg",
    summary: "Fetch public PGP key (armored text)",
    responses: {
      200: z.string(), // application/pgp-keys
      424: errorBody,
      500: errorBody,
    },
  },

  debion: {
    method: "GET",
    path: "/debion",
    summary: "Fetch debion file (raw text)",
    responses: {
      200: z.string(), // text/plain
      424: errorBody,
      500: errorBody,
    },
  },
});
