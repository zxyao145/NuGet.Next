"use client";

import { ReactNode, useEffect } from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/store/user";

const ThemeSync = () => {
  const themePreference = useUserStore((state) => state.theme);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(themePreference === "auto" ? "system" : themePreference);
  }, [setTheme, themePreference]);

  return null;
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeSync />
      {children}
      <Toaster richColors />
    </NextThemeProvider>
  );
}
