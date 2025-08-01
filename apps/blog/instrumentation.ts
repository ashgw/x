import { monitor } from "@ashgw/observability";

export const register = monitor.next.initializeServer(); //  the client isn't initialized here as it's not used
export const onRequestError = monitor.next.SentryLib.captureRequestError;
