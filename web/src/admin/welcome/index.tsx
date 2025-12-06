import React, { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, Card, Statistic } from "antd";
import { GiftTwoTone, PlusOutlined, BarChartOutlined, UserOutlined } from "@ant-design/icons";
import { getPanelData } from "@/services/PanelApi";

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
        style={{ padding: "24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <Title level={3} style={{ marginBottom: "24px" }}>
          欢迎来到管理中心
        </Title>
        <Paragraph style={{ fontSize: "16px", marginBottom: "32px" }}>
          在这里，您可以轻松发布、更新和管理您的NuGet包。我们为您提供全面的工具和统计数据，助力您的项目成功。
        </Paragraph>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ borderRadius: "8px", height: "100%" }}>
              <Statistic
                title="包管理"
                value={panelData.packageCount}
                prefix={<GiftTwoTone style={{ color: "#1890ff" }} />}
                suffix="个包"
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ borderRadius: "8px", height: "100%" }}>
              <Statistic
                title="新建包"
                value={panelData.newPackageCount}
                prefix={<PlusOutlined style={{ color: "#52c41a" }} />}
                suffix="个本周"
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ borderRadius: "8px", height: "100%" }}>
              <Statistic
                title="下载统计"
                value={panelData.downloadCount}
                prefix={<BarChartOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ borderRadius: "8px", height: "100%" }}>
              <Statistic
                title="活跃用户"
                value={panelData.userCount}
                prefix={<UserOutlined style={{ color: "#eb2f96" }} />}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default AdminWelcome;
