import { ObjectId } from "mongodb";
import { KoaContext } from "../global";
import { getCampaign } from "../models/campaign";
import { errorResponse, successResponse } from "../services/response";
import { userJoinCampaign } from "../models/user";

export const registerCampaign = async (ctx: KoaContext) => {
  if (!ctx.isAuth) {
    ctx.status = 400;
    ctx.body = errorResponse("need auth", 400);
    return;
  }

  const rawCampaignId = ctx.params.id;
  if (!rawCampaignId) {
    ctx.status = 400;
    ctx.body = errorResponse("campaign id is required", 400);
    return;
  }

  const campaignId = ObjectId.createFromHexString(rawCampaignId);

  const campaign = await getCampaign(campaignId);

  const data = await userJoinCampaign(campaign, ctx.address);

  ctx.status = 200;
  ctx.body = successResponse(data);
};
