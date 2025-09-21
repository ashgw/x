import { monitor } from "@ashgw/monitor";

// Initialize Sentry on the server using Next.js auto-loaded server config
monitor.next.initializeServer();
