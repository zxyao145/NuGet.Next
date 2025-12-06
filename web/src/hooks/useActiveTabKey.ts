import { useMemo } from "react";
import { useLocation } from "react-router-dom"; // 假设你使用的是react-router

import { SidebarTabKey } from "@/store/global/initialState";

export const useActiveTabKey = () => {
  const location = useLocation();

  const activeTabKey = useMemo(() => {
    const pathname = location.pathname;
    const foundKey = pathname.split("/").find(Boolean) as SidebarTabKey | undefined;
    return foundKey ?? SidebarTabKey.Welcome;
  }, [location.pathname]);

  return activeTabKey;
};
