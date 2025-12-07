"use client";

import { message } from "antd";

type FetchOptions = RequestInit & { headers?: Record<string, string> };

export async function fetch(url: string, options: FetchOptions = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers ?? {}),
    "X-NuGet-ApiKey": `${token}`,
  };
  const response = await window.fetch(url, { ...options, headers });
  if (response.status >= 200 && response.status < 300) {
    const data = await response.text();
    if (data === "" || data === null) {
      return null;
    }
    return JSON.parse(data);
  }

  if (response.status === 204) {
    return null;
  }

  // 如果是401，跳转到登录页
  if (response.status === 401) {
    if (typeof window === "undefined") return;
    window.location.href = "/login";
  }

  if (response.status === 400) {
    // 读取body内容
    const data = await response.json();
    message.error(data.message);
    throw new Error(data);
  } else if (response.status === 404) {
    message.error("请求的资源不存在");
    const data = await response.json();
    message.error(data.message);
    throw new Error(data);
  } else if (response.status === 500) {
    message.error("服务器错误");
    const data = await response.json();
    message.error(data.message);
    throw new Error(data);
  }

  const error = new Error();
  throw error;
}

export async function fetchRaw(url: string, data: unknown) {
  const token = localStorage.getItem("token");
  const headers = {
    "X-NuGet-ApiKey": `${token}`,
    "Content-Type": "application/json",
  };
  const response = await window.fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok === false) {
    const reader = await response.text();
    throw new Error(reader);
  }

  const reader = response.body!.getReader();
  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          const { done, value } = await reader.read();
          if (done) {
            return { done: true, value: null };
          }
          return {
            done: false,
            value: new TextDecoder("utf-8").decode(value),
          };
        },
      };
    },
  };
}

export const get = (url: string, options?: FetchOptions) => {
  return fetch(url, {
    method: "GET",
    ...options,
  });
};

export const post = (url: string, options?: FetchOptions) => {
  return fetch(url, {
    method: "POST",
    ...options,
  });
};

export const postJson = (url: string, data: unknown) => {
  return post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const put = (url: string, options?: FetchOptions) => {
  return fetch(url, {
    method: "PUT",
    ...options,
  });
};

export const putJson = (url: string, data: unknown) => {
  return put(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const del = (url: string, options?: FetchOptions) => {
  return fetch(url, {
    method: "DELETE",
    ...options,
  });
};
