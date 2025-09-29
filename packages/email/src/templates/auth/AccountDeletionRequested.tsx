import * as React from "react";
import { Section, Text } from "@react-email/components";
import Layout from "./../Layout";
import Button from "../../components/Button";

const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  link: { color: "#58a6ff", fontSize: "13px", wordBreak: "break-all" as const },
  row: { margin: "16px 0" },
  sep: { height: "8px" },
} as const;

export interface AccountDeletionRequestedProps {
  readonly userName?: string;
  readonly confirmUrl: string;
  readonly cancelUrl: string;
}

export default function AccountDeletionRequestedTemplate({
  userName,
  confirmUrl,
  cancelUrl,
}: AccountDeletionRequestedProps) {
  return (
    <Layout
      title="Confirm account deletion"
      previewText="Confirm or cancel deletion"
    >
      <Section>
        <Text style={styles.p}>
          {userName ? `Hi ${userName},` : "Hi,"} you requested to delete your
          account. This will permanently remove your data.
        </Text>
        <div style={styles.row}>
          <Button href={confirmUrl}>Confirm Deletion</Button>
        </div>
        <div style={styles.sep} />
        <div style={styles.row}>
          <Button href={cancelUrl}>Cancel Request</Button>
        </div>
        <Text style={styles.link}>{confirmUrl}</Text>
        <Text style={styles.link}>{cancelUrl}</Text>
      </Section>
    </Layout>
  );
}
