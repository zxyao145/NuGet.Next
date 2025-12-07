"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { SidebarTabKey } from "@/store/global/initialState";

export const useActiveTabKey = () => {
  const pathname = usePathname();

  const activeTabKey = useMemo(() => {
    const foundKey = pathname.split("/").find(Boolean) as SidebarTabKey | undefined;
    return foundKey ?? SidebarTabKey.Welcome;
  }, [pathname]);

  return activeTabKey;
};
