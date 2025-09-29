import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./../Layout";
import Button from "../../components/Button";
const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  small: { color: "#666", fontSize: "12px" },
} as const;

export interface VerifyEmailProps {
  readonly verifyUrl: string;
  readonly userName?: string;
}

export default function VerifyEmailTemplate({
  verifyUrl,
  userName,
}: VerifyEmailProps) {
  return (
    <Layout title="Verify your email" previewText="Confirm your address">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} confirm your email to finish
          setting up your account.
        </Text>
        <p style={{ margin: "16px 0" }}>
          <Button href={verifyUrl}>Verify Email</Button>
        </p>
        <Text style={styles.small}>{verifyUrl}</Text>
      </Section>
    </Layout>
  );
}
