import { UserStore } from "@/store/user";

const useCmdEnterToSend = (s: UserStore): boolean => s.preference.useCmdEnterToSend || false;

const userAllowTrace = (s: UserStore) => s.preference.telemetry;

const hideSyncAlert = (s: UserStore) => s.preference.hideSyncAlert;

const hideSettingsMoveGuide = (s: UserStore) => s.preference.guide?.moveSettingsToAvatar;

export const preferenceSelectors = {
  hideSettingsMoveGuide,
  hideSyncAlert,
  useCmdEnterToSend,
  userAllowTrace,
};
