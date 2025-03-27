import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { env } from "@ashgw/env";

export const GoBackHome = () => {
  return (
    <div className="container pt-6">
      <Link
        href={env.NEXT_PUBLIC_WWW_URL}
        className="text-muted-foreground hover:text-foreground highlight-underline mb-9 ml-2 inline-flex items-center gap-2 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 font-bold" />
        <span className="font-bold">Back to Home</span>
      </Link>
    </div>
  );
};
