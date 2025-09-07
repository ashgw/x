import { NextResponse } from "next/server";
import { generateOpenApi } from "@ts-rest/open-api";
import { v1Contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { env } from "@ashgw/env";

export const runtime = "edge";

export const revalidate = 3600;

export function GET() {
  const doc = generateOpenApi(v1Contract, {
    info: {
      title: "www API v1",
      version: "1.0.0",
      description: "Contract-first REST",
    },
    openapi: "3.0.3",
    servers: [{ url: new URL(endPoint, env.NEXT_PUBLIC_WWW_URL).toString() }],
  });
  return NextResponse.json(doc, { status: 200 });
}
