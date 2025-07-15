import { init } from "./init";

export const initializeServer = () => {
  init({
    runtime: "server",
  });
};

// this is not used for now, but we'll keep it here for future reference
export const initializeClient = () => {
  init({
    runtime: "browser",
  });
};
