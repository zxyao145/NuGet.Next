import { FC, PropsWithChildren } from "react";

import { isMobileDevice } from "@/utils/responsive";

interface ServerLayoutProps<T> {
  Desktop: FC<T>;
  Mobile: FC<T>;
}

const ServerLayout = <T extends PropsWithChildren>({
  Desktop,
  Mobile,
}: ServerLayoutProps<T>): FC<T> => {
  const LayoutComponent: FC<T> = (props: T) => {
    const mobile = isMobileDevice();
    const Component = mobile ? Mobile : Desktop;
    return <Component {...props} />;
  };
  LayoutComponent.displayName = "ServerLayoutView";
  return LayoutComponent;
};

ServerLayout.displayName = "ServerLayout";

export default ServerLayout;
