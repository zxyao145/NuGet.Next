import { UserPreferenceState, initialPreferenceState } from "./slices/preference/initialState";
import { initialAuthState, UserAuthState } from "./slices/auth/initialState";

export type UserState = UserPreferenceState & UserAuthState;

export const initialState: UserState = {
  ...initialAuthState,
  ...initialPreferenceState,
};
