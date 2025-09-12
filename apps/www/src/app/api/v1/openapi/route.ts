import { NextResponse } from "next/server";
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "~/api/contract";
import { endPoint } from "~/ts-rest/endpoint";
import { env } from "@ashgw/env";

export const runtime = "edge";

export const revalidate = 3600;

// TODO: add more docs
export function GET() {
  const doc = generateOpenApi(contract, {
    info: {
      title: "www API v1",
      version: "1.0.0",
      description: "REST",
    },
    openapi: "3.0.3",
    servers: [{ url: new URL(endPoint, env.NEXT_PUBLIC_WWW_URL).toString() }],
  });
  return NextResponse.json(doc, { status: 200 });
}
