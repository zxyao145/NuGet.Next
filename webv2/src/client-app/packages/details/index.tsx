"use client";

import { PackageInfo } from "@/services/PackageService";
import { PackageDetailsState } from "@/types/package";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { CloudDownload, Download, FileText, Globe, History, Gift, FolderGit2 } from "lucide-react";

import { Markdown, Snippet, Tag } from "@lobehub/ui";
import { Flexbox } from "react-layout-kit";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./index.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const PackageDetails = () => {
  const params = useParams<{
    id?: string | string[];
    version?: string | string[];
  }>();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const version = Array.isArray(params?.version) ? params?.version[0] : params?.version;
  // const navigate = useNavigate();
  const [detail, setDetail] = useState<PackageDetailsState>();
  const [loading, setLoading] = useState(false);

  const loadingData = useCallback(async () => {
    if (id) {
      try {
        const packages = await PackageInfo(id, version);
        setDetail(packages);
      } finally {
        setLoading(false);
      }
    }
  }, [id, version]);

  useEffect(() => {
    setLoading(true);
    loadingData();
  }, [id, version, loadingData]);

  if (loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin tip="Loading..." />
        </div>
      </>
    );
  }

  if (!detail?.found) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <span className="text-3xl font-semibold">404</span>
          </EmptyMedia>
          <EmptyTitle>抱歉，没有找到包。</EmptyTitle>
          <EmptyDescription>{`找不到包 '${id}'.`}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="w-full">
          <p>
            您可以尝试在{" "}
            <a
              href={`https://www.nuget.org/packages?q=${encodeURIComponent(id ?? "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              nuget.org
            </a>{" "}
            上搜索包。
          </p>
          <p>
            觉得有问题？可以查看我们的{" "}
            <a
              href="https://loic-sharma.github.io/BaGet/"
              target="_blank"
              rel="noopener noreferrer"
            >
              文档
            </a>{" "}
            或在我们的{" "}
            <a
              href="https://github.com/loic-sharma/BaGet/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub 项目
            </a>{" "}
            上寻求帮助。
          </p>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-6">
      <div className="col-span-8">
        <Card>
          <CardHeader style={{ borderBottom: "1px solid #efefef" }}>
            <CardTitle>
              <Flexbox horizontal className="items-center">
                <Image
                  width={64}
                  src={detail.iconUrl ?? "/images/default-package-icon-256x256.png"}
                  alt="The package icon"
                  className="mr-4 img-responsive"
                  onError={(e) =>
                    (e.currentTarget.src = "/images/default-package-icon-256x256.png")
                  }
                />

                <h1 className="text-3xl font-semibold my-0">{detail.package.id}</h1>
                <span
                  className="text-3xl"
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  {detail.package.normalizedVersionString}
                </span>
              </Flexbox>
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex mb-2 gap-2">
              {detail.dependencyGroups.map((group) => {
                return (
                  <Badge variant="default" key={group.name} className="italic">
                    {" "}
                    {group.name}
                  </Badge>
                );
              })}
            </div>

            <Tabs defaultValue="dotnet-cli">
              <TabsList>
                <TabsTrigger value="dotnet-cli">.NET CLI</TabsTrigger>
                <TabsTrigger value="package-manager">Package Manager</TabsTrigger>
                <TabsTrigger value="package-refernce">PackageRefernce</TabsTrigger>
                <TabsTrigger value="paket-cli">Paket CLI</TabsTrigger>
                <TabsTrigger value="script-interactive">Script & Interactive</TabsTrigger>
              </TabsList>
              <TabsContent value="dotnet-cli">
                <Snippet lang="bash" copyable={true} prefix=">" spotlight={true}>
                  {`dotnet add package ${detail.package.id} --version ${detail.package.normalizedVersionString}`}
                </Snippet>
              </TabsContent>
              <TabsContent value="package-manager">
                <Snippet lang="bash" copyable={true} prefix=">" spotlight={true}>
                  {`NuGet\\Install-Package ${detail.package.id} -Version  ${detail.package.normalizedVersionString}`}
                </Snippet>
              </TabsContent>
              <TabsContent value="package-refernce">
                <Snippet lang="xml" copyable={true} spotlight={true}>
                  {`<PackageReference Include="${detail.package.id}" Version="${detail.package.normalizedVersionString}" />`}
                </Snippet>
              </TabsContent>
              <TabsContent value="paket-cli">
                <Snippet lang="bash" prefix=">" copyable={true} spotlight={true}>
                  {`paket add "${detail.package.id}"  --version "${detail.package.normalizedVersionString}"`}
                </Snippet>
              </TabsContent>
              <TabsContent value="script-interactive">
                <Snippet lang="bash" copyable={true} spotlight={true} prefix="> #r">
                  {`"nuget: ${detail.package.id}, ${detail.package.normalizedVersionString}"`}
                </Snippet>
              </TabsContent>
            </Tabs>

            <Tabs
              style={{
                marginTop: "50px",
              }}
              defaultValue="readme"
            >
              <TabsList>
                <TabsTrigger value="readme">Readme</TabsTrigger>
                <TabsTrigger value="2">Used By</TabsTrigger>
                <TabsTrigger value="3">Dependencies</TabsTrigger>
                <TabsTrigger value="4">Versions</TabsTrigger>
              </TabsList>

              <TabsContent value="readme">
                <Markdown
                  className="markdown"
                  fullFeaturedCodeBlock={true}
                  componentProps={{
                    a: {
                      rel: "",
                      target: "_self",
                    },
                    img: {
                      objectFit: "cover",
                      alwaysShowActions: true,
                      variant: "borderless",
                      preview: false,
                      style: {
                        maxWidth: "max-content",
                      },
                    },
                  }}
                  variant="chat"
                >
                  {detail?.readme.trim() === "" ? "这个包没有README.md文件" : detail.readme}
                </Markdown>
              </TabsContent>
              <TabsContent value="2">
                {!detail.isDotnetTemplate && !detail.isDotnetTool && (
                  <>
                    {detail.usedBy.length === 0 ? (
                      <p> 没有包依赖于{detail.package.id}.</p>
                    ) : (
                      <div>
                        <p>显示依赖的前20个包 {detail.package.id}.</p>
                        <table>
                          <thead>
                            <tr>
                              <th>Packages</th>
                              <th>Downloads</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.usedBy.map((pkg) => (
                              <tr key={pkg.id}>
                                <td>
                                  <Link href={`/packages/${pkg.id}`}>{pkg.id}</Link>
                                  <div>{pkg.description}</div>
                                </td>
                                <td>
                                  <Download />
                                  <span>{pkg.totalDownloads.toLocaleString()}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              <TabsContent value="3">
                {detail.dependencyGroups.length === 0 ? (
                  <p>This package has no dependencies.</p>
                ) : (
                  detail.dependencyGroups.map((group) => (
                    <div key={group.name}>
                      <h4>{group.name}</h4>
                      <ul>
                        {group.dependencies.length === 0 ? (
                          <li>No dependencies.</li>
                        ) : (
                          group.dependencies.map((dependency) => (
                            <li key={dependency.packageId}>
                              <Link href={`/packages/${dependency.packageId}`}>
                                {dependency.packageId}
                              </Link>
                              <span> {dependency.versionSpec}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="4">
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f5f5",
                          textAlign: "left",
                        }}
                      >
                        <th
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Version
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Downloads
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Last updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.versions.map((version, index) => (
                        <tr
                          key={version.version.version}
                          className={version.selected ? "bg-info" : ""}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                          }}
                        >
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            <Link
                              href={`/packages/${detail.package.id}/${version.version.version}`}
                            >
                              {version.version.version}
                            </Link>
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {version.downloads.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {new Date(version.lastUpdated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>信息</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="statistics">
              <li>
                <History size={14} />
                <span>最后一次更新 {new Date(detail.lastUpdated).toLocaleDateString()}</span>
              </li>
              {detail.package.projectUrlString && (
                <li>
                  <Globe size={14} />
                  <span>
                    <a
                      href={detail.package.projectUrlString}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Project URL
                    </a>
                  </span>
                </li>
              )}
              {detail.package.repositoryUrlString && (
                <li>
                  <FolderGit2 size={14} />
                  <span>
                    <a
                      href={detail.package.repositoryUrlString}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source code
                    </a>
                  </span>
                </li>
              )}
              {detail.licenseUrl && (
                <li>
                  <FileText size={14} />
                  <span>
                    <a href={detail.licenseUrl} target="_blank" rel="noopener noreferrer">
                      License
                    </a>
                  </span>
                </li>
              )}
              <li>
                <CloudDownload size={14} />
                <span>
                  <a
                    href={
                      detail.packageDownloadUrl ??
                      location.origin +
                        "/v3/package/" +
                        detail.package.id +
                        "/" +
                        detail.package.normalizedVersionString +
                        "/" +
                        `${detail.package.id}.${detail.package.normalizedVersionString}.nupkg`
                    }
                    onClick={() => {
                      const url =
                        detail.packageDownloadUrl ??
                        location.origin +
                          "/v3/package/" +
                          detail.package.id +
                          "/" +
                          detail.package.normalizedVersionString +
                          "/" +
                          `${detail.package.id}.${detail.package.normalizedVersionString}.nupkg`;

                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${detail.package.id}.${detail.package.normalizedVersionString}.nupkg`;
                      a.click();
                    }}
                  >
                    下载
                  </a>
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>统计数据</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="statistics">
              <li>
                <Download size={14} /> {detail.totalDownloads.toLocaleString()} 下载总数
              </li>
              <li>
                <Gift size={14} /> {detail.package.downloads.toLocaleString()} 本版本下载总数
              </li>
            </ul>
          </CardContent>
        </Card>

        {detail.package.authors.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>作者</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.package.authors.map((x) => (
                <Tag
                  key={x}
                  color="blue"
                  style={{
                    margin: "4px",
                    fontStyle: "italic",
                  }}
                >
                  {x}
                </Tag>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
