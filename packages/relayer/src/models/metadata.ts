import { Document, Collection, ObjectId, WithId } from "mongodb";
import { createDBCollName } from "../db/createDBCollName";
import { dbCollection } from "../db/collection";
import { DB__MOON42 } from "../config";
import logger from "../utils/log";

export type Metadata = {
  data: string;
};

type MetadataDocument = Metadata & Document;

const collName = createDBCollName("metadata");

export let metadataColl: Collection<MetadataDocument>;

export const metadataCollInit = async () => {
  const { collection } = await dbCollection<MetadataDocument>(DB__MOON42, collName);
  metadataColl = collection;

  logger.info({ thread: "db", collection: collName, stage: "initial" });
};

export const createMetadata = async (data: string) => {
  logger.info({ thread: "db", collection: metadataColl.collectionName, action: "createMetadata", data });

  const metadata: Metadata = { data };

  return await metadataColl.insertOne(metadata);
};

export const getMeatadata = async (_id: ObjectId): Promise<WithId<MetadataDocument>> => {
  const metadata = await metadataColl.findOne({ _id });

  return metadata;
};
