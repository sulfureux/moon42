import { InjectedConnector } from "@wagmi/core";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { defineChain } from "viem";
import { lineaTestnet, polygonZkEvm } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useAppSelector } from "../../app/hooks";
import config from "../../config";
import { selectAuth } from "../../features/authentication/reducer";
import "../../styles/main.scss";
import PopupProvider from "../Popup/PopupProvider";
import Router from "../Router/Router";
import Toast from "../Toast/Toast";

// const lineaChain = {
//   ...lineaTestnet,
//   rpcUrls: {
//     ...lineaTestnet.rpcUrls,
//     public: { ...lineaTestnet.rpcUrls.public, webSocket: ["wss://linea-goerli.blockpi.network/v1/ws/639630385b4101bcd6de361b478cb282386edd65"] },
//     default: { ...lineaTestnet.rpcUrls.default, webSocket: ["wss://linea-goerli.blockpi.network/v1/ws/639630385b4101bcd6de361b478cb282386edd65"] },
//   },
// };

export const lineaChain1 = defineChain({
  id: lineaTestnet.id,
  name: lineaTestnet.name,
  network: lineaTestnet.network,
  nativeCurrency: lineaTestnet.nativeCurrency,
  rpcUrls: {
    default: {
      http: ["https://linea-goerli.blockpi.network/v1/rpc/639630385b4101bcd6de361b478cb282386edd65"],
      webSocket: ["wss://linea-goerli.blockpi.network/v1/ws/639630385b4101bcd6de361b478cb282386edd65"],
    },
    public: {
      http: ["https://linea-goerli.blockpi.network/v1/rpc/639630385b4101bcd6de361b478cb282386edd65"],
      webSocket: ["wss://linea-goerli.blockpi.network/v1/ws/639630385b4101bcd6de361b478cb282386edd65"],
    },
  },
  blockExplorers: lineaTestnet.blockExplorers,
  contracts: lineaTestnet.contracts,
  testnet: true,
});

export const rootTestChain = lineaChain1;

const testnetChains = [lineaChain1];
const mainnetChains = [polygonZkEvm];
const configChains = config.isTestnet ? testnetChains : mainnetChains;

const App: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const { chains, publicClient, webSocketPublicClient } = configureChains(configChains as any, [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_KEY!,
    }),
    publicProvider(),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new Web3AuthConnector({
        chains,
        options: {
          web3AuthInstance: auth.web3Auth,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: config.walletConnectProfileId,
          showQrModal: true,
        },
      }),
      new InjectedConnector({ chains, options: { name: "Injected", shimDisconnect: true } }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <PopupProvider>
        <Router />
        <Toast />
      </PopupProvider>
    </WagmiConfig>
  );
};

export default App;
