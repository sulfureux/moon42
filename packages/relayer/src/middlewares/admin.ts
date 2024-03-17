import { KoaContext, KoaNext } from "../global";

export const admin = async (ctx: KoaContext, next: KoaNext) => {
  const admins = ["0xe70adf9aE4d5F68E80A8E2C5EA3B916Dd49C6D87"].map((item) => item.toLocaleLowerCase());
  if (admins.includes(ctx.address)) {
    ctx.isAdmin = true;
  }

  await next();
};
