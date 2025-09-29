import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./../Layout";

const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  small: { color: "#666", fontSize: "12px" },
} as const;

export interface AccountDeletedProps {
  readonly userName?: string;
  readonly time?: string;
}

export default function AccountDeletedTemplate({
  userName,
  time,
}: AccountDeletedProps) {
  return (
    <Layout title="Account deleted" previewText="Your account has been deleted">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} your account has been deleted
          and your data is no longer available.
        </Text>
        <Text style={styles.small}>{time ? `Time: ${time}` : ""}</Text>
        <Text style={styles.small}>
          If this was not you, contact support immediately.
        </Text>
      </Section>
    </Layout>
  );
}
