"use client";

import type { CSSProperties, ReactNode } from "react";

export const GridShowcase = ({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: "linear-gradient(135deg, rgba(22,119,255,0.08), rgba(0,0,0,0.04))",
      border: "1px solid rgba(0,0,0,0.05)",
      borderRadius: 16,
      display: "grid",
      gap: 16,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);
