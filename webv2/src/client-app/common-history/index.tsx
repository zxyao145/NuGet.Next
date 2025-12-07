"use client";

import { PackageUpdateRecord } from "@/services/PackageUpdateRecordService";
import { PackageUpdateRecordResponse } from "@/types/package";
import { Avatar, Tooltip } from "@lobehub/ui";
import Divider from "@lobehub/ui/es/Form/components/FormDivider";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";

export const CommonHistory = () => {
  const columns: TableProps<PackageUpdateRecordResponse>["columns"] = [
    {
      title: "包Id",
      dataIndex: "packageId",
      key: "packageId",
    },
    {
      title: "version",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "操作类型",
      dataIndex: "operationType",
      key: "operationType",
    },
    {
      title: "IP",
      dataIndex: "operationIP",
      key: "operationIP",
    },
    {
      title: "操作人",
      dataIndex: "user",
      key: "user",
      render: (user) => {
        return (
          <>
            <Tooltip title={user.email}>
              <Avatar src={user.avatar} />
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "操作时间",
      dataIndex: "operationTime",
      key: "operationTime",
    },
  ];
  const [data, setData] = useState<PackageUpdateRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await PackageUpdateRecord(page, pageSize);
      setData(result.items);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadData();
  }, [page, pageSize, loadData]);

  return (
    <>
      <Flexbox
        style={{
          fontSize: 16,
          fontWeight: "bold",
          padding: 16,
        }}
      >
        <span>提交记录</span>
      </Flexbox>
      <Divider />
      <Table<PackageUpdateRecordResponse>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          total: total,
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </>
  );
};

export default CommonHistory;
