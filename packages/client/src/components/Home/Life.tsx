import React from "react";
import Container from "../Layout/Container";

const Life: React.FC = () => {
  return (
    <section className="pb-[50px] pt-[50px]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          <div className="col-span-1 lg:col-span-2  text-center">
            <img src="/images/life.png" alt="" width={650} className="mx-auto" />
          </div>
          <div className="text-[20px] flex flex-col gap-4 col-span-1 lg:col-span-4">
            <div className="grid grid-cols-6 items-center gap-2">
              <div></div>
              <div className="col-span-5">Deployed our EVM Smart Contracts on Linea Goerli, Polygon ZK</div>
            </div>

            <div className="grid grid-cols-6 items-center gap-2">
              <div></div>
              <div className="col-span-5">You can claim NFT Medals on Linea Goerli, Polygon ZK</div>
            </div>

            <div className="grid grid-cols-6 items-center gap-2">
              <div></div>
              <div className="col-span-5">You can claim and prove that you have Moon42-Verax certificate on Linea</div>
            </div>

            <div className="grid grid-cols-6 items-center gap-2">
              <div></div>
              <div className="col-span-5">You can claim and prove that you have Moon42 certificate on your Polygon ID</div>
            </div>

            <div className="grid grid-cols-6 items-center gap-2">
              <div></div>
              <div className="col-span-5">You can claim and prove that you have Moon42 certificate on Mina Protocol, the World's First ZK Blockchain</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Life;
