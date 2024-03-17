import { getTotalSupply, handleNftId, updateNftOwner } from "../models/moon42";
import logger from "../utils/log";
import sleep from "../utils/sleep";

export const scanNFTs = async () => {
  logger.info({ thread: "scan", message: "scan NFTs started" });

  const total = await getTotalSupply();

  logger.info({ thread: "scan", message: "scan NFTs total: " + total });

  for (let index = 0; index < total; index++) {
    await handleNftId(index);
    await updateNftOwner(index);

    await sleep(500);
  }
};
