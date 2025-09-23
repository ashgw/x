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
  );
}
