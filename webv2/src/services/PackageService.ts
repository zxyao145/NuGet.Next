import { get, fetch, del } from "@/utils/fetch";

export const GetPackageVersions = (id: string) => {
  return get(`/v3/package/${id}/index.json`);
};

export const DownloadPackage = (id: string) => {
  return get(`/v3/package/${id}/index.json`);
};

export const PackageInfo = (id: string, version?: string | null) => {
  if (version) {
    return get(`/v3/package-info/${id}/${version}`);
  } else {
    return get(`/v3/package-info/${id}`);
  }
};

export const PutPackage = (data: FormData) => {
  // 使用表单提交文件
  return fetch(`/api/v2/package`, {
    method: "PUT",
    body: data,
  });
};

/**
 * 获取包列表
 * @param page 页码
 * @param pageSize 每页数量
 * @param userIds 用户id
 * @param keyword 关键字
 * @returns
 */
export const PackageList = (
  page: number,
  pageSize: number,
  userIds: string[],
  keyword?: string,
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (keyword) {
    params.append("keyword", keyword);
  }
  if (userIds) {
    userIds.forEach((id) => {
      params.append("userIds", id);
    });
  }
  return get("/v3/package/list?" + params.toString());
};

/**
 * 删除包
 * @param id
 * @param verson
 * @returns
 */
export const DeletePackage = (id: string, verson: string) => {
  return del(`/v3/package/${id}/${verson}`);
};
