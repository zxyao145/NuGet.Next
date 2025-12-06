import React from "react";
import { Row, Col, Image, Typography, List, Tag } from "antd";
import { DownloadOutlined, FlagOutlined, TagOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface PackageItemProps {
  packageItem: {
    iconUrl: string;
    id: string;
    version: string;
    authors: string[];
    totalDownloads: number;
    tags: string[];
    description: string;
    title?: string;
  };
}

const PackageItem: React.FC<PackageItemProps> = ({ packageItem }) => {
  const navigate = useNavigate();

  return (
    <Row className="search-result" gutter={[16, 16]}>
      <Col xs={0} sm={0} md={1}>
        <Image
          src={packageItem.iconUrl}
          fallback="/images/default-package-icon-256x256.png"
          alt="The package icon"
          className="package-icon"
          preview={false} // 确保图片不可点击
        />
      </Col>
      <Col xs={24} sm={24} md={23}>
        <div>
          <Title level={4}>
            <span
              style={{
                cursor: "pointer",
                color: "#1890ff",
              }}
              onClick={() => {
                navigate(`/packages/${packageItem.id}/${packageItem.version}`);
              }}
              className="package-title"
            >
              {packageItem.id}
            </span>
          </Title>
          <Text>by: {packageItem.authors?.join(" ")}</Text>
        </div>
        <List className="info">
          <List.Item>
            <DownloadOutlined />
            <Text>{packageItem.totalDownloads?.toLocaleString()} total downloads</Text>
          </List.Item>
          <List.Item>
            <FlagOutlined />
            <Text>Latest version: {packageItem.version}</Text>
          </List.Item>
          {packageItem.tags?.length > 0 && (
            <List.Item>
              <TagOutlined />
              {packageItem.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </List.Item>
          )}
        </List>
        <div>
          <Text>{packageItem.description}</Text>
        </div>
      </Col>
    </Row>
  );
};

export default PackageItem;
