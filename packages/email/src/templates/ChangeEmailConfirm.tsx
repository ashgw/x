import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";

export default function ChangeEmailConfirmTemplate({
  confirmUrl,
}: {
  confirmUrl: string;
}) {
  return (
    <Layout title="Confirm email change">
      <Section>
        <Text style={styles.p}>Confirm your email change by clicking below.</Text>
        <p style={styles.ctaWrap}>
          <a href={confirmUrl} style={styles.btn}>Confirm Email Change</a>
        </p>
        <Text style={styles.link}>{confirmUrl}</Text>
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
