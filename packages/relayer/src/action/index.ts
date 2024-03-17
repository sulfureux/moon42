import { KoaContext } from "../global";

export const index = async (ctx: KoaContext) => {
  ctx.body = "moon42.run APIs";
  ctx.status = 200;
};
