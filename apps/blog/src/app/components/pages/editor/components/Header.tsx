import { Plus } from "lucide-react";

import { Button } from "@ashgw/ui";

export function Header({ onClick }: { onClick: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Blog Editor</h1>
      <Button variant="squared:default" onClick={onClick}>
        <Plus className="mr-2 h-4 w-4" />
        New Blog
      </Button>
    </div>
  );
}
