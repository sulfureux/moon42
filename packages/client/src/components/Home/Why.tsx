import React from "react";
import Container from "../Layout/Container";
import Span from "../Span/Span";

const Card: React.FC<{ title: string; description: string; spanLabel: string }> = ({ spanLabel, title, description }) => {
  return (
    <div className="px-[24px] py-[16px] why-card max-w-[515px]">
      <div className="mb-[8px] text-[24px] font-bold">
        <Span>{spanLabel}</Span>
        {title}
      </div>
      <div className="font-light">{description}</div>
    </div>
  );
};

const Why: React.FC = () => {
  const reasons = [
    { spanLabel: "N", title: "etwork", description: "Connect with a global community of marathon enthusiasts and sponsors." },
    { spanLabel: "E", title: "nvironment", description: "Run for a cause. Every step you take contributes to a greener planet." },
    { spanLabel: "T", title: "echnology", description: "Embrace the future with our NFT medals." },
    { spanLabel: "42", title: "", description: "The iconic marathon distance of 42.195km is at the heart of our mission." },
  ];

  return (
    <section className="bg-[#F6F6F6] py-[100px]">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[100px]">
          <div>
            <img src="/images/why.png" alt="Why NET 42?" />
          </div>
          <div>
            <div className="mb-[24px] text-[42px] font-bold">
              {/* <img src="/images/why-text.png" alt="Why NET 42?" /> */}
              Why MOON42
            </div>

            <div className="flex flex-col gap-[16px]">
              {reasons.map((reason) => (
                <Card key={reason.title} spanLabel={reason.spanLabel} title={reason.title} description={reason.description} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Why;
