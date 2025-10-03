import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
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

const s = initServer();

const router = s.router(contract, {
  getPokemon: {
    handler: async ({ params: { id }, req }) => {
      logger.info("received request", {
        ctx: {
          ...req.app.locals.ctx,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        status: 200,
        body: { id, name: "Pokemon" },
      };
    },
  },
});

export const v1RestRouter = Router();

export const createGlobalContext = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
): GlobalContext => {
  _next();
  return {
    ctx: {
      db,
      requestedAt: new Date(),
    },
  };
};

createExpressEndpoints(contract, router, v1RestRouter, {
  responseValidation: true,
  jsonQuery: true,
  logInitialization: true,
  globalMiddleware: [createGlobalContext],
  requestValidationErrorHandler: (err, req, res, next) => {
    res.status(400).json({
      message: "Validation failed",
    });
    next();
  },
});
