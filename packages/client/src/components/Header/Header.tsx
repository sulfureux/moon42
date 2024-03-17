import React from "react";
import { Link } from "react-router-dom";
import { polygonZkEvm } from "viem/chains";
import { useAccount, useConnect } from "wagmi";
import config from "../../config";
import { shortTruncateEthAddress } from "../../services/utils/address";
import { rootTestChain } from "../App/App";
import Button from "../Button/Button";
import ConnectStrava from "../Button/ConnectStrava";
import Logo from "../Common/Logo";
import Container from "../Layout/Container";

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors } = useConnect();

  const connect = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: config.isTestnet ? "0xe704" : "0x44d" }],
        });

        wagmiConnect({ connector: connectors[0] });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [config.isTestnet ? rootTestChain : polygonZkEvm],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);

        wagmiConnect({ connector: connectors[0] });
      }
    } else {
      wagmiConnect({ connector: connectors[0] });
    }
  };

  const Profile = () => {
    if (isConnected) {
      return (
        <div className="flex gap-3 md:gap-6 items-center justify-center flex-col-reverse md:flex-row">
          <a href="https://faucet.goerli.linea.build/" target="_blank" rel="noopener noreferrer" className="underline">
            Faucet Linea Goerli
          </a>
          <ConnectStrava />
          {/* <SponsorCampaign /> */}

          <Link to={`/profile/${address}`}>
            <Button>Profile {shortTruncateEthAddress(address!)}</Button>
          </Link>
        </div>
      );
    } else {
      return <Button onClick={connect}>Connect Wallet</Button>;
    }
  };

  return (
    <header className="py-[30px] md:py-[60px]">
      <Container>
        <div className="flex justify-between">
          <div className="flex gap-3 md:gap-6 items-center justify-center flex-col md:flex-row">
            <Link to="/" className="flex gap-2 items-center">
              <Logo />
            </Link>
          </div>

          <div className="flex">{Profile()}</div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
