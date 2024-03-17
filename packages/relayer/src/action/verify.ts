import { KoaContext } from "../global";
import { successResponse } from "../services/response";

export const verify = async (ctx: KoaContext) => {
  ctx.status = 200;
  ctx.body = successResponse({ isAuth: ctx.isAuth, isAdmin: ctx.isAdmin, isStravaConnected: ctx.isStravaConnected });
};
