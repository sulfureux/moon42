import { ObjectId, WithId } from "mongodb";
import { KoaContext } from "../global";
import { errorResponse, successResponse } from "../services/response";
import { getCampaign } from "../models/campaign";
import { getNftClaimable, moon42Base } from "../models/moon42";
import { createVeraxAttestation } from "./createVeraxAttestation";
import { now } from "lodash";
import { ClaimType, createClaimed, getClaimedByCampaignId } from "../models/claimed";

export const claimVerax = async (ctx: KoaContext) => {
  ctx.status = 200;

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
  if (!campaign) {
    ctx.status = 400;
    ctx.body = errorResponse("campaign do not exist", 400);
    return;
  }

  const participant = ctx.address;
  const data = await getNftClaimable(participant);

  let canClaim = false;
  let nft: WithId<moon42Base>;

  data.map((i) => {
    i.nfts.forEach((n) => {
      if (n.campaignId.equals(campaign._id)) {
        canClaim = true;
        nft = n;
      }
    });
  });

  const claimed = await getClaimedByCampaignId(campaign._id, ctx.address);
  if (claimed) {
    ctx.body = successResponse(true);
    return;
  }

  if (canClaim) {
    const tx = await createVeraxAttestation(ctx.address, campaign._id.toHexString(), ctx.address, now().toString(), nft.type, nft.track);
    await createClaimed(ctx.address, campaign._id, ClaimType.LINEAN_VERAX, tx);
  }

  ctx.body = successResponse(true);
};
