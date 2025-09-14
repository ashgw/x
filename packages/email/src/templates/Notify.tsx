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

export const PersonalNotification = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={heading}>Service Notification</Text>
        </Section>
        <Hr style={hr} />
        <Section style={content}>
          <Text style={messageTitle}>{title}</Text>
          <Text style={messageBody}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>© 2025 @ashgw. All rights reserved.</Text>
          <Text style={footerSub}>
            You’re receiving this notification because it was triggered by one
            of my services.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PersonalNotification;

const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#111",
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
  color: "#fff",
  margin: 0,
};

const content = {
  padding: "20px",
  textAlign: "center" as const,
};

const messageTitle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#fff",
  marginBottom: "8px",
};

const messageBody = {
  fontSize: "15px",
  color: "#ccc",
  lineHeight: "1.5",
};

const hr = {
  borderColor: "#333",
  margin: 0,
};

const footer = {
  backgroundColor: "#1a1a1a",
  padding: "16px 20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#888",
  margin: "0 0 4px 0",
};

const footerSub = {
  fontSize: "12px",
  color: "#555",
  margin: 0,
};
