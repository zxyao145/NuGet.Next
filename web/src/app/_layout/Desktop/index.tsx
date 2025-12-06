import { Footer, Layout } from "@lobehub/ui";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import Top from "./Top";
import { GITHUB, mailTo, EMAIL_BUSINESS } from "@/const/url";

const DesktopLayout = memo(() => {
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
      <Outlet />
    </Layout>
  );
});

DesktopLayout.displayName = "DesktopLayout";

export default DesktopLayout;
