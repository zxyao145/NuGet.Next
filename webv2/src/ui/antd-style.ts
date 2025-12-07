"use client";

import { css as emotionCss, cx as emotionCx } from "@emotion/css";

const defaultToken = {
  colorFillTertiary: "#f5f5f5",
  colorFill: "#f5f5f5",
  colorLink: "#1677ff",
  colorPrimary: "#1677ff",
  colorText: "#111",
  colorTextDescription: "#666",
  colorTextSecondary: "#666",
};

export const createStyles = <T extends Record<string, string>>(
  generator: (params: {
    css: typeof emotionCss;
    token: typeof defaultToken;
    prefixCls: string;
  }) => T,
) => {
  const prefixCls = "nuget";
  const token = defaultToken;

  return () => {
    const styles = generator({ css: emotionCss, token, prefixCls });
    return {
      cx: emotionCx,
      prefixCls,
      styles,
      theme: token,
    };
  };
};
