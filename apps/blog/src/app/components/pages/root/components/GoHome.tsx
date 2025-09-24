"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

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
    <button
      type="button"
      onClick={handleClick}
      className={`mb-4 ml-5 mt-5 inline-flex items-center hover:text-foreground ${
        pathname === "/" ? "invisible text-dim-400" : ""
      }`}
    >
      <div className="hover:-pl-2 group flex items-center gap-0.5 rounded-full border border-white/10 px-3 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:pr-5 md:scale-125">
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
    </button>
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
