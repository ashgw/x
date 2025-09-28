import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";

export default function SignInAlertTemplate({
  userName,
  ip,
  ua,
  time,
}: {
  userName?: string;
  ip?: string;
  ua?: string;
  time?: string; // ISO or human string
}) {
  return (
    <Layout title="New sign in">
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
        <Text style={styles.p}>If this was not you, change your password.</Text>
      </Section>
    </Layout>
  );
}

const styles = { p: { color: "#333", fontSize: "15px", lineHeight: "1.5" } };
