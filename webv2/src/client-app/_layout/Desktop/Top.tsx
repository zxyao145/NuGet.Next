"use client";

import { Header, ThemeSwitch, Tabs } from "@lobehub/ui";
import { LogoFlat } from "@lobehub/ui/brand";
import { memo, useMemo } from "react";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { useActiveTabKey } from "@/hooks/useActiveTabKey";
import { useUserStore } from "@/store/user";
import { Flexbox } from "react-layout-kit";

const Top = memo(() => {
  const router = useRouter();
  const activeTabKey = useActiveTabKey();
  const [isSignedIn, theme, setTheme] = useUserStore((s) => [s.isSignedIn, s.theme, s.setTheme]);

  const tabs = useMemo(() => {
    const base = [
      {
        key: "packages",
        order: 1,
        label: "包",
      },
      {
        key: "docs",
        order: 5,
        label: "文档",
      },
    ];

    if (!isSignedIn) return base;

    const authed = [
      {
        key: "upload",
        label: "上传",
        order: 2,
      },
      {
        key: "key-manager",
        label: "密钥管理",
        order: 3,
      },
      {
        key: "current-package",
        label: "包管理",
        order: 4,
      },
    ];

    return [...base, ...authed];
  }, [isSignedIn]);

  return (
    <Header
      logo={
        <LogoFlat
          size={32}
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            router.push("/");
          }}
        >
          NuGet Next
        </LogoFlat>
      }
      title=""
      nav={
        <>
          <Tabs
            activeKey={activeTabKey}
            onChange={(key: string) => {
              router.push("/" + key);
            }}
            items={tabs.sort((a, b) => a.order - b.order)}
          />
        </>
      }
      actions={
        <>
          <Flexbox horizontal className="item-center">
            <ThemeSwitch
              style={{
                marginRight: 16,
              }}
              onThemeSwitch={setTheme}
              themeMode={theme}
            />
            <Avatar />
          </Flexbox>
        </>
      }
    ></Header>
  );
});

Top.displayName = "Header";

export default Top;
