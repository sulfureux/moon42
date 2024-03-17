import { createAction, createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";
import { ethers } from "ethers";
import { RootState } from "../../app/store";
import { setToast } from "../../components/Toast/toastReducer";
import config from "../../config";
import { getAuthStateToken } from "../../services/getStateToken";
import { Response } from "../../services/response";
import { defaultAuthReducer, tokenStorage } from "./types";

export const setProvider = createAction<ethers.providers.Web3Provider>("auth/setProvider");
export const setAddress = createAction<string>("auth/setAddress");
export const setToken = createAction<string>("auth/setToken");
export const clearAuth = createAction("auth/clearAuth");

export const verify = createAsyncThunk(
  "auth/verify",
  async (_, { dispatch, getState }): Promise<{ isAuth: boolean; isAdmin: boolean; isStravaConnected: boolean; token: string }> => {
    const token = await getAuthStateToken(getState());

    const { data } = await axios.post<Response<{ isAuth: boolean; isAdmin: boolean; isStravaConnected: boolean }>>(
      `${config.apiURL}/v1/auth/verify?address=${token.address}`,
      undefined,
      {
        headers: { Authorization: "Bearer " + token.token },
      },
    );

    if (data.status) {
      if (data.data.isAuth) {
        tokenStorage.set(token.token);
        return { ...data.data, token: token.token };
      }
    }

    return { isAuth: false, isAdmin: false, isStravaConnected: false, token: "" };
  },
);

export const connectStrava = createAsyncThunk("auth/connectStrava", async ({ callback }: { callback: (requestCode: string) => Promise<void> }, { getState, dispatch }) => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.post<Response<string>>(`${config.apiURL}/v1/strava/request?address=${token.address}`, undefined, {
      headers: { Authorization: `Bearer ${token.token}` },
    });

    if (data.status) {
      callback(data.data);
      return;
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const disconnectStrava = createAsyncThunk("auth/disconnectStrava", async ({ callback }: { callback: () => void }, { getState, dispatch }) => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.post<Response<string>>(`${config.apiURL}/v1/strava/disconnect?address=${token.address}`, undefined, {
      headers: { Authorization: `Bearer ${token.token}` },
    });

    if (data.status) {
      callback();
      return;
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const getStravaProfile = createAsyncThunk("auth/getStravaProfile", async (_, { getState, dispatch }) => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.get<Response<string>>(`${config.apiURL}/v1/strava/profile?address=${token.address}`, {
      headers: { Authorization: `Bearer ${token.token}` },
    });

    if (data.status) {
      return data.data;
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getMaskProfile = createAsyncThunk("auth/getMaskProfile", async (_, { getState, dispatch }) => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.get(`https://api.web3.bio/profile/${token.address}`);

    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
});

const authReducer = createReducer(defaultAuthReducer, (builder) => {
  return builder
    .addCase(setProvider, (state, action) => {
      state.provider = action.payload;
    })
    .addCase(verify.pending, (state) => {
      state.isVerifyLoading = true;
    })
    .addCase(verify.fulfilled, (state, action) => {
      state.isVerifyInit = true;
      state.isVerifyLoading = false;
      state.isVerify = action.payload.isAuth;
      state.isAdmin = action.payload.isAdmin;
      state.isStravaConnected = action.payload.isStravaConnected;
      state.token = action.payload.token;
    })
    .addCase(verify.rejected, (state) => {
      state.isVerifyInit = true;
      state.isVerifyLoading = false;
      state.isVerify = false;
      state.isStravaConnected = false;
      state.isAdmin = false;
      state.stravaProfile = undefined;
    })
    .addCase(clearAuth, (state) => {
      state.isVerifyInit = true;
      state.isVerifyLoading = false;

      state.isVerify = false;
      state.isAdmin = false;

      state.isStravaConnected = false;
      state.stravaProfile = undefined;

      state.token = "";
      tokenStorage.set("");
    })
    .addCase(setToken, (state, action) => {
      state.token = action.payload;
    })
    .addCase(getStravaProfile.fulfilled, (state, action) => {
      state.stravaProfile = action.payload as any;
    })
    .addCase(setAddress, (state, action) => {
      state.address = action.payload;
    })
    .addCase(getMaskProfile.fulfilled, (state, action) => {
      state.maskProfile = action.payload;
    });
});

export const selectAuth = (state: RootState) => state.auth;

export default authReducer;
