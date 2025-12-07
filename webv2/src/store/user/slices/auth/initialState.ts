import { User } from "@/types/user";

export interface UserAuthState {
  // clerkOpenUserProfile?: (props?: any) => void;
  // clerkSession?: any;
  // clerkSignIn?: (props?: any) => void;
  clerkSignOut?: () => void;
  // clerkUser?: any;
  isLoaded?: boolean;
  isSignedIn: boolean;
  user?: User;
}

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const user = window.localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user) as User;
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
};

export const createAuthState = (): UserAuthState => ({
  isSignedIn: Boolean(getStoredToken()),
  user: getStoredUser() ?? undefined,
});
