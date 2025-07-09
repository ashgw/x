// no need for an env check here to check if browser or server, since
// we're not using Posthog integration with the broswer rn, it's defined tho

import { init } from "./init";

export const initializeServer = () => {
  init({
    runtime: "server",
  });
};

export const initializeClient = () => {
  init({
    runtime: "browser",
  });
};
