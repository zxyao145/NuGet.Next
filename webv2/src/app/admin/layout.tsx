"use client";

import type { ReactNode } from "react";

import AdminLayout from "@/admin/layout";

export default function Layout({ children }: { children: ReactNode }) {
  const LayoutComponent = AdminLayout;
  return <LayoutComponent>{children}</LayoutComponent>;
}
