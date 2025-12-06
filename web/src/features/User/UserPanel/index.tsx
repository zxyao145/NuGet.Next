import { Popover } from "antd";
import { createStyles } from "antd-style";
import { PropsWithChildren, memo, startTransition, useState } from "react";

import PanelContent from "./PanelContent";

const useStyles = createStyles(({ css }) => ({
  popover: css`
    top: 55px !important;
    right: 8px !important;
  `,
}));

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);
  const { styles } = useStyles();

  return (
    <Popover
      arrow={false}
      content={<PanelContent closePopover={() => setOpen(false)} />}
      onOpenChange={(open) => {
        startTransition(() => setOpen(open));
      }}
      open={open}
      overlayInnerStyle={{ padding: 0 }}
      placement={"bottomRight"}
      rootClassName={styles.popover}
      trigger={["click"]}
    >
      {children}
    </Popover>
  );
});

UserPanel.displayName = "UserPanel";

export default UserPanel;
