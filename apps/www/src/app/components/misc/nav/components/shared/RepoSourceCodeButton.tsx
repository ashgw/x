import NextLink from "next/link";
import { GitBranch } from "lucide-react";

import { repo_source } from "@ashgw/constants";
import { Button } from "@ashgw/ui";

export function RepoSourceCodeButton() {
  return (
    <Button variant={"outline"}>
      <NextLink href={repo_source} target="_blank" rel="noopener noreferrer">
        <GitBranch
          strokeWidth={"1.5px"}
          size={"20px"}
          style={{
            display: "inline-block",
            marginLeft: "5px",
            marginBottom: "3px",
          }}
        />
      </NextLink>{" "}
    </Button>
  );
}
