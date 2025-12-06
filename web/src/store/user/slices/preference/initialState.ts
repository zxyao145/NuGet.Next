import { DEFAULT_PREFERENCE } from "@/const/user";
import { UserPreference } from "@/types/user";

export interface UserPreferenceState {
  /**
   * the user preference, which only store in local storage
   */
  preference: UserPreference;
  theme: "light" | "dark" | "auto";
}

export const initialPreferenceState: UserPreferenceState = {
  preference: DEFAULT_PREFERENCE,
  theme: (localStorage.getItem("theme") as "light" | "dark" | "auto") || "auto",
};
