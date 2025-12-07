"use client";

import { Button } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Welcome = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <>
      <div
        className="flex flex-col items-center justify-center py-20 px-4 gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(22,119,255,0.08), rgba(0,0,0,0.04))",
          border: "1px solid rgba(0,0,0,0.05)",
          minHeight: "540px",
        }}
      >
        <div className="text-4xl font-semibold">使用NuGet Next 更快创建 .NET 程序。</div>

        <div
          className="flex rounded-lg "
          style={{
            width: 500,
            backgroundColor: "#fff",
          }}
        >
          <Input
            className="rounded-s-lg rounded-e-none h-12  md:text-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索包..."
          />
          <Button
            className="rounded-e-lg rounded-s-none h-12 flex items-center justify-center"
            onClick={() => {
              const query = new URLSearchParams();
              query.set("q", encodeURIComponent(search));
              router.push(`/packages?${query}`);
            }}
            type="text"
          >
            <Search />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Welcome;
