import { monitor } from "@ashgw/monitor";

export const onRequestError = monitor.next.SentryLib.captureRequestError;
