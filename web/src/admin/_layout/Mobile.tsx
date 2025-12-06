import { memo } from "react";
import { Outlet } from "react-router-dom";

const MobileLayout = memo(() => {
  return (
    <div>
      <Outlet />
    </div>
  );
});

MobileLayout.displayName = "MobileLayout";

export default MobileLayout;
