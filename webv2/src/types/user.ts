export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  passwordHash: string | null;
  password: string;
  avatar: string | null;
  role: string;
}

export interface UserGuide {
  /**
   * Move the settings button to the avatar dropdown
   */
  moveSettingsToAvatar?: boolean;

  // Topic 引导
  topic?: boolean;
}

export interface UserPreference {
  guide?: UserGuide;
  hideSyncAlert?: boolean;
  telemetry: boolean | null;
  /**
   * whether to use cmd + enter to send message
   */
  useCmdEnterToSend?: boolean;
}
