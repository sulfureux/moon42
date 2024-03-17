import dayjs from "dayjs";
import { WithId } from "mongodb";

export type Track = { track: number; image: string };

export const rawToCampaignType = (raw: RawCampaignType): CampaignType => {
  const {
    _id,

    name,
    description,

    image,
    banner,
    registeredImage,
    unfinishedImage,
    finishedImage,

    registerTime,
    startTime,
    hasEndTime,
    endTime,

    trackable,
    standardCode,
    tracks,
    stravaData,

    nftId,

    claim,
    joined,
  } = raw;

  const campaign = {
    _id,
    name,
    description,

    image,
    banner,
    registeredImage,
    unfinishedImage,
    finishedImage,

    registerTime: dayjs(registerTime),
    startTime: dayjs(startTime),
    hasEndTime,
    endTime: dayjs(endTime),

    trackable,
    standardCode,
    tracks,
    stravaData,

    nftId,

    claim,
    joined: joined || 0,
  };

  return campaign;
};

export type RawCampaignType = {
  _id?: string;

  name: string;
  description: string;

  image: string;
  banner: string;

  registeredImage: string;
  unfinishedImage: string;
  finishedImage?: string;

  registerTime: string;
  startTime: string;
  hasEndTime: boolean;
  endTime?: string;

  trackable: boolean;
  standardCode: string;
  tracks: Track[];
  stravaData: boolean;

  nftId?: number;
} & UserState &
  ParticipantState;

export type CampaignType = {
  _id?: string;

  name: string;
  description: string;

  image: string;
  banner: string;

  registeredImage: string;
  unfinishedImage: string;
  finishedImage?: string;

  registerTime: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  hasEndTime: boolean;
  endTime?: dayjs.Dayjs;

  trackable: boolean;
  standardCode: string;
  tracks: Track[];
  stravaData: boolean;

  nftId?: number;
} & UserState &
  ParticipantState;

export enum UserStateStatus {
  NOT_START_YET = "not_start_yet",
  AVAILABLE = "available",
  REGISTERED = "registered",
  ENDED = "ended",
  CLAIMABLE = "claimable",
  UNFINISHED = "unfinished",
  FINISHED = "finished",
}

export type UserState = {
  claim: ClaimableType;
};

export type ParticipantState = {
  joined: number;
};

export const day0 = dayjs(0);

export const emptyCampaign: CampaignType = {
  name: "",
  description: "",

  image: "",
  banner: "",
  registeredImage: "",
  unfinishedImage: "",

  registerTime: day0,
  startTime: day0,
  hasEndTime: false,

  trackable: false,
  stravaData: false,
  standardCode: "",
  tracks: [],

  claim: {
    status: UserStateStatus.AVAILABLE,
    nfts: [],
    claimedNfts: [],
    registeredNft: undefined,
    registeredNftNotClaimed: undefined,
    distance: 0,
  },
  joined: 0,
};

export type CampaignReducer = {
  isLoading: boolean;
  isInit: boolean;

  campaigns: CampaignType[];
  claimed: Claimed[];
};

export const defaultCampaignReducer: CampaignReducer = {
  isLoading: true,
  isInit: false,

  campaigns: [],
  claimed: [],
};

export type UserTrack = {
  address: string;
  track: number;
};

export type UserTracks = UserTrack[];

export type MOON42NftType = {
  name: string;
  description: string;
  image: string;

  attributes: [
    {
      trait_type: "campaign_id";
      value: string;
    },
    { trait_type: "participant"; value: string },
    { trait_type: "created_date"; value: string },
    { trait_type: "type"; value: number },
    { trait_type: "track"; value: number }?,
  ];

  seller_fee_basis_points: 0;

  compiler: "moon42.run";
  external_url: "https://moon42.run";
};

export type MOON42Base = {
  campaignId: string;
  _id?: string;
  owner: string;

  participant: string;
  createdDate: Date;
  type: 0 | 1; // registered, track
  trackIndex?: number;
  track?: number;

  metadata: string;

  nftId?: string;

  data: MOON42NftType;
  proof: string;
};

export type User = {
  address: string;
  joined: string[];
};

export type MintProof = {
  user: User;
  nft: {
    baseNft: MOON42Base;
    nft: MOON42NftType;
  };
  proof: string;
};

export type ClaimableType = {
  campaign?: WithId<CampaignType>[];
  status: UserStateStatus;
  nfts: WithId<MOON42Base>[];
  claimedNfts: WithId<MOON42Base>[];
  registeredNft?: WithId<MOON42Base>;
  registeredNftNotClaimed?: WithId<MOON42Base>;
  distance: 0;
};

export type Claimed = {
  address: string;
  campaignId: string;
  txHash: string;
  type: string;
  url: "";
  _id: string;
};
