"use client";

import { Empty, List, Pagination } from "antd";
import { memo, useCallback, useEffect, useState } from "react";

import { Flexbox } from "react-layout-kit";
import PackageItem from "./PackageItem";
import { Search } from "@/services/SearchService";
import { useQuery } from "@/hooks/useQuery";
import { Spinner } from "@/components/ui/spinner";

const PackageList = memo(() => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(1);
  const [take, setTake] = useState(10);
  const query = useQuery();

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      // 计算分页skip, take
      const page = (skip - 1) * take;
      const pageSize = take;

      const result = await Search(
        query.q,
        page,
        pageSize,
        query.prerelease,
        null,
        query.packageType,
        query.packageType,
      );
      setPackages(result.data);
      setTotal(result.totalHits);
    } finally {
      setLoading(false);
    }
  }, [query.q, query.prerelease, query.packageType, skip, take]);

  useEffect(() => {
    loadPackages();
  }, [query.q, query.prerelease, query.packageType, skip, loadPackages]);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-fit gap-2 p-2 rounded-md bg-gray-50 shadow flex items-center text-xl">
          <Spinner className="size-6" /> Loading...
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <Flexbox
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 20,
        }}
      >
        <Empty description="没有找到相关包" />
      </Flexbox>
    );
  }

  return (
    <>
      <List
        style={{
          height: "100%",
          width: "100%",
        }}
        dataSource={packages}
        loading={loading}
        renderItem={(item: PackageItem) => <PackageItem key={item.id} packageItem={item} />}
      />
      <Pagination
        showTitle
        showTotal={(total, range) => `${range[0]}-${range[1]} of 总数：${total}`}
        defaultCurrent={1}
        onChange={(page, pageSize) => {
          setSkip(page);
          setTake(pageSize);
        }}
        total={total}
      />
    </>
  );
});

PackageList.displayName = "Packages";

export default PackageList;
