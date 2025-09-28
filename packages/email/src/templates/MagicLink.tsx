import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";

export default function MagicLinkTemplate({
  magicUrl,
  userName,
}: {
  magicUrl: string;
  userName?: string;
}) {
  return (
    <Layout title="Your sign in link">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} use this link to sign in:
        </Text>
        <p style={styles.ctaWrap}>
          <a href={magicUrl} style={styles.btn}>
            Sign In
          </a>
        </p>
        <Text style={styles.link}>{magicUrl}</Text>
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
