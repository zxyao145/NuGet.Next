import { useUserStore } from "@/store/user";
import { ThemeProvider } from "@lobehub/ui";
import { ReactNode } from "react";

const GlobalLayout = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useUserStore((s) => [s.theme, s.setTheme]);
  return (
    <ThemeProvider
      themeMode={theme}
      onThemeModeChange={(mode) => {
        setTheme(mode);
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export default GlobalLayout;
