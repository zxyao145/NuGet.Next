import { DEFAULT_PREFERENCE } from "@/const/user";
import { UserPreference } from "@/types/user";

export interface UserPreferenceState {
  /**
   * the user preference, which only store in local storage
   */
  preference: UserPreference;
  theme: "light" | "dark" | "auto";
}

const getStoredTheme = (): UserPreferenceState["theme"] => {
  if (typeof window === "undefined") return "auto";
  const theme = window.localStorage.getItem("theme");
  if (theme === "light" || theme === "dark" || theme === "auto") return theme;
  return "auto";
};

export const createPreferenceState = (): UserPreferenceState => ({
  preference: DEFAULT_PREFERENCE,
  theme: getStoredTheme(),
});
