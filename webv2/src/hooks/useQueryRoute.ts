"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { useQuery } from "./useQuery";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean | null)[];
type QueryMap = Record<string, QueryValue>;

interface QueryRouteOptions {
  hash?: string;
  query?: QueryMap;
  replace?: boolean;
  replaceHash?: boolean;
  withHash?: boolean;
}

interface GenHrefOptions extends QueryRouteOptions {
  prevQuery?: QueryMap;
  url: string;
}

const genHref = ({ hash, replace, url, prevQuery = {}, query = {} }: GenHrefOptions): string => {
  let href = qs.stringifyUrl({ query: replace ? query : { ...prevQuery, ...query }, url });
  if (hash) {
    href = [href, hash || location?.hash?.slice(1)].filter(Boolean).join("#");
  }
  return href;
};

export const useQueryRoute = () => {
  const router = useRouter();
  const prevQuery = useQuery();

  return useMemo(
    () => ({
      push: (url: string, options: QueryRouteOptions = {}) => {
        return router.push(genHref({ prevQuery, url, ...options }));
      },
      replace: (url: string, options: QueryRouteOptions = {}) => {
        return router.replace(genHref({ prevQuery, url, ...options }));
      },
    }),
    [prevQuery, router],
  );
};
