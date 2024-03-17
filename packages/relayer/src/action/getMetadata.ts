import { ObjectId } from "mongodb";
import { KoaContext } from "../global";
import { getMeatadata } from "../models/metadata";

export const getMetadata = async (ctx: KoaContext) => {
  ctx.status = 200;

  const id = ctx.params.id;
  const metadataId = ObjectId.createFromHexString(id);

  ctx.body = (await getMeatadata(metadataId)).data;
};
