"use client";

import React, { useEffect, useState } from "react";
import { Layout, Typography, Statistic } from "antd";
import { getPanelData } from "@/services/PanelApi";
import { ChartColumn, Gift, Plus, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AdminWelcome: React.FC = () => {
  const [panelData, setPanelData] = useState({
    packageCount: 0,
    newPackageCount: 0,
    downloadCount: 0,
    userCount: 0,
  });

  function loadData() {
    getPanelData().then((res) => {
      setPanelData(res);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Content style={{ padding: "50px" }}>
      <div
        className="site-layout-content"
        style={{
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Title level={3} style={{ marginBottom: "24px" }}>
          欢迎来到管理中心
        </Title>
        <Paragraph style={{ fontSize: "16px", marginBottom: "32px" }}>
          在这里，您可以轻松发布、更新和管理您的NuGet包。我们为您提供全面的工具和统计数据，助力您的项目成功。
        </Paragraph>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Statistic
              title="包个数"
              value={panelData.packageCount}
              prefix={
                <Gift
                  style={{
                    color: "#1890ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              }
              suffix="个包"
              styles={{
                content: {
                  color: "#1890ff",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </div>
          <div>
            <Statistic
              title="新建包"
              value={panelData.newPackageCount}
              prefix={
                <Plus
                  style={{
                    color: "#52c41a",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              }
              suffix="个本周"
              styles={{
                content: {
                  color: "#52c41a",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </div>
          <div>
            <Statistic
              title="下载统计"
              value={panelData.downloadCount}
              prefix={
                <ChartColumn
                  style={{
                    color: "#faad14",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              }
              styles={{
                content: {
                  color: "#faad14",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </div>
          <div>
            <Statistic
              title="活跃用户"
              value={panelData.userCount}
              prefix={
                <UserRound
                  style={{
                    color: "#eb2f96",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              }
              styles={{
                content: {
                  color: "#eb2f96",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </div>
        </div>
      </div>
    </Content>
  );
};

export default AdminWelcome;
