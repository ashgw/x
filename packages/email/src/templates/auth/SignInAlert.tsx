import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./../Layout";
const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  small: { color: "#666", fontSize: "12px" },
} as const;

export interface SignInAlertProps {
  readonly userName?: string;
  readonly ip?: string;
  readonly ua?: string;
  readonly time?: string;
}

export default function SignInAlertTemplate({
  userName,
  ip,
  ua,
  time,
}: SignInAlertProps) {
  return (
    <Layout title="New sign in" previewText="New sign in detected">
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} a new sign in was detected.
        </Text>
        <Text style={styles.p}>
          <strong>Time:</strong> {time ?? "Unknown"}
        </Text>
        <Text style={styles.p}>
          <strong>IP:</strong> {ip ?? "Unknown"}
        </Text>
        <Text style={styles.p}>
          <strong>Agent:</strong> {ua ?? "Unknown"}
        </Text>
        <Text style={styles.small}>
          If this was not you, change your password.
        </Text>
      </Section>
    </Layout>
  );
}
