import Link from "next/link";
import { User } from "@ashgw/ui/icons";

import { Button } from "@ashgw/design/ui";

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
