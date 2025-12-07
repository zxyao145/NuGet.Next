"use client";

import { useSyncExternalStore } from "react";

import { createInitialState, UserState } from "./initialState";
import { createAuthActions, type UserAuthAction } from "./slices/auth/action";
import { createPreferenceActions, type PreferenceAction } from "./slices/preference/action";

export type UserStore = UserState & UserAuthAction & PreferenceAction;

type Listener = () => void;

const listeners = new Set<Listener>();
let currentSnapshot: UserStore;

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = () => listeners.forEach((listener) => listener());

let state: UserStore = {
  ...createInitialState(),
  logout: async () => {},
  openLogin: async () => {},
  openUserProfile: async () => {},
  setTheme: () => {},
  updateGuideState: async () => {},
  updatePreference: async () => {},
};

const getState = () => state;

const setState = (partial: Partial<UserState>) => {
  state = { ...state, ...partial };
  currentSnapshot = state;
  notify();
};

const actions = {
  ...createAuthActions(getState, setState),
  ...createPreferenceActions(getState, setState),
};

state = { ...state, ...actions };
currentSnapshot = state;

export const useUserStore = <T>(selector: (store: UserStore) => T): T => {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => currentSnapshot,
  );
  return selector(snapshot);
};

export const getUserStore = () => state;
