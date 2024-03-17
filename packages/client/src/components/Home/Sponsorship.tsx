import React from "react";

const Sponsorship: React.FC = () => {
  return (
    <section className="bg-[#F6F6F6] py-[100px]">
      <div className="flex flex-col lg:flex-row gap-[103px] mx-auto max-w-[1040px] px-[26px] items-center justify-center">
        <div className="">
          <img src="/images/sponsorship.png" alt="Sponsorship" />
        </div>
        <div className="max-w-[500px]">
          <div className="mb-[43px]">
            <div className="text-[32px] font-bold mb-[16px]">Sponsorship Can Be Anonymous With Mina ZK Technology</div>
            <div className="text-[20px]">With MOON42, sponsors don't just fund marathons. They contribute to a larger cause</div>
          </div>
          <div>
            <div className="mb-[23px]">
              <div className="text-[#BE513F] font-bold mb-[4px]">Transparent Tracking</div>
              <div className="text-[16px] font-light">Sponsors can easily track their contributions based on the NFT medals.</div>
            </div>
            <div>
              <div className="text-[#BE513F] font-bold mb-[4px]">Support Social Causes</div>
              <div className="text-[16px] font-light">A portion of the sponsorship goes directly to social causes, making every marathon a run for humanity.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsorship;
