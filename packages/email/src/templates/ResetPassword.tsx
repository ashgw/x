import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";

export default function ResetPasswordTemplate({
  resetUrl,
  userName,
}: {
  resetUrl: string;
  userName?: string;
}) {
  return (
    <Layout title="Reset your password">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} you requested a password reset.
          Click the link to set a new password.
        </Text>
        <p style={styles.ctaWrap}>
          <a href={resetUrl} style={styles.btn}>
            Reset Password
          </a>
        </p>
        <Text style={styles.p}>
          If you did not request this, you can ignore this email.
        </Text>
        <Text style={styles.link}>{resetUrl}</Text>
      </Section>
    </Layout>
  );
}

const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  link: { color: "#58a6ff", wordBreak: "break-all" as const, fontSize: "13px" },
  btn: {
    display: "inline-block",
    padding: "10px 16px",
    backgroundColor: "#111827",
    color: "#ffffff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
  },
  ctaWrap: { margin: "16px 0" },
};
