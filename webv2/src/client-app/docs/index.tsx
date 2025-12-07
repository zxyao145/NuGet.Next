"use client";

import Menu from "@/components/Menu";
import { useUserStore } from "@/store/user";
import { Markdown } from "@lobehub/ui";
import { memo, useEffect, useMemo, useState } from "react";

import { Flexbox } from "react-layout-kit";
import "./index.scss";

const DocsPage = memo(() => {
  const [menu, setMenu] = useState("quick-start");
  const theme = useUserStore((s) => s.theme);
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(`/docs/${menu}.md`)
      .then((v) => v.text())
      .then((v) => {
        setContent(v);
      });
  }, [menu]);

  const currentTheme = useMemo(() => {
    if (theme === "auto") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  return (
    <>
      <Flexbox horizontal>
        <div
          style={{
            width: 300,
            minWidth: 300,
            maxWidth: 300,
            height: "100vh",
            paddingTop: 10,
            backgroundColor: currentTheme === "dark" ? "#1f1f1f" : "#fff",
            borderRight: currentTheme === "dark" ? "1px solid #333" : "1px solid #ddd",
          }}
        >
          <Menu
            key={menu}
            selectedKeys={[menu]}
            onClick={(v) => {
              setMenu(v.key);
            }}
            items={[
              {
                label: "快速开始",
                key: "quick-start",
              },
              {
                label: "关于我们",
                key: "about",
              },
              {
                label: "隐私政策",
                key: "privacy",
              },
            ]}
          />
        </div>
        <div
          style={{
            padding: 20,
            overflow: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          <Markdown allowHtml={true} lineHeight={1.8}>
            {content}
          </Markdown>
        </div>
      </Flexbox>
    </>
  );
});

DocsPage.displayName = "DocsPage";

export default DocsPage;
