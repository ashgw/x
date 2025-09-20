import Link from "next/link";
import { motion } from "framer-motion";
import { User } from "lucide-react";

import { Button } from "@ashgw/ui";

export function ProfileButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <Button variant="squared:outline" size="icon" className="h-9 w-9" asChild>
        <Link href="/profile">
          <User className="h-4 w-4" />
          <span className="sr-only">Go to profile</span>
        </Link>
      </Button>
    </motion.div>
  );
}
