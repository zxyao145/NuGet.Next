import { UserPreferenceState, createPreferenceState } from "./slices/preference/initialState";
import { createAuthState, UserAuthState } from "./slices/auth/initialState";

export type UserState = UserPreferenceState & UserAuthState;

export const createInitialState = (): UserState => ({
  ...createAuthState(),
  ...createPreferenceState(),
});
