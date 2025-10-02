import express from "express";

export const createGlobalContext = (
  _req: express.Request,
  _res: express.Response,
  _next: express.NextFunction,
): GlobalContext => {
  _next();
  return {
    ctx: {
      db,
      requestedAt: new Date(),
    },
  };
};

import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import { db } from "@ashgw/db";
import { logger } from "@ashgw/logger";
import type { GlobalContext } from "~/ts-rest/context";

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

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();

const router = s.router(contract, {
  getPokemon: {
    handler: async ({ params: { id } }) => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        status: 200,
        body: { id, name: "Pokemon" },
      };
    },
  },
});

// Mount ts-rest under /v1
const v1Router = express.Router();

createExpressEndpoints(contract, router, v1Router, {
  responseValidation: true,
  jsonQuery: true,
  logInitialization: true,
  globalMiddleware: [
    createGlobalContext,
    (req, _res, next) => {
      req.app.locals.ctx = {
        db,
      };
      next();
    },
  ],
  requestValidationErrorHandler: (err, req, res, next) => {
    res.status(400).json({
      message: "Validation failed",
    });
    next();
  },
});

app.use("/v1", v1Router);

// Simple root handler
app.get("/", (req, res) => {
  logger.info(String(req.app.locals));
  res.send("Hiii 😎🔥🚀✨");
});

app.listen(3000, () => {
  logger.info("Express server running on :3000");
});
