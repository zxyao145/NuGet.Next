"use client";

import { Menu as AntdMenu, MenuProps as AntdMenuProps, ConfigProvider } from "antd";
import { memo } from "react";

export type MenuProps = AntdMenuProps;

const Menu = memo<MenuProps>(({ className, selectable = false, ...rest }) => {
  return (
    <ConfigProvider>
      <AntdMenu className={className} mode="vertical" selectable={selectable} {...rest} />
    </ConfigProvider>
  );
});

Menu.displayName = "Menu";

export default Menu;
