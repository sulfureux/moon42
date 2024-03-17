import { dbCollection } from "../db/collection";
import { Document, Collection, ObjectId, WithId } from "mongodb";
import logger from "../utils/log";
import { DB__MOON42, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REDIRECT } from "../config";
import { createDBCollName } from "../db/createDBCollName";
import { CampaignBaseType, getCampaignsById } from "./campaign";
import { moon42Base, moon42NftType, createMoon42Medal, createNft, createNftProof, isRegisteredNftExist, moon42BaseToftType, nftColl } from "./moon42";
import randomstring from "randomstring";
import strava from "strava-v3";
import dayjs from "dayjs";

export type User = {
  address: string;
  joined: ObjectId[];
  stravaOAuth2?: StravaOAuth2Type;
  stravaRequest?: string;
  stravaLimit: {
    [key: string]: Date;
  };
  stravaCache: {
    [key: string]: number;
  };
};

export type StravaOAuth2Type = {
  token_type: "Bearer";
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    bio: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    premium: boolean;
    summit: boolean;
    created_at: string;
    updated_at: string;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    friend: any;
    follower: any;
  };
};

type UserDocument = User & Document;

const collName = createDBCollName("user");

export let userColl: Collection<UserDocument>;

export const userCollInit = async () => {
  const { collection } = await dbCollection<UserDocument>(DB__MOON42, collName);
  userColl = collection;

  await userColl.createIndex({ address: 1 });

  logger.info({ thread: "db", collection: collName, stage: "initial" });
};

export const createUser = async (user: User) => {
  logger.info({ thread: "db", collection: userColl.collectionName, action: "createUser", user });

  return await userColl.insertOne(user);
};

export const getUser = async (address: string): Promise<WithId<UserDocument>> => {
  const user = await userColl.findOne({ address });

  return user;
};

export const userJoinCampaign = async (
  campaign: WithId<CampaignBaseType>,
  address: string,
): Promise<{
  user: UserDocument;
  nft: {
    baseNft: moon42Base;
    nft: moon42NftType;
  };
  proof: string;
}> => {
  const user = await getUser(address);

  if (!user) {
    const newUser: User = {
      address,
      joined: [campaign._id],
      stravaLimit: {},
      stravaCache: {},
    };

    const id = (await createUser(newUser)).insertedId;
    user._id = id;
  }

  await userColl.updateOne({ address }, { $addToSet: { joined: campaign._id } });

  let baseNft = await isRegisteredNftExist(campaign, address);
  let nft: moon42NftType;
  if (baseNft) {
    nft = moon42BaseToftType(campaign, baseNft);
  }

  if (!baseNft) {
    const newNft = await createMoon42Medal(campaign, address);
    const created = await createNft(newNft.baseNft);
    newNft.baseNft._id = created.insertedId;
    baseNft = newNft.baseNft;
    nft = newNft.nft;
  }

  const proof = await createNftProof(baseNft);

  return { user: await getUser(address), nft: { baseNft, nft }, proof };
};

export const getCampaignsByUser = async (address: string) => {
  const user = await getUser(address);
  const campaigns = await getCampaignsById(user.joined);

  return campaigns;
};

export const createStravaRequest = async (address: string) => {
  const stravaRequest = randomstring.generate();
  await userColl.updateOne({ address }, { $set: { stravaRequest } });

  return stravaRequest;
};

export const updateStravaConnect = async (requestCode: string, stravaOAuth2: StravaOAuth2Type) => {
  await userColl.updateOne({ stravaRequest: requestCode }, { $set: { stravaOAuth2 } });
};

export const userDisconnectStrava = async (address: string) => {
  await userColl.updateOne({ address }, { $set: { stravaOAuth2: null } });
};

export const isStravaConnected = async (address: string) => {
  const user = await getUser(address);

  return !!user.stravaOAuth2;
};

export const userGetStravaProfile = async (address: string) => {
  const user = await getUser(address);

  return user.stravaOAuth2?.athlete;
};

export const getCampaignJoined = async (campaign: CampaignBaseType) => {
  const cursor = nftColl.aggregate([
    {
      $match: {
        campaignId: campaign._id,
      },
    },
    {
      $group: {
        _id: null,
        count: {
          $count: {},
        },
      },
    },
  ]);

  for await (const data of cursor) {
    return data.count;
  }
};

export const userGetDistance = async (address: string, campaign: CampaignBaseType) => {
  try {
    const user = await getUser(address);

    if (!user.stravaOAuth2) return 0;

    strava.config({
      access_token: user.stravaOAuth2.access_token,
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      redirect_uri: STRAVA_REDIRECT,
    });

    const limit = user.stravaLimit?.[campaign._id.toHexString()];
    if (limit) {
      const cache = user.stravaCache?.[campaign._id.toHexString()];

      if (!dayjs(limit).isAfter(dayjs().add(6, "hours"))) {
        return cache;
      }
    }

    const after = dayjs(campaign.startTime).unix();

    const filter: { access_token: string; after: number; before?: number } = { access_token: user.stravaOAuth2.access_token, after };
    if (campaign.hasEndTime) {
      filter.before = dayjs(campaign.endTime).unix();
    }

    const data = await strava.athlete.listActivities(filter);

    if (!data.length) {
      return 0;
    }

    const result = data.reduce((a: number, b: { distance: number }) => {
      return a + b.distance;
    }, 0);

    await userColl.updateOne(
      { address },
      {
        $set: {
          stravaLimit: {
            [campaign._id.toHexString()]: dayjs().add(6, "hours").toDate(),
          },
          stravaCache: {
            [campaign._id.toHexString()]: result,
          },
        },
      },
    );

    return result as number;
  } catch (error) {
    logger.error({ error });
    return 0;
  }
};
