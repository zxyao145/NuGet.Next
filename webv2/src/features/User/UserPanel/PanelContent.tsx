"use client";

import { useRouter } from "next/navigation";

import { memo } from "react";
import { Flexbox } from "react-layout-kit";

import BrandWatermark from "@/components/BrandWatermark";
import Menu from "@/components/Menu";
import { useUserStore } from "@/store/user";
import { authSelectors } from "@/store/user/selectors";

import UserLoginOrSignup from "../UserLoginOrSignup";
import { useMenu } from "./useMenu";
import UserInfo from "../UserInfo";

const PanelContent = memo<{ closePopover: () => void }>(({ closePopover }) => {
  const router = useRouter();
  const isLoginWithAuth = useUserStore(authSelectors.isLoginWithAuth);
  const [signOut, openUserProfile] = useUserStore((s) => [s.clerkSignOut, s.openUserProfile]);
  const { mainItems, logoutItems } = useMenu();

  const handleOpenProfile = () => {
    openUserProfile();
    closePopover();
  };

  const handleSignIn = () => {
    closePopover();
    router.push("/login");
  };

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
    closePopover();
    router.push("/login");
  };

  return (
    <Flexbox gap={2} style={{ minWidth: 300 }}>
      {isLoginWithAuth ? (
        <>
          <UserInfo onClick={handleOpenProfile} />
        </>
      ) : (
        <UserLoginOrSignup onClick={handleSignIn} />
      )}

      <Menu items={mainItems} onClick={closePopover} />
      <Flexbox
        align={"center"}
        horizontal
        justify={"space-between"}
        style={isLoginWithAuth ? { paddingRight: 6 } : { padding: "6px 6px 6px 16px" }}
      >
        {isLoginWithAuth ? (
          <Menu items={logoutItems} onClick={handleSignOut} />
        ) : (
          <BrandWatermark />
        )}
      </Flexbox>
    </Flexbox>
  );
});

PanelContent.displayName = "PanelContent";

export default PanelContent;
