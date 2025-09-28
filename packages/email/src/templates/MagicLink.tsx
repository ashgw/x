import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";
import Button from "../components/Button";
const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  small: { color: "#666", fontSize: "12px" },
} as const;

export interface MagicLinkProps {
  readonly magicUrl: string;
  readonly userName?: string;
}

export default function MagicLinkTemplate({
  magicUrl,
  userName,
}: MagicLinkProps) {
  return (
    <Layout title="Your sign in link" previewText="Secure sign in link">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} use this link to sign in:
        </Text>
        <p style={{ margin: "16px 0" }}>
          <Button href={magicUrl}>Sign In</Button>
        </p>
        <Text style={styles.small}>{magicUrl}</Text>
      </Section>
    </Layout>
  );
}
