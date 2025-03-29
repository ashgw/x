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
      className="dimmed-4 hover:text-foreground mb-4 ml-5 mt-5 inline-flex items-center"
    >
      <div className="hover:-pl-2 group flex items-center gap-0.5 rounded-full border border-white/10 px-3 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:pr-5 md:scale-125">
        <ChevronLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:brightness-125"
          strokeWidth={1.1}
        />
        <ChevronLeft
          className="-ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:brightness-125"
          strokeWidth={1.2}
        />
        <ChevronLeft
          className="-ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-3 group-hover:brightness-125"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
}

function GoHomeSkeleton() {
  return (
    <div className="inline-flex animate-pulse items-center">
      <div className="bg-muted h-8 w-20 rounded-full" />
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
