import { KoaContext } from "../global";
import { successResponse } from "../services/response";

export const isAdmin = async (ctx: KoaContext) => {
  ctx.status = 200;
  ctx.body = successResponse(ctx.isAdmin);
};
