import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";

export default function VerifyEmailTemplate({
  verifyUrl,
  userName,
}: {
  verifyUrl: string;
  userName?: string;
}) {
  return (
    <Layout title="Verify your email">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} confirm your email to finish
          setting up your account.
        </Text>
        <p style={styles.ctaWrap}>
          <a href={verifyUrl} style={styles.btn}>
            Verify Email
          </a>
        </p>
        <Text style={styles.p}>
          If the button does not work, copy and paste this link:
        </Text>
        <Text style={styles.link}>{verifyUrl}</Text>
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
