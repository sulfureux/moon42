import Koa from "koa";
import koaLogger from "koa-pino-logger";
import Router from "@koa/router";
import helmet from "koa-helmet";
import bodyParser from "koa-bodyparser";
import multer from "@koa/multer";
import { isProduction } from "./config";
import logger from "./utils/log";
import { client } from "./db";
import { listenerInit } from "./listener/mintNftListener";
import { cronInit } from "./cron/index";
import { init } from "./middlewares/init";
import { corsMiddleware } from "./middlewares/cors";
import { cacheMiddleware } from "./middlewares/cache";
import { dateRangeMiddleware } from "./middlewares/dateRange";
import { paginationMiddleware } from "./middlewares/page";
import { limiter } from "./middlewares/limiter";
import { notFound } from "./middlewares/notFound";
import { strava } from "./middlewares/strava";
import { auth } from "./middlewares/auth";
import { admin } from "./middlewares/admin";
import { nftCollInit } from "./models/moon42";
import { campaignCollInit } from "./models/campaign";
import { waitlistCollInit } from "./models/waitlist";
import { userCollInit } from "./models/user";
import { index } from "./action/index";
import saveWaitlist from "./action/saveWailist";
// import { getClaimable } from "./action/getClaimable";
import { getCampaigns } from "./action/getCampaigns";
import { createCampaign } from "./action/createCampaign";
import { verify } from "./action/verify";
import { registerCampaign } from "./action/registerCampaign";
import { connectStrava, connectStravaRequest, disconnectStrava, getStravaProfile } from "./action/strava";
// import { web3StorageInit } from "./services/web3Storage";
import { createVeraxSchema } from "./action/createVeraxSchema";
import { getMetadata } from "./action/getMetadata";
import { metadataCollInit } from "./models/metadata";
import { createVeraxPortal } from "./action/createVeraxPortal";
import { claimVerax } from "./action/claimVerax";
import { getClaimed } from "./action/getClaimed";
import { claimedCollInit } from "./models/claimed";

// create app
const app = new Koa();

app.use(init);
app.use(cacheMiddleware);
if (isProduction) app.use(koaLogger());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(corsMiddleware);
app.use(
  bodyParser({
    formLimit: "200mb",
  }),
);
app.use(auth);
app.use(admin);
app.use(strava);

const upload = multer();

(async function main() {
  await createVeraxSchema();
  await createVeraxPortal();

  // db
  await client.connect();
  client.on("close", () => client.connect());

  // await web3StorageInit();

  await campaignCollInit();
  await nftCollInit();
  await waitlistCollInit();
  await userCollInit();
  await metadataCollInit();
  await claimedCollInit();

  // app router
  const router = new Router({ prefix: "/v1" });
  router.use(dateRangeMiddleware);
  router.use(paginationMiddleware);

  router.get("/", index);

  router.post("/waitlist", saveWaitlist);
  router.post("/auth/verify", verify);

  router.get("/campaigns", getCampaigns);

  router.post(
    "/campaign",
    upload.fields([
      { name: "name", maxCount: 1 },
      { name: "description", maxCount: 1 },

      { name: "image", maxCount: 1 },
      { name: "banner", maxCount: 1 },
      { name: "registeredImage", maxCount: 1 },
      { name: "unfinishedImage", maxCount: 1 },
      { name: "finishedImage", maxCount: 1 },

      { name: "imageURL", maxCount: 1 },
      { name: "bannerURL", maxCount: 1 },
      { name: "registeredImageURL", maxCount: 1 },
      { name: "unfinishedImageURL", maxCount: 1 },
      { name: "finishedImageURL", maxCount: 1 },

      { name: "registerTime", maxCount: 1 },
      { name: "startTime", maxCount: 1 },
      { name: "hasEndTime", maxCount: 1 },
      { name: "endTime", maxCount: 1 },

      { name: "trackable", maxCount: 1 },
      { name: "standardCode", maxCount: 1 },
      { name: "stravaData", maxCount: 1 },
      { name: "tracksValue[]" },
      { name: "tracksImage[]" },
      { name: "tracksImageURL[]" },
    ]),
    createCampaign,
  );

  router.get("/campaign/:id", getCampaigns);
  router.post("/campaign/:id/register", registerCampaign);
  router.post("/campaign/:id/claimVerax", claimVerax);
  router.get("/claimed", getClaimed);

  router.post("/strava/request", connectStravaRequest);
  router.get("/strava/callback", connectStrava);
  router.post("/strava/disconnect", disconnectStrava);
  router.get("/strava/profile", getStravaProfile);

  router.get("/metadata/:id", getMetadata);

  app.use(router.routes());
  app.use(router.allowedMethods());
  // /app router

  app.use(limiter);
  app.use(notFound);

  const port = 3333;

  // app
  app.listen(port);

  // app info
  logger.info({ thread: "main", data: "service started", port });

  cronInit();
  listenerInit();
})();
