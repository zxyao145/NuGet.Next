import ServerLayout from "@/components/server/ServerLayout";

import Desktop from "./_layout/Desktop";
import Mobile from "./_layout/Desktop";

const MainLayout = ServerLayout({ Desktop, Mobile });

MainLayout.displayName = "MainLayout";

export default MainLayout;
