import { ethers } from "ethers";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAuth, getMaskProfile, getStravaProfile, selectAuth, setAddress, setProvider, setToken, verify } from "../../features/authentication/reducer";
import { getCampaigns } from "../../features/campaigns/reducer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const auth = useAppSelector(selectAuth);

  useEffectOnce(() => {
    dispatch(setProvider(new ethers.providers.Web3Provider(auth.web3Auth.provider!)));
  });

  useEffect(() => {
    if (isConnected) {
      dispatch(setAddress(address!));

      auth.web3Auth.authenticateUser().then((token) => {
        dispatch(setToken(token.idToken));
        dispatch(getCampaigns());
      });
    } else {
      dispatch(clearAuth());
      dispatch(getCampaigns());
    }
  }, [isConnected]);

  useEffect(() => {
    if (auth.token) {
      dispatch(verify());
      dispatch(getStravaProfile());
      dispatch(getMaskProfile());
    }
  }, [auth.token]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
