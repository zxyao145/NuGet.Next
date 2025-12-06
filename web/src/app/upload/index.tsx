import { memo, useEffect, useState } from "react";

import { useUserStore } from "@/store/user";
import { Button, Card, Descriptions, Tag, Upload, message } from "antd";

import JSZip from "jszip";
import { Flexbox } from "react-layout-kit";
import { useNavigate } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import { PutPackage } from "@/services/PackageService";
const { Dragger } = Upload;

interface Dependency {
  id: string | null;
  version: string | null;
  exclude: string | null;
}

interface PackageInfo {
  packageId?: string;
  version?: string;
  owners?: string;
  license?: string;
  description?: string;
  dependencies?: Dependency[];
  tags?: string[];
  licenseUrl?: string;
  projectUrl?: string;
  frameworkReferences?: string[];
}

const UploadPage = memo(() => {
  const navigate = useNavigate();
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const [file, setFile] = useState<File | null>(null);
  const [item, setItem] = useState<PackageInfo | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
    }
  }, []);

  const beforeUpload = (file: File) => {
    const isNuGet = file.name.endsWith(".nupkg") || file.name.endsWith(".snupkg");
    if (!isNuGet) {
      message.error("You can only upload NuGet files!");
    } else {
      setFile(file);
    }
    return false;
  };

  /**
   * 解析Nuget
   */
  async function parseNuget(file: File) {
    try {
      const zip = new JSZip();
      const content = await file.arrayBuffer();
      const unzipped = await zip.loadAsync(content);

      // Here we are just logging the files in the NuGet package
      let fileItem: string | null = null;
      unzipped.forEach((relativePath) => {
        // 找到.nuspec文件
        if (relativePath.endsWith(".nuspec")) {
          fileItem = relativePath;
        }
      });

      if (!fileItem) {
        message.error("NuGet package does not contain a .nuspec file");
        return;
      }

      const nuspecContent = await unzipped.file(fileItem)?.async("text");

      if (!nuspecContent) {
        message.error("Error reading the NuGet package");
        return;
      }
      console.log(nuspecContent);

      // 使用xml解析器解析nuspecContent
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(nuspecContent, "text/xml");
      xmlDoc.querySelectorAll("metadata").forEach((metadata) => {
        const id = metadata.querySelector("id")?.textContent;
        const version = metadata.querySelector("version")?.textContent;
        const authors = metadata.querySelector("authors")?.textContent;
        const description = metadata.querySelector("description")?.textContent;
        const tags = metadata.querySelector("tags")?.textContent?.split(" ");
        const license = metadata.querySelector("license")?.textContent;
        const licenseUrl = metadata.querySelector("licenseUrl")?.textContent;
        const projectUrl = metadata.querySelector("projectUrl")?.textContent;
        // Dependencies
        const dependencies: Dependency[] = [];
        metadata.querySelectorAll("dependencies").forEach((dependency) => {
          dependency.querySelectorAll("dependency").forEach((dep) => {
            const depId = dep.getAttribute("id");
            const depVersion = dep.getAttribute("version");
            const depExclude = dep.getAttribute("exclude");
            dependencies.push({
              id: depId,
              version: depVersion,
              exclude: depExclude,
            });
          });
        });

        // frameworkReferences
        const frameworkReferences: any = [];
        metadata.querySelectorAll("frameworkReferences").forEach((frameworkReference) => {
          frameworkReference.querySelectorAll("group").forEach((group) => {
            const targetFramework = group.getAttribute("targetFramework");
            const references: any = [];
            group.querySelectorAll("frameworkReference").forEach((reference) => {
              references.push({
                name: reference.getAttribute("name"),
                version: reference.getAttribute("version"),
              });
            });
            frameworkReferences.push({
              targetFramework,
              references,
            });
          });
        });

        setItem({
          packageId: id,
          version,
          owners: authors,
          license,
          description,
          dependencies,
          tags,
          licenseUrl,
          projectUrl,
          frameworkReferences,
        });
      });
    } catch (error) {
      console.error("Error reading the NuGet package", error);
    }
  }

  useEffect(() => {
    if (file) {
      parseNuget(file);
    }
  }, [file]);

  function uploadPackage() {
    // 上传包
    const formData = new FormData();
    formData.append("file", file as Blob);
    PutPackage(formData).then((result) => {
      if (!result) {
        message.success("包上传成功");
        setItem(null);
        setFile(null);
      }
    });
  }

  function renderItem() {
    if (!item) {
      return (
        <Dragger
          style={{
            width: "100%",
            marginTop: "20px",
          }}
          beforeUpload={beforeUpload}
          name="file"
          multiple={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖动文件到此区域上传</p>
          <p className="ant-upload-hint">浏览或拖放文件选择包（.nupkg）或符号包（.snupkg）…</p>
        </Dragger>
      );
    } else {
      return (
        <Card
          title={<span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.packageId}</span>}
          extra={
            <Flexbox horizontal>
              <Button
                style={{
                  marginRight: "10px",
                }}
                type="primary"
                onClick={() => {
                  if (file) {
                    uploadPackage();
                  }
                }}
              >
                上传
              </Button>

              <Button
                type="dashed"
                onClick={() => {
                  setItem(null);
                  setFile(null);
                }}
              >
                重新上传
              </Button>
            </Flexbox>
          }
          style={{ width: "100%" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="版本">{item.version}</Descriptions.Item>
            <Descriptions.Item label="作者">{item.owners}</Descriptions.Item>
            <Descriptions.Item label="描述">{item.description}</Descriptions.Item>
            <Descriptions.Item label="标签">
              {item.tags && item.tags.map((tag: string) => <Tag key={tag}>{tag}</Tag>)}
            </Descriptions.Item>
            <Descriptions.Item label="许可证">{item.license}</Descriptions.Item>
            <Descriptions.Item label="许可证 URL">
              <a href={item.licenseUrl} target="_blank" rel="noreferrer">
                {item.licenseUrl}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="项目 URL">
              <a href={item.projectUrl} target="_blank" rel="noreferrer">
                {item.projectUrl}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="依赖项">
              {item.dependencies &&
                item.dependencies.map((dep: any, index: number) => (
                  <div key={index} style={{ marginLeft: "20px" }}>
                    <span
                      onClick={() => {
                        navigate(`/packages/${dep.id}`);
                      }}
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        cursor: "pointer",
                        margin: 3,
                      }}
                    >
                      {dep.id}
                    </span>
                    <span>{dep.version}</span>
                  </div>
                ))}
            </Descriptions.Item>
            <Descriptions.Item label="框架引用">
              {item.frameworkReferences &&
                item.frameworkReferences.map((ref: any, index: number) => (
                  <div key={index} style={{ marginLeft: "20px" }}>
                    <div>
                      <strong>目标框架:</strong> {ref.targetFramework}
                    </div>
                    <div>
                      <strong>引用:</strong>{" "}
                      {ref.references &&
                        ref.references.map((reference: any, refIndex: number) => (
                          <div key={refIndex} style={{ marginLeft: "20px" }}>
                            <div>
                              <strong>名称:</strong> {reference.name}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      );
    }
  }

  return (
    <Flexbox
      style={{
        padding: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        包文件将上传并托管在 NuGet Next 库服务器上 <br />
        要了解有关出色软件包的详细信息，请参阅{" "}
        <a
          href="https://learn.microsoft.com/zh-cn/nuget/create-packages/package-authoring-best-practices"
          target="_blank"
          rel="noreferrer"
        >
          NuGet 文档
        </a>
      </span>

      {renderItem()}
    </Flexbox>
  );
});

UploadPage.displayName = "Packages";

export default UploadPage;
