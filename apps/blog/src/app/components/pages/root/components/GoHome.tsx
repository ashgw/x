"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@ashgw/ui";

function GoHomeContent() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const strokeWidth = 2;

  return (
    <div className={`mb-4 ml-5 mt-5 ${pathname === "/" ? "invisible" : ""}`}>
      <Button
        type="button"
        onClick={handleClick}
        variant="glowOutline"
        border="full"
        className="group inline-flex items-center px-3 py-2 transition-all duration-300 md:scale-125"
      >
        <div className="hover:-pl-2 flex items-center gap-0.5 hover:pr-5">
          <ChevronLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:brightness-125"
            strokeWidth={strokeWidth}
          />
          <ChevronLeft
            className="-ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:brightness-125"
            strokeWidth={strokeWidth}
          />
          <ChevronLeft
            className="-ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-3 group-hover:brightness-125"
            strokeWidth={strokeWidth}
          />
        </div>
      </Button>
    </div>
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
    <div className="layout pt-6">
      <Suspense fallback={<GoHomeSkeleton />}>
        <GoHomeContent />
      </Suspense>
    </div>
  );
}
