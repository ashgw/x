import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Markdown } from "@react-email/markdown";
import * as React from "react";
import type { NotificationType } from "../types";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const NotificationTemplate = ({
  message,
  type,
}: {
  message: string; // Markdown string
  type: NotificationType;
}) => {
  const typeLabel =
    typeof type === "string"
      ? capitalize(type.toLowerCase()) + " Notification"
      : "Notification";

  return (
    <Html>
      <Head />
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
        }}
      >
        <table
          role="presentation"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ backgroundColor: "#ffffff" }}
        >
          <tr>
            <td align="center">
              <Container style={container}>
                <Section style={header}>
                  <Text style={heading}>{typeLabel}</Text>
                </Section>

                <Hr style={hr} />

                <Section style={content}>
                  <div style={markdownWrap}>
                    <Markdown>{message}</Markdown>
                  </div>
                </Section>

                <Hr style={hr} />

                <Section style={footer}>
                  <Text style={footerText}>
                    © 2025 @ashgw. All rights reserved.
                  </Text>
                  <Text style={footerSub}>
                    You’re receiving this notification because it was triggered
                    by one of my services.
                  </Text>
                </Section>
              </Container>
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
};

export default NotificationTemplate;

const container = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#f5f5f5",
  padding: "20px",
  textAlign: "center" as const,
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#222222",
  margin: 0,
};

const content = {
  padding: "20px",
  textAlign: "left" as const,
};

const markdownWrap = {
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.5",
} as const;

const hr = {
  borderColor: "#dddddd",
  margin: 0,
};

const footer = {
  backgroundColor: "#f5f5f5",
  padding: "16px 20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#666666",
  margin: "0 0 4px 0",
};

const footerSub = {
  fontSize: "12px",
  color: "#999999",
  margin: 0,
};
