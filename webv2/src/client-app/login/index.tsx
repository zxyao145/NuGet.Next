"use client";

import { memo, useState } from "react";
import { message, Input, Button } from "antd";
import { GridShowcase } from "@lobehub/ui/awesome";
import { useRouter } from "next/navigation";
import { Authenticate } from "@/services/AuthenticationService";
import { useUserStore } from "@/store/user";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = memo(() => {
  const router = useRouter();

  const openLogin = useUserStore((state) => state.openLogin);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);
      const result = await Authenticate({
        username: username,
        password: password,
      });
      if (result.success) {
        message.success({
          content: "即将跳转到首页",
        });
        setTimeout(() => {
          openLogin(result.token);
          router.push("/");
        }, 500);
      } else {
        message.error(result.message);
      }
    } catch (e: unknown) {
      console.error("login failed", e);
    }
    setLoading(false);
  }

  return (
    <>
      <GridShowcase>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              width: "380px",
              marginBottom: "20px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  display: "block",
                }}
              >
                NuGet Next 登录
              </span>
            </div>
            <div style={{ marginBottom: "20px", width: "100%" }}>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="large"
                placeholder="请输入账号"
              />
            </div>
            <div style={{ width: "100%" }}></div>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              placeholder="请输入密码"
              onPressEnter={async () => {
                await handleLogin();
              }}
              iconRender={(visible) =>
                visible ? (
                  <Eye size={16} color="#80b5ff" style={{ cursor: "pointer" }} />
                ) : (
                  <EyeOff size={16} color="#999" style={{ cursor: "pointer" }} />
                )
              }
            />
          </div>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "380px",
              marginTop: "20px",
            }}
          >
            <Button
              loading={loading}
              onClick={async () => {
                await handleLogin();
              }}
              size="large"
              type="primary"
              block
            >
              登录
            </Button>
          </div>
        </div>
      </GridShowcase>
    </>
  );
});

LoginPage.displayName = "LoginPage";

export default LoginPage;
