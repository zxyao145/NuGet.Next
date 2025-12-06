import { User } from "@/types/user";

export interface UserAuthState {
  // clerkOpenUserProfile?: (props?: any) => void;
  // clerkSession?: any;
  // clerkSignIn?: (props?: any) => void;
  clerkSignOut: () => void;
  // clerkUser?: any;
  isLoaded?: boolean;
  isSignedIn: boolean;
  user?: User;
}

function userInfo() {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

export const initialAuthState: UserAuthState = {
  isSignedIn: localStorage.getItem("token") ? true : false,
  user: userInfo(),
};
