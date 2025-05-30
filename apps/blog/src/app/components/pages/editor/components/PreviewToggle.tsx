import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@ashgw/ui";

interface PreviewToggleProps {
  isPreviewEnabled: boolean;
  onToggle: () => void;
}

export function PreviewToggle({
  isPreviewEnabled,
  onToggle,
}: PreviewToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.2,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <Button variant="squared:outline" onClick={onToggle}>
        {isPreviewEnabled ? (
          <>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Show Preview
          </>
        )}
      </Button>
    </motion.div>
  );
}
