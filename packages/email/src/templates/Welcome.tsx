import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./Layout";
import { siteName } from "@ashgw/constants";

export default function WelcomeTemplate({ userName }: { userName?: string }) {
  return (
    <Layout title={`Welcome to ${siteName}`}>
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} your email is verified. You are
          all set.
        </Text>
        <Text style={styles.p}>Jump back in and enjoy.</Text>
      </Section>
    </Layout>
  );
}

const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
};
