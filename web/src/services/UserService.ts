import { del, get, postJson, putJson } from "@/utils/fetch";

const prefix = "/api/v3/user";

export const createUser = (input: unknown) => {
  return postJson(prefix, input);
};

/**
 * 获取用户信息
 *
 * @param {string} [keyword] - 搜索关键字，可选参数。
 * @param {number} [page=1] - 页码，默认为1。
 * @param {number} [pageSize=10] - 每页显示的记录数，默认为10。
 * @returns {Promise<any>} 返回包含用户信息的Promise对象。
 */
export const getUser = (keyword?: string, page: number = 1, pageSize: number = 10) => {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  return get(prefix + "?" + params.toString());
};

export const deleteUser = (id: string) => {
  return del(prefix + "/" + id);
};

export const updatePassword = (input: unknown) => {
  return putJson(prefix + "/update-password", input);
};
