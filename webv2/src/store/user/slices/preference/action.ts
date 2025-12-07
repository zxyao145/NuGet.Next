import { UserGuide, UserPreference } from "@/types/user";
import { merge } from "@/utils/merge";

export interface PreferenceAction {
  updateGuideState: (guide: Partial<UserGuide>) => Promise<void>;
  updatePreference: (
    preference: Partial<UserPreference>,
    action?:
      | string
      | {
          type: string;
          [x: string | number | symbol]: unknown;
        }
      | undefined,
  ) => Promise<void>;
  setTheme: (theme: "light" | "dark" | "auto") => void;
}

type PreferenceStore = {
  preference: UserPreference;
  theme: "light" | "dark" | "auto";
};

export const createPreferenceActions = (
  getState: () => PreferenceStore,
  setState: (partial: Partial<PreferenceStore>) => void,
): PreferenceAction => {
  const updatePreference: PreferenceAction["updatePreference"] = async (preference) => {
    const nextPreference = merge(getState().preference, preference);
    setState({ preference: nextPreference });
  };

  const updateGuideState: PreferenceAction["updateGuideState"] = async (guide) => {
    const nextGuide = merge(getState().preference.guide, guide);
    await updatePreference({ guide: nextGuide });
  };

  const setTheme: PreferenceAction["setTheme"] = (theme) => {
    setState({ theme });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  };

  return {
    updateGuideState,
    updatePreference,
    setTheme,
  };
};
