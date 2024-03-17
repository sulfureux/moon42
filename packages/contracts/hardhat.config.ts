import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
import "hardhat-abi-exporter";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config({ path: __dirname + "/.env" });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 2_147_483_647,
  },
  networks: {
    linea: {
      // https://lineascan.build/
      chainId: 59144,
      url: "https://rpc.linea.build",
      accounts: [process.env.PRIVATE_KEY!],
      timeout: 2_147_483_647,
    },
    lineaTestnet: {
      // https://goerli.lineascan.build/
      chainId: 59140,
      url: "https://linea-goerli.blockpi.network/v1/rpc/public",
      accounts: [process.env.PRIVATE_KEY!],
      timeout: 2_147_483_647,
    },
    polygonZK: {
      // https://zkevm.polygonscan.com/
      chainId: 1101,
      url: "https://polygon-zkevm-mainnet.public.blastapi.io",
      accounts: [process.env.PRIVATE_KEY!],
      timeout: 2_147_483_647,
    },
    polygonZKTestnet: {
      // https://testnet-zkevm.polygonscan.com/
      chainId: 1442,
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.PRIVATE_KEY!],
      timeout: 2_147_483_647,
    },
  },
  abiExporter: {
    path: "abi",
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
  },
};

export default config;
