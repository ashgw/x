import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";
import type { NotificationType } from "../types";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const NotificationTemplate = ({
  title,
  message,
  type,
}: {
  title: string;
  message: string;
  type: NotificationType;
}) => (
  <Html>
    <Head />
    <Body
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#0d1117", // GitHub-like dark
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
        style={{ backgroundColor: "#0d1117" }}
      >
        <tr>
          <td align="center">
            <Container style={container}>
              <Section style={header}>
                <Text style={heading}>
                  {typeof type === "string"
                    ? capitalize(type.toLowerCase())
                    : "Notification"}
                </Text>
              </Section>
              <Hr style={hr} />
              <Section style={content}>
                <Text style={messageTitle}>{title}</Text>
                <Text style={messageBody}>{message}</Text>
              </Section>
              <Hr style={hr} />
              <Section style={footer}>
                <Text style={footerText}>
                  © 2025 @ashgw. All rights reserved.
                </Text>
                <Text style={footerSub}>
                  You’re receiving this notification because it was triggered by
                  one of my services.
                </Text>
              </Section>
            </Container>
          </td>
        </tr>
      </table>
    </Body>
  </Html>
);

export default NotificationTemplate;

const container = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#111111",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#1a1a1a",
  padding: "20px",
  textAlign: "center" as const,
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: 0,
};

const content = {
  padding: "20px",
  textAlign: "center" as const,
};

const messageTitle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#ffffff",
  marginBottom: "8px",
};

const messageBody = {
  fontSize: "15px",
  color: "#cccccc",
  lineHeight: "1.5",
};

const hr = {
  borderColor: "#333333",
  margin: 0,
};

const footer = {
  backgroundColor: "#1a1a1a",
  padding: "16px 20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#888888",
  margin: "0 0 4px 0",
};

const footerSub = {
  fontSize: "12px",
  color: "#555555",
  margin: 0,
};
