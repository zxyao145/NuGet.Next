"use client";

import type { ReactNode } from "react";

import DesktopLayout from "@/client-app/_layout/Desktop";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <DesktopLayout>{children}</DesktopLayout>;
}
