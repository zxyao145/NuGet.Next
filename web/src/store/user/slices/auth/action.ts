import { StateCreator } from "zustand/vanilla";

import { UserStore } from "../../store";

export interface UserAuthAction {
  /**
   * universal logout method
   */
  logout: () => Promise<void>;
  /**
   * universal login method
   */
  openLogin: (token: string) => Promise<void>;
  openUserProfile: () => Promise<void>;
}

export const createAuthSlice: StateCreator<
  UserStore,
  [["zustand/devtools", never]],
  [],
  UserAuthAction
> = (set) => ({
  logout: async () => {
    localStorage.removeItem("token");
    set({ isSignedIn: false });
  },
  openLogin: async (token: string) => {
    localStorage.setItem("token", token);
    // 解析jwt token，获取用户信息
    const user = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("user", user.User);

    set({ isSignedIn: true, user: JSON.parse(user.User) });
  },

  openUserProfile: async () => {
    // open user profile modal
  },
});
