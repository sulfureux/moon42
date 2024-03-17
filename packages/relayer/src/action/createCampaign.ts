import dayjs from "dayjs";
import { KoaContext } from "../global";
import { CampaignBaseType, Track, getAllCampaigns, createCampaign as dbCreateCampaign } from "../models/campaign";
import { errorResponse, successResponse } from "../services/response";

export const createCampaign = async (ctx: KoaContext) => {
  if (!ctx.isAuth) {
    ctx.status = 400;
    ctx.body = errorResponse("need auth", 400);
    return;
  }

  if (!ctx.isAdmin) {
    ctx.status = 400;
    ctx.body = errorResponse("need admin", 400);
    return;
  }

  const body = ctx.request.body as {
    name: string;
    description: string;

    registerTime: string;
    startTime: string;
    hasEndTime: string;
    endTime: string;

    imageURL: string;
    bannerURL: string;
    registeredImageURL: string;
    unfinishedImageURL: string;
    finishedImageURL?: string;

    trackable: string;
    stravaData: string;
    standardCode: string;
    tracksValue: string[];
    tracksImageURL: string[];
  };

  const { name, description, standardCode, imageURL, bannerURL, registeredImageURL, unfinishedImageURL, finishedImageURL } = body;
  const registerTime = dayjs(body.registerTime);
  const startTime = dayjs(body.startTime);
  const hasEndTime = body.hasEndTime === "1" ? true : false;
  const endTime = dayjs(body.endTime);

  const trackable = body.trackable === "1" ? true : false;
  const stravaData = body.stravaData === "1" ? true : false;

  // const files = ctx.request.files;

  const tracks: Track[] = body.tracksValue.map((value, index) => {
    return { track: Number(value), image: body.tracksImageURL[index] };
  });

  const campaign: CampaignBaseType = {
    name,
    description,
    registerTime: registerTime.toDate(),
    startTime: startTime.toDate(),
    hasEndTime,
    trackable,
    stravaData,

    image: imageURL,
    banner: bannerURL,
    registeredImage: registeredImageURL,
    unfinishedImage: unfinishedImageURL,
    finishedImage: finishedImageURL,

    tracks,
    standardCode,
  };

  if (hasEndTime) {
    campaign.endTime = endTime.toDate();
  }

  await dbCreateCampaign(campaign);
  const campaigns = await getAllCampaigns();

  ctx.status = 200;
  ctx.body = successResponse(campaigns);
};
