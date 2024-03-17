import * as jose from "jose";
import { KoaContext, KoaNext } from "../global";
import logger from "../utils/log";
import { User, createUser, getUser } from "../models/user";

const jwks = jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks"));

export const auth = async (ctx: KoaContext, next: KoaNext) => {
  ctx.address = "";
  ctx.isAuth = false;

  const idToken = ctx.request.headers.authorization?.split(" ")[1];
  let address = ctx.request.query["address"] as string;

  if (!idToken) {
    await next();
    return;
  }

  if (!address) {
    await next();
    return;
  }

  address = address.toLocaleLowerCase();

  try {
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

    if (jwtDecoded.payload.wallets[0].address === address) {
      ctx.address = address;
      ctx.isAuth = true;

      const user = await getUser(address);

      if (!user) {
        const newUser: User = {
          address,
          joined: [],
          stravaLimit: {},
          stravaCache: {},
        };

        const id = (await createUser(newUser)).insertedId;
        user._id = id;
      }
    }
  } catch (e) {
    logger.error({ thread: "middleware", data: "auth", e });
  }

  await next();
};
