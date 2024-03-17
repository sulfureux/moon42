import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import toastReducer from "../components/Toast/toastReducer";
import authReducer from "../features/authentication/reducer";
import campaignReducer from "../features/campaigns/reducer";

const createStore = () => {
  return configureStore({
    reducer: {
      toast: toastReducer,
      auth: authReducer,
      campaign: campaignReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export let store = createStore();

export const refreshStore = () => {
  store = createStore();
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type StoreType = typeof store;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
