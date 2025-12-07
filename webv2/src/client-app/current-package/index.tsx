"use client";

import { Flexbox } from "react-layout-kit";
import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import Divider from "@lobehub/ui/es/Form/components/FormDivider";
import { useCallback, useEffect, useState } from "react";
import { Tag, Tooltip } from "@lobehub/ui";
import { DeletePackage, PackageList } from "@/services/PackageService";
import { CircleQuestionMark } from "lucide-react";

interface ItemProps {
  id: string;
  version: { version: string };
  description?: string;
  downloads?: number;
  authors?: string[];
  title?: string;
  tags?: string[];
  operation?: unknown;
}

const CurrentPackage = () => {
  const columns: TableProps<ItemProps>["columns"] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (id: string) => {
        return (
          <>
            <span
              onClick={() => {
                window.open(`/packages/${id}`, "_blank");
              }}
              style={{
                // 点击效果
                cursor: "pointer",
                color: "#1890ff",
              }}
            >
              {id}
            </span>
          </>
        );
      },
    },
    {
      title: "当前版本",
      dataIndex: "version",
      key: "version",
      render: (v: { version: string; originalVersion: string }) => {
        return v?.originalVersion;
      },
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      width: 150,
      render: (description: string) => {
        return (
          <Tooltip title={description}>
            <span>{description.slice(0, 20)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "下载量",
      dataIndex: "downloads",
      key: "downloads",
    },
    {
      title: "作者",
      dataIndex: "authors",
      key: "authors",
      render: (authors: string[]) => {
        return authors.map((author) => {
          return <Tag key={author}>{author}</Tag>;
        });
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => {
        return tags.map((tag) => {
          return <Tag key={tag}>{tag}</Tag>;
        });
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: unknown, item: ItemProps) => {
        return (
          <Flexbox horizontal className="gap-2 w-20">
            <Button
              onClick={() => {
                window.open(`/packages/${item.id}`, "_blank");
              }}
              style={{
                marginBottom: "5px",
              }}
            >
              详情
            </Button>
            <Popconfirm
              title="删除包"
              onConfirm={() => {
                removeUser(item.id, item.version.version);
              }}
              description={`确认需要删除${item.id} 包吗?`}
              icon={<CircleQuestionMark size={14} style={{ color: "red" }} />}
            >
              <Button
                danger
                style={{
                  marginBottom: "5px",
                }}
              >
                删除
              </Button>
            </Popconfirm>
          </Flexbox>
        );
      },
    },
  ];

  const [data, setData] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword] = useState("");

  async function removeUser(id: string, version: string) {
    DeletePackage(id, version)
      .then(() => {
        message.success("删除成功");
        loadData();
      })
      .catch(() => {
        message.error("删除失败");
      });
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await PackageList(page, pageSize, [], keyword);
      setData(result.items);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword]);

  useEffect(() => {
    loadData();
  }, [page, pageSize, loadData]);

  return (
    <Flexbox>
      <Flexbox
        horizontal
        style={{
          fontSize: 16,
          fontWeight: "bold",
          padding: 16,
        }}
      >
        <span>包管理</span>
        <span
          style={{
            marginLeft: "auto",
            marginRight: 16,
          }}
        >
          <Button
            onClick={() => {
              loadData();
            }}
            style={{
              marginLeft: 8,
            }}
          >
            查询
          </Button>
        </span>
      </Flexbox>
      <Divider />
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </Flexbox>
  );
};

export default CurrentPackage;
