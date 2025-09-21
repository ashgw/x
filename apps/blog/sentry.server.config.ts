import { monitor } from "@ashgw/monitor";

// Server-side Sentry init for the blog app. Loaded at boot by Next.
monitor.next.initializeServer();
