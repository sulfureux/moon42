import { ethers } from "ethers";
import { getBlockchainNftMedalId, handleNftId, updateNftId } from "../models/moon42";
import logger from "../utils/log";
import abi from "../abi/Moon42NFT.json";
import sleep from "../utils/sleep";
import { NFT_CONTRACT_ADDRESS, RPC_WSS } from "../config";

export const listenerInit = () => {
  logger.info({ thread: "listener", message: "listener started" });

  const contract = NFT_CONTRACT_ADDRESS;

  if (!contract) {
    logger.info({ thread: "listener", data: "have no contract yet" });
    return;
  }

  const wssProvider = new ethers.providers.WebSocketProvider(RPC_WSS);
  const wss = new ethers.Contract(contract, abi, wssProvider);

  wssProvider._websocket.on("close", async () => {
    wssProvider._websocket.terminate();
    await sleep(500);

    listenerInit();
  });

  wss.on("Transfer", (_, to, value: ethers.BigNumber) => {
    const nftId = value.toNumber();

    getBlockchainNftMedalId(nftId).then((medalId) => {
      updateNftId(medalId, nftId, to);
    });

    logger.info("transfer listener", nftId);

    handleNftId(nftId);
  });
};
