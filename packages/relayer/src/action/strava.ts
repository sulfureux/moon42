import { KoaContext } from "../global";
import { createStravaRequest, updateStravaConnect, userDisconnectStrava, userGetStravaProfile } from "../models/user";
import { errorResponse, successResponse } from "../services/response";
import axios from "axios";
import logger from "../utils/log";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REDIRECT, STRAVA_UI_REDIRECT } from "../config";

export const connectStravaRequest = async (ctx: KoaContext) => {
  if (!ctx.isAuth) {
    ctx.status = 400;
    ctx.body = errorResponse("need auth", 400);
    return;
  }

  const stravaRequest = await createStravaRequest(ctx.address);

  ctx.status = 200;
  ctx.body = successResponse(stravaRequest);
};

export const connectStrava = async (ctx: KoaContext) => {
  const code = ctx.query["code"] as string;
  const requestCode = ctx.query["requestCode"] as string;

  const data = await handleStravaCode(code);

  await updateStravaConnect(requestCode, data);

  ctx.body = successResponse("success");
  ctx.redirect(STRAVA_UI_REDIRECT);
};

export const handleStravaCode = async (code: string) => {
  try {
    const { data } = await axios.post(
      "https://www.strava.com/oauth/token",
      new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: STRAVA_REDIRECT,
        scope: "activity:read_all",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data;
  } catch (error) {
    logger.error({ error });
  }
};

export const disconnectStrava = async (ctx: KoaContext) => {
  if (!ctx.isAuth) {
    ctx.status = 400;
    ctx.body = errorResponse("need auth", 400);
    return;
  }

  await userDisconnectStrava(ctx.address);

  ctx.status = 200;
  ctx.body = successResponse("success");
};

export const getStravaProfile = async (ctx: KoaContext) => {
  if (!ctx.isAuth) {
    ctx.status = 400;
    ctx.body = errorResponse("need auth", 400);
    return;
  }

  const data = await userGetStravaProfile(ctx.address);

  ctx.status = 200;
  ctx.body = successResponse(data);
};

// export const trackingDataStrava = async (ctx: KoaContext) => {//   let code: string = ctx.request.query.code.toString();
//   access_token = await getToken(code);

//   let rawCampaignId: string = ctx.params.campaignId.toString();
//   const campaignId = ObjectId.createFromHexString(rawCampaignId);
//   let campaign = await getCampaign(campaignId);
//   // get nft list campaign of athelte
//   let athlete_campaign = {
//     pubId: "abcxyz",
//     nftMinted: [5000, 10000], // metres
//   };

//   let campaignJoined = await getJoinedCampaign(campaignId, athlete_campaign.pubId);

//   trackingData = await getTrackingData(access_token, registerTime, campaignEndTime, 1, 100);
//   if (!trackingData) {
//     ctx.body = "Not Found!!";
//     ctx.status = 404;
//   } else {
//     ctx.body = trackingData;
//     ctx.status = 200;
//   }
// };

// export const totalDistanceStrava = async (ctx: KoaContext) => {
//   total_distance = await getDistance(trackingData);
//   ctx.body = total_distance;
//   ctx.status = 200;
// };

// export const checkpointsStrava = async (ctx: KoaContext) => {
//   const rawCampaignId: string = ctx.params.campaignId.toString();
//   const campaignId = ObjectId.createFromHexString(rawCampaignId);

//   const campaign = await getCampaign(campaignId);
//   const tracks = campaign.tracks;
//   const result = checkpoints(tracks, total_distance);

//   ctx.body = result;
//   ctx.status = 200;
// };
