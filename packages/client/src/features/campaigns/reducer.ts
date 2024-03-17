import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { setToast } from "../../components/Toast/toastReducer";
import config from "../../config";
import { getAuthStateToken } from "../../services/getStateToken";
import { Response } from "../../services/response";
import { CampaignType, Claimed, MintProof, RawCampaignType, defaultCampaignReducer, emptyCampaign, rawToCampaignType } from "./types";

export const getCampaigns = createAsyncThunk("campaign/getCampaigns", async (_, { dispatch, getState }): Promise<CampaignType[]> => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.get<Response<RawCampaignType[]>>(`${config.apiURL}/v1/campaigns?address=${token.address}`, {
      headers: { Authorization: `Bearer ${token.token}` },
    });
    if (data.status) {
      return data.data.map(rawToCampaignType);
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async ({ campaign, callback }: { campaign: FormData; callback: (last: CampaignType) => void }, { getState, dispatch }): Promise<CampaignType[]> => {
    const token = await getAuthStateToken(getState());

    try {
      const { data } = await axios.post<Response<RawCampaignType[]>>(`${config.apiURL}/v1/campaign?address=${token.address}`, campaign, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token.token}`,
        },
      });

      if (data.status) {
        dispatch(setToast({ show: true, title: "", message: "Create campaign success", type: "success" }));
        callback(rawToCampaignType(data.data[data.data.length - 1]));
        return data.data.map(rawToCampaignType);
      }

      dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

      throw new Error(data.message.text);
    } catch (error) {
      console.error(error);
      return [];
    }
  },
);

export const getCampaign = createAsyncThunk("campaign/getCampaign", async ({ callback }: { callback: (last: CampaignType) => void }, { dispatch }): Promise<CampaignType> => {
  try {
    const { data } = await axios.get<Response<RawCampaignType>>(`${config.apiURL}/v1/campaign`);
    if (data.status) {
      callback(rawToCampaignType(data.data));
      return rawToCampaignType(data.data);
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return emptyCampaign;
  }
});

export const getClaimed = createAsyncThunk("campaign/getClaimed", async (_, { dispatch, getState }): Promise<Claimed[]> => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.get<Response<Claimed[]>>(`${config.apiURL}/v1/claimed?address=${token.address}`, {
      headers: { Authorization: `Bearer ${token.token}` },
    });
    if (data.status) {
      return data.data;
    }

    dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

    throw new Error(data.message.text);
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const registerCampaign = createAsyncThunk(
  "campaign/registerCampaign",
  async ({ id, callback }: { id: string; callback: ({ data }: { data: MintProof }) => void }, { getState, dispatch }): Promise<MintProof | undefined> => {
    const token = await getAuthStateToken(getState());

    try {
      const { data } = await axios.post<Response<MintProof>>(`${config.apiURL}/v1/campaign/${id}/register?address=${token.address}`, undefined, {
        headers: { Authorization: `Bearer ${token.token}` },
      });
      if (data.status) {
        callback({ data: data.data });

        return data.data;
      }

      dispatch(setToast({ show: true, title: "", message: data.message.text, type: "error" }));

      throw new Error(data.message.text);
    } catch (error) {
      console.error(error);
    }
  },
);

export const claimVerax = createAsyncThunk("campaign/claimVerax", async ({ id, callback }: { id: string; callback: () => void }, { getState, dispatch }): Promise<void> => {
  const token = await getAuthStateToken(getState());

  try {
    const { data } = await axios.post<Response<MintProof>>(`${config.apiURL}/v1/campaign/${id}/claimVerax?address=${token.address}`, undefined, {
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
  }
});

const campaignReducer = createReducer(defaultCampaignReducer, (builder) => {
  return builder
    .addCase(getCampaigns.pending, (state, action) => {
      state.isLoading = true;
    })
    .addCase(getCampaigns.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInit = true;
      state.campaigns = action.payload;
    })
    .addCase(createCampaign.fulfilled, (state, action) => {
      state.campaigns = action.payload;
    })
    .addCase(getClaimed.fulfilled, (state, action) => {
      state.claimed = action.payload;
    });
});

export const selectCampaign = (state: RootState) => state.campaign;

export default campaignReducer;
