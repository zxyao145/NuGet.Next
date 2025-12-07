"use client";

import type { CSSProperties, ReactNode } from "react";

export const LogoFlat = ({
  children,
  onClick,
  size = 32,
  style,
}: {
  children?: ReactNode;
  onClick?: () => void;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    onClick={onClick}
    style={{
      alignItems: "center",
      cursor: onClick ? "pointer" : "default",
      display: "inline-flex",
      gap: 8,
      ...style,
    }}
  >
    <span
      style={{
        alignItems: "center",
        background: "#111",
        borderRadius: 8,
        color: "#fff",
        display: "inline-flex",
        fontSize: size / 2,
        fontWeight: 700,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      N
    </span>
    {children && <span style={{ fontWeight: 700 }}>{children}</span>}
  </div>
);
