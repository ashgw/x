/*
  @see https://cwe.mitre.org/data/definitions/78 why sawn
*/

import { spawn } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

type Dictionary = Record<string, string>;
interface PackageJson {
  name: string;
  scripts: Dictionary;
  dependencies: Dictionary;
  devDependencies: Dictionary;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("init", {
    description: "Generate a new package for the ashgw Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@ashgw/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Enter a space separated list of dependencies you would like to install",
      },
    ],
    actions: [
      (answers) => {
        if ("name" in answers && typeof answers.name === "string") {
          if (answers.name.startsWith("@/")) {
            answers.name = answers.name.replace("@ashgw/", "");
          }
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/eslint.config.js",
        templateFile: "templates/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{ name }}/package.json",
        async transform(content, answers) {
          if ("deps" in answers && typeof answers.deps === "string") {
            const pkg = JSON.parse(content) as PackageJson;
            for (const dep of answers.deps.split(" ").filter(Boolean)) {
              const version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);
              if (!pkg.dependencies) pkg.dependencies = {};
              pkg.dependencies[dep] = `^${version}`;
            }
            return JSON.stringify(pkg, null, 2);
          }
          return content;
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        if ("name" in answers && typeof answers.name === "string") {
          // execSync("pnpm dlx sherif@latest --fix", {
          //   stdio: "inherit",
          // });
          const pnpmInstall = spawn("pnpm", ["i"], { stdio: "inherit" });
          pnpmInstall.on("error", (error) => {
            console.error(`Failed to execute pnpm install: ${error.message}`);
          });

          const pnpmPrettier = spawn(
            "pnpm",
            [
              "prettier",
              "--write",
              `packages/${answers.name}/**`,
              "--list-different",
            ],
            { stdio: "inherit" },
          );
          pnpmPrettier.on("error", (error) => {
            console.error(`Failed to execute pnpm prettier: ${error.message}`);
          });

          return "Package scaffolded";
        }
        return "Package not scaffolded";
      },
    ],
  });
}
