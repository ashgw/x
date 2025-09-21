import { monitor } from "@ashgw/monitor";

// Server-side Sentry init for this app. Loaded by Next at startup.
// Avoids calling init in instrumentation to prevent double init.
monitor.next.initializeServer();
