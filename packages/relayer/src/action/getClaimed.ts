import { KoaContext } from "../global";
import { getAllClaimed } from "../models/claimed";
import { successResponse } from "../services/response";

export const getClaimed = async (ctx: KoaContext) => {
  ctx.status = 200;

  const claimed = await getAllClaimed(ctx.address);

  ctx.body = successResponse(claimed);
};
