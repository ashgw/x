import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@ashgw/ui";

export function ProfileButton() {
  return (
    <Button variant="outline">
      <Link href="/profile">
        <User className="h-5 w-5" />
        <span className="sr-only">Go to profile</span>
      </Link>
    </Button>
  );
}
