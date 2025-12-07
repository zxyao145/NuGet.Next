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

type AuthStore = {
  isSignedIn: boolean;
  user?: User;
};

export const createAuthActions = (
  getState: () => AuthStore,
  setState: (partial: Partial<AuthStore>) => void,
): UserAuthAction => ({
  logout: async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
    setState({ isSignedIn: false, user: undefined });
  },
  openLogin: async (token: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", payload.User);
    }
    setState({ isSignedIn: true, user: JSON.parse(payload.User) });
  },
  openUserProfile: async () => {
    // open user profile modal
    void getState();
  },
});
import { User } from "@/types/user";
