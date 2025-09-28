import * as React from "react";
import { Section } from "@react-email/components";
import Layout from "./Layout";

export interface DigestItem {
  title: string;
  url?: string;
  body?: string;
}

export default function DigestTemplate({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: readonly DigestItem[];
}) {
  return (
    <Layout title={title}>
      <Section>
        {intro ? <p style={styles.p}>{intro}</p> : null}
        <ul style={styles.ul}>
          {items.map((it, i) => (
            <li key={i} style={styles.li}>
              <div style={styles.itemTitle}>
                {it.url ? (
                  <a href={it.url} style={styles.link}>
                    {it.title}
                  </a>
                ) : (
                  it.title
                )}
              </div>
              {it.body ? <div style={styles.body}>{it.body}</div> : null}
            </li>
          ))}
        </ul>
      </Section>
    </Layout>
  );
}

const styles = {
  p: { color: "#333", fontSize: "15px", lineHeight: "1.5" },
  ul: { paddingLeft: "18px", margin: 0 },
  li: { marginBottom: "12px" },
  itemTitle: { fontWeight: 600, marginBottom: "4px" },
  body: { color: "#333", fontSize: "14px", lineHeight: "1.5" },
  link: { color: "#58a6ff", textDecoration: "none" },
} as const;
