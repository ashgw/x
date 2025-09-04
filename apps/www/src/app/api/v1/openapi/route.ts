import { NextResponse } from "next/server";
import { generateOpenApi } from "@ts-rest/open-api";
import { v1Contract } from "~/api/contract";
import { env } from "@ashgw/env";

export function GET() {
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
}
