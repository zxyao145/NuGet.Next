"use client";

import { Footer, Layout } from "@lobehub/ui";
import { ReactNode, memo } from "react";

import { EMAIL_BUSINESS, GITHUB, mailTo } from "@/const/url";
import Top from "./Top";

const DesktopLayout = memo(({ children }: { children: ReactNode }) => {
  return (
    <Layout
      header={<Top />}
      footer={
        <Footer
          columns={[
            {
              title: "联系我们",
              items: [
                {
                  title: "GitHub",
                  url: GITHUB,
                },
                {
                  title: "邮箱",
                  url: mailTo(EMAIL_BUSINESS),
                },
              ],
            },
            {
              title: "友情链接",
              items: [
                {
                  title: "Raccoon",
                  url: "https://ai-dotnet.com",
                },
                {
                  title: "码界工坊",
                  url: "https://dotnet9.com/",
                },
              ],
            },
            {
              title: "关于我们",
              items: [
                {
                  title: "关于我们",
                  url: "/about",
                  openExternal: false,
                },
                {
                  title: "隐私政策",
                  url: "/privacy",
                  openExternal: false,
                },
              ],
            },
          ]}
        />
      }
    >
      {children}
    </Layout>
  );
});

DesktopLayout.displayName = "DesktopLayout";

export default DesktopLayout;
