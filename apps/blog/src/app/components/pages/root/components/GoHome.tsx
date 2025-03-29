"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { env } from "@ashgw/env";

function GoHomeContent() {
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  return (
    <Link
      href={isRootPath ? env.NEXT_PUBLIC_WWW_URL : "/"}
      className="dimmed-4 hover:text-foreground highlight-underline mb-4 ml-5 mt-5 inline-flex items-center gap-2 transition-colors"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <ChevronLeft
        style={{
          width: "1.5rem",
          height: "1.5rem",
          strokeWidth: 2,
          transition: "transform 0.3s ease",
        }}
        className="chevron-icon"
      />
      <span className="font-bold">{isRootPath ? "Back Home" : "Back"}</span>
    </Link>
  );
}

function GoHomeSkeleton() {
  return (
    <div className="inline-flex animate-pulse items-center gap-2">
      <div className="bg-muted h-4 w-4 rounded-full" />
      <div className="bg-muted h-4 w-20 rounded" />
    </div>
  );
}

export function GoBackHome() {
  return (
    <div className="container pt-6">
      <Suspense fallback={<GoHomeSkeleton />}>
        <GoHomeContent />
      </Suspense>
    </div>
  );
}
