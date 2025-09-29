import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";
import Button from "../components/Button";
const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  small: { color: "#666", fontSize: "12px" },
} as const;

export interface ResetPasswordProps {
  readonly resetUrl: string;
  readonly userName?: string;
}

export default function ResetPasswordTemplate({
  resetUrl,
  userName,
}: ResetPasswordProps) {
  return (
    <Layout title="Reset your password" previewText="Password reset request">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} you requested a password reset.
          Click the button to set a new password.
        </Text>
        <p style={{ margin: "16px 0" }}>
          <Button href={resetUrl}>Reset Password</Button>
        </p>
        <Text style={styles.small}>
          If you did not request this, you can ignore this email.
        </Text>
        <Text style={styles.small}>{resetUrl}</Text>
      </Section>
    </Layout>
  );
}
