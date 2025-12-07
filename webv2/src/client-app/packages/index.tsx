"use client";

import { useQuery } from "@/hooks/useQuery";
import { Input } from "@lobehub/ui";
import { Suspense, memo, useEffect, useState } from "react";
import { Button } from "antd";
import { Flexbox } from "react-layout-kit";
import { useRouter } from "next/navigation";
import PackageList from "./features/PackageList";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const frameworks = [
  {
    label: "Any",
    title: "Any",
    value: "Any",
  },
  {
    label: ".NET",
    title: ".NET",
    options: [
      {
        label: ".NET 5",
        title: ".NET 5",
        value: "net5.0",
      },
      {
        label: ".NET 6",
        title: ".NET 6",
        value: "net6.0",
      },
      {
        label: ".NET 7",
        title: ".NET 7",
        value: "net7.0",
      },
      {
        label: ".NET 8",
        title: ".NET 8",
        value: "net8.0",
      },
      {
        label: ".NET 9",
        title: ".NET 9",
        value: "net9.0",
      },
      {
        label: ".NET 10",
        title: ".NET 10",
        value: "net10.0",
      },
    ],
  },
  {
    label: ".NET Standard",
    title: ".NET Standard",
    options: [
      {
        label: ".NET Standard 2.1",
        value: "netstandard2.1",
      },
      {
        label: ".NET Standard 2.0",
        value: "netstandard2.0",
      },
      {
        label: ".NET Standard 1.6",
        value: "netstandard1.6",
      },
      {
        label: ".NET Standard 1.5",
        value: "netstandard1.5",
      },
      {
        label: ".NET Standard 1.4",
        value: "netstandard1.4",
      },
      {
        label: ".NET Standard 1.3",
        value: "netstandard1.3",
      },
      {
        label: ".NET Standard 1.2",
        value: "netstandard1.2",
      },
      {
        label: ".NET Standard 1.1",
        value: "netstandard1.1",
      },
      {
        label: ".NET Standard 1.0",
        value: "netstandard1.0",
      },
    ],
  },
  {
    label: ".NET Core",
    title: ".NET Core",
    options: [
      {
        label: ".NET Core 3.1",
        value: "netcoreapp3.1",
      },
      {
        label: ".NET Core 3.0",
        value: "netcoreapp3.0",
      },
      {
        label: ".NET Core 2.2",
        value: "netcoreapp2.2",
      },
      {
        label: ".NET Core 2.1",
        value: "netcoreapp2.1",
      },
      {
        label: ".NET Core 2.0",
        value: "netcoreapp2.0",
      },
      {
        label: ".NET Core 1.1",
        value: "netcoreapp1.1",
      },
      {
        label: ".NET Core 1.0",
        value: "netcoreapp1.0",
      },
    ],
  },
  {
    label: ".NET Framework",
    title: ".NET Framework",
    options: [
      {
        label: ".NET Framework 4.8",
        value: "net48",
      },
      {
        label: ".NET Framework 4.7.2",
        value: "net472",
      },
      {
        label: ".NET Framework 4.7.1",
        value: "net471",
      },
      {
        label: ".NET Framework 4.7",
        value: "net47",
      },
      {
        label: ".NET Framework 4.6.2",
        value: "net462",
      },
      {
        label: ".NET Framework 4.6.1",
        value: "net461",
      },
      {
        label: ".NET Framework 4.6",
        value: "net46",
      },
      {
        label: ".NET Framework 4.5.2",
        value: "net452",
      },
      {
        label: ".NET Framework 4.5.1",
        value: "net451",
      },
      {
        label: ".NET Framework 4.5",
        value: "net45",
      },
      {
        label: ".NET Framework 4.0",
        value: "net40",
      },
      {
        label: ".NET Framework 3.5",
        value: "net35",
      },
      {
        label: ".NET Framework 3.0",
        value: "net30",
      },
      {
        label: ".NET Framework 2.0",
        value: "net20",
      },
    ],
  },
];

const PackagesContent = memo(() => {
  const query = useQuery();
  const router = useRouter();
  const [search, setSearch] = useState(query.q ?? "");
  const [packageType, setPackageType] = useState(query.packageType ?? "Any");
  const [framework, setFramework] = useState(query.framework ?? "Any");
  const [prerelease, setPrerelease] = useState(query.prerelease);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) {
      params.set("q", search);
    }
    if (packageType && packageType != "Any") {
      params.set("packageType", packageType);
    }
    if (prerelease === true) {
      params.set("prerelease", "true");
    } else if (prerelease === false) {
      params.set("prerelease", "false");
    }
    if (framework && framework != "Any") {
      params.set("framework", framework);
    }
    router.push("/packages?" + params.toString());
  }, [search, packageType, framework, prerelease, router]);

  return (
    <Flexbox padding="20px" gap={2}>
      <div>
        <Input
          className="py-0 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suffix={<Button type="text">🔍</Button>}
          placeholder="搜索包..."
        />
      </div>
      <Flexbox horizontal className="gap-2 mt-4">
        <div className="flex flex-row justify-center items-center">
          <span
            style={{
              marginRight: 8,
              textAlign: "center",
              fontSize: 18,
              marginTop: 5,
            }}
          >
            包类型:
          </span>
          <Select
            value={packageType}
            onValueChange={(v) => {
              setPackageType(v as string);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Package type: " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="dependency">Dependency</SelectItem>
                <SelectItem value="dotnettool">.NET Tool</SelectItem>
                <SelectItem value="dotnettemplate">Template</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row justify-center items-center">
          <span
            style={{
              marginRight: 8,
              textAlign: "center",
              fontSize: 18,
              marginLeft: 8,
              marginTop: 5,
            }}
          >
            框架类型:
          </span>
          <Select
            value={framework}
            onValueChange={(v) => {
              setFramework(v as string);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Framework: " />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) =>
                framework.options ? (
                  <SelectGroup key={framework.label}>
                    <SelectLabel>{framework.title}</SelectLabel>
                    {framework.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  <SelectGroup key={framework.label}>
                    <SelectLabel>{framework.title}</SelectLabel>
                    <SelectItem value={framework.label}>{framework.value}</SelectItem>
                  </SelectGroup>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-1"
          onClick={() => {
            setPrerelease(!prerelease);
          }}
        >
          <Checkbox
            id="prerelease"
            checked={prerelease}
            onCheckedChange={(e) => {
              const checked = !!e;
              setPrerelease(checked);
            }}
          ></Checkbox>
          <Label htmlFor="prerelease">包含预发行</Label>
          {/* <div
            style={{
              marginRight: 8,
              textAlign: "center",
              float: "right",
              fontSize: 18,
              marginLeft: 8,
              marginTop: 5,
              cursor: "pointer",
            }}
          >
            
          </div> */}
        </div>
      </Flexbox>
      <PackageList />
    </Flexbox>
  );
});

PackagesContent.displayName = "PackagesContent";

const Packages = () => (
  <Suspense fallback={<Spinner />}>
    <PackagesContent />
  </Suspense>
);

export default Packages;
