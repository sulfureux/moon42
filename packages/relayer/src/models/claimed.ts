import { Document, Collection, ObjectId, WithId } from "mongodb";
import { createDBCollName } from "../db/createDBCollName";
import { dbCollection } from "../db/collection";
import { DB__MOON42 } from "../config";
import logger from "../utils/log";

export enum ClaimType {
  MINA = "mina",
  LINEAN_VERAX = "lineaVerax",
  POLYGON_ID = "polygonId",
}

export type Claimed = {
  address: string;
  campaignId: ObjectId;
  type: ClaimType;
  txHash: string;
  url: string;
};

type ClaimedDocument = Claimed & Document;

const collName = createDBCollName("claimed");

export let claimedColl: Collection<ClaimedDocument>;

export const claimedCollInit = async () => {
  const { collection } = await dbCollection<ClaimedDocument>(DB__MOON42, collName);
  claimedColl = collection;

  logger.info({ thread: "db", collection: collName, stage: "initial" });
};

export const createClaimed = async (address: string, campaignId: ObjectId, type: ClaimType, txHash: string) => {
  logger.info({ thread: "db", collection: claimedColl.collectionName, action: "createClaimed" });

  const metadata: Claimed = { address, campaignId, type, txHash, url: "" };

  return await claimedColl.updateOne(metadata, { $set: metadata }, { upsert: true });
};

export const getClaimed = async (_id: ObjectId): Promise<WithId<ClaimedDocument>> => {
  const metadata = await claimedColl.findOne({ _id });

  return metadata;
};

export const getClaimedByCampaignId = async (campaignId: ObjectId, address: string): Promise<WithId<ClaimedDocument>> => {
  const metadata = await claimedColl.findOne({ campaignId, address });

  return metadata;
};

export const getAllClaimed = async (address: string): Promise<ClaimedDocument[]> => {
  logger.info({ thread: "db", collection: collName, action: "getAllClaimed" });

  const cursor = claimedColl.find({ address });

  const claimed = [];

  for await (const campaign of cursor) {
    claimed.push(campaign);
  }

  return claimed;
};
