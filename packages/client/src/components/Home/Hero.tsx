import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Connect from "../Button/Connect";
import Span from "../Span/Span";

const Hero: React.FC = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  return (
    <section className="pt-[40px] pb-[100px]">
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center max-w-[1040px] mx-auto px-[24px]">
        <div className="flex flex-col gap-[23px] w-[420px] max-w-[100%] mb-[24px]">
          <div className="text-[26px]">
            MOON42: The Future of <br /> <Span className="font-bold text-[42px]">Marathon Rewards</Span>
          </div>
          <div className="text-[20px] font-light">
            Where marathon passion meets tech innovation. At MOON42, we're redefining rewards and connecting sponsors to causes. Join us in shaping the future of marathon running
          </div>
          <div>
            <div className="flex gap-[16px] items-center">
              <Connect />
            </div>
          </div>
        </div>
        <div className="flex">
          <img src="/images/hero.png" alt="Hero" className="block items-end w-[530px]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
