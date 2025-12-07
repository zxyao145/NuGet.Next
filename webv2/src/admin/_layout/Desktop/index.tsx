"use client";

import "./index.css";

import { Header } from "@lobehub/ui";
import { Layout, Menu } from "antd";
import { Gauge, Package, User, ChartCandlestick, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, memo, useMemo, useState } from "react";

import Avatar from "./Avatar";
const { Content, Footer, Sider } = Layout;

const DesktopLayout = memo(({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const initialKey = useMemo(() => {
    if (pathname === "/admin") return "dashboard";
    const [, , key] = pathname.split("/");
    return key ?? "dashboard";
  }, [pathname]);

  const [selectedKey, setSelectedKey] = useState(initialKey);

  return (
    <Layout
      className="admin-layout"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Sider
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Menu
          mode="inline"
          activeable={true}
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => {
            if (key === "dashboard") {
              setSelectedKey(key);
              router.push("/admin");
              return;
            } else {
              setSelectedKey(key);
              router.push(`/admin/${key}`);
            }
          }}
          style={{
            background: "var(--background)",
            border: "none",
            height: "100%",
          }}
          items={[
            {
              key: "dashboard",
              icon: <Gauge />,
              label: "控制面板",
            },
            {
              key: "user-management",
              icon: <User />,
              label: "用户管理",
            },
            {
              key: "package-management",
              icon: <Package />,
              label: "包管理",
            },
            {
              key: "common-history",
              icon: <ChartCandlestick />,
              label: "提交记录",
            },
            {
              key: "settings",
              icon: <Settings />,
              label: "系统设置",
            },
          ]}
        />
      </Sider>
      <Layout className="flex flex-1">
        <Header
          actions={
            <>
              <Avatar />
            </>
          }
          style={{ padding: "8px", background: "var(--background)" }}
        />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "var(--background)",
              borderRadius: 12,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©{new Date().getFullYear()} Created by NuGet Next Team
        </Footer>
      </Layout>
    </Layout>
  );
});

DesktopLayout.displayName = "DesktopLayout";

export default DesktopLayout;
