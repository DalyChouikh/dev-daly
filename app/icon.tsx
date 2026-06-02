import { ImageResponse } from "next/og";

/**
 * Generates a dynamic favicon icon for the portfolio.
 * Uses the primary green color from the Stardust theme with "D" initial.
 */
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101415",
          borderRadius: "8px",
          border: "1px solid rgba(75, 226, 119, 0.4)",
        }}
      >
        <span
          style={{
            color: "#4be277",
            fontSize: "20px",
            fontWeight: "800",
            fontFamily: "sans-serif",
          }}
        >
          D
        </span>
      </div>
    ),
    {
      ...size,
    },
  );
}