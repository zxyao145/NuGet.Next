import { StateCreator } from "zustand/vanilla";
import { initialState, UserState } from "./initialState";
import { createAuthSlice, type UserAuthAction } from "./slices/auth/action";
import { createDevtools } from "../middleware/createDevtools";
import { createWithEqualityFn } from "zustand/traditional";
import { subscribeWithSelector } from "zustand/middleware";
import { type PreferenceAction, createPreferenceSlice } from "./slices/preference/action";
import { shallow } from "zustand/shallow";

export type UserStore = UserState & UserAuthAction & PreferenceAction;

const createStore: StateCreator<UserStore, [["zustand/devtools", never]]> = (...parameters) => ({
  ...initialState,
  ...createAuthSlice(...parameters),
  ...createPreferenceSlice(...parameters),
});

const devtools = createDevtools("user");

export const useUserStore = createWithEqualityFn<UserStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
