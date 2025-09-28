import * as React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        padding: "10px 16px",
        backgroundColor: "#111827",
        color: "#ffffff",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      {children}
    </a>
  );
}
