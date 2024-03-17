import React from "react";
import Connect from "../Button/Connect";
import Container from "../Layout/Container";

const Join: React.FC = () => {
  return (
    <section className="min-h-[600px] bg-[url('/images/join.png')] bg-cover bg-bottom pt-[175px] pb-[323px]">
      <Container>
        <div className="join p-[36px] text-center text-[42px] font-bold max-w-[833px] mx-auto">
          <div>Join MOON42 today</div>

          <Connect />
        </div>
      </Container>
    </section>
  );
};

export default Join;
