import { NextResponse } from "next/server";
import { generateOpenApi } from "@ts-rest/open-api";
import { v1Contract } from "~/api/contract";
import { env } from "@ashgw/env";
import { logger, monitor } from "@ashgw/observability";

export const runtime = "nodejs";
export const revalidate = 3600;

export function GET() {
  try {
    const doc = generateOpenApi(v1Contract, {
      info: {
        title: "www API v1",
        version: "1.0.0",
        description: "Contract-first REST",
      },
      openapi: "3.0.3",
      servers: [{ url: `${env.NEXT_PUBLIC_WWW_URL}` }],
    });
    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    logger.error("Error generating OpenAPI document", error);
    monitor.next.captureException({ error });
    return NextResponse.json(
      {
        code: "INTERNAL_ERROR",
        details: { route: "/api/v1/openapi" },
        message: "Failed to generate OpenAPI document",
      },
      { status: 500 },
    );
  }
}
