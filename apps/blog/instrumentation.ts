import { monitor } from "@ashgw/monitor";

export const register = monitor.next.initializeServer(); //  the client isn't initialized here as it's not used
export const onRequestError = monitor.next.SentryLib.captureRequestError;
