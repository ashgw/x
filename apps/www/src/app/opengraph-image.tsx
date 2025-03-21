import { ImageResponse } from "next/og";

export const alt = "@ashgw Website";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #c71585, #800080, #000000)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "5px",
          }}
        >
          A S H G W
        </span>
      </div>
    ),
    {
      ...size,
    },
  );
}
