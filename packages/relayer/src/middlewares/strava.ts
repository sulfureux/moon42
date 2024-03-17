import { KoaContext, KoaNext } from "../global";
import { isStravaConnected } from "../models/user";

export const strava = async (ctx: KoaContext, next: KoaNext) => {
  if (ctx.isAuth) {
    ctx.isStravaConnected = await isStravaConnected(ctx.address);
  }

  await next();
};
