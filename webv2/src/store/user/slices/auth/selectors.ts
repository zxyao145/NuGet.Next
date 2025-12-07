import { UserStore } from "@/store/user";
import { User } from "@/types/user";

const nickName = (s: UserStore) => {
  return s.user?.fullName || s.user?.username;
};

const username = (s: UserStore) => {
  if (s.isSignedIn) return s.user?.username;

  return "请先登录";
};

export const userProfileSelectors = {
  nickName,
  userAvatar: (s: UserStore): string => s.user?.avatar || "",
  userId: (s: UserStore) => s.user?.id,
  userProfile: (s: UserStore): User | null | undefined => s.user,
  username,
};

/**
 * 使用此方法可以兼容不需要登录鉴权的情况
 */
const isLogin = (s: UserStore) => {
  return s.isSignedIn;
};

export const authSelectors = {
  isLoaded: (s: UserStore) => s.isLoaded,
  isLogin,
  isLoginWithAuth: (s: UserStore) => s.isSignedIn,
  isLoginWithClerk: (s: UserStore): boolean => s.isSignedIn || false,
};
