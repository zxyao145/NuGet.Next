"use client";

import { ReactNode, memo } from "react";

const MobileLayout = memo(({ children }: { children?: ReactNode }) => {
  return <div>{children}</div>;
});

MobileLayout.displayName = "MobileLayout";

export default MobileLayout;
