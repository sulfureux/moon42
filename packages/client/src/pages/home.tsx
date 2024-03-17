import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import Campaigns from "../components/Campaign/Campaigns";
import For from "../components/Home/For";
import Hero from "../components/Home/Hero";
import Join from "../components/Home/Join";
import Life from "../components/Home/Life";
import Medal from "../components/Home/Medal";
import Sponsorship from "../components/Home/Sponsorship";
import Why from "../components/Home/Why";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Why />
      <Life />
      {/* <Claimable showWithoutNfts={true} /> */}
      <Campaigns />
      <Medal />
      <Sponsorship />
      <For />
      <Join />
    </>
  );
};

export default Home;
