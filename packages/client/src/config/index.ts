import abi from "../abi/Moon42NFT.json";

const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS! as `0x${string}`;
const apiURL = import.meta.env.VITE_API_URL! as string;

const explorerURL = import.meta.env.VITE_EXPLORER_URL! as string;

const networkType = import.meta.env.VITE_NETWORK_TYPE! as string;

const web3StorageAPIToken = import.meta.env.VITE_WEB3_STORAGE_API_TOKEN! as string;

const walletConnectProfileId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID! as string;

const config = {
  contractAddress,
  contract: {
    address: contractAddress,
    abi: abi as any,
  },
  explorerURL,
  apiURL,
  networkType,
  isTestnet: networkType === "testnet",
  web3StorageAPIToken,
  walletConnectProfileId,
};

export default config;
