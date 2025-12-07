import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { PropsWithChildren, memo, startTransition, useState } from "react";

import PanelContent from "./PanelContent";

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      onOpenChange={(open) => {
        startTransition(() => setOpen(open));
      }}
      open={open}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <PanelContent closePopover={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
});

UserPanel.displayName = "UserPanel";

export default UserPanel;
