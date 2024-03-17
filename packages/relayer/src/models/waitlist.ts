import { dbCollection } from "../db/collection";
import { Document, Collection } from "mongodb";
import logger from "../utils/log";
import { DB__MOON42 } from "../config";
import { createDBCollName } from "../db/createDBCollName";

export type Waitlist = {
  email: string;
  time: Date;
};

type WaitlistDocument = Waitlist & Document;

const collName = createDBCollName("waitlist");

let waitlistColl: Collection<WaitlistDocument>;

export const waitlistCollInit = async () => {
  const { collection } = await dbCollection<WaitlistDocument>(DB__MOON42, collName);
  waitlistColl = collection;

  await waitlistColl.createIndex({ email: 1 });
  await waitlistColl.createIndex({ time: 1 });

  logger.info({ thread: "db", collection: collName, stage: "initial" });
};

export const isWaitlistExist = async (email: string): Promise<WaitlistDocument> => {
  const waitlist = await waitlistColl.findOne({ email });
  return waitlist;
};

export const saveWaitlist = async (email: string) => {
  await waitlistColl.insertOne({ email, time: new Date() });
};
