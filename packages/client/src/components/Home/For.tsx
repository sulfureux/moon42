import React from "react";
import Container from "../Layout/Container";

const For: React.FC = () => {
  const MOON42for = [
    { title: "Social Causes", description: "We donate a large part of our earnings to social causes. Run for a reason." },
    { title: "Eco-friendly", description: "Our focus is on eco-friendly marathons, aiming for a sustainable future." },
    { title: "Digital Empowerment", description: "We use tech to connect runners and sponsors, enhancing collaboration for good causes." },
    { title: "Global Community", description: "MOON42 unites a global community, magnifying our positive impact together." },
  ];

  return (
    <section className="pt-[100px] pb-[166px]">
      <Container>
        <div className="text-center mb-[60px]">
          <div className="mb-[16px] text-[42px] font-bold">Run for Two: Us & Earth</div>
          <div className="text-[20px] max-w-[1040px] mx-auto">
            At MOON42, we believe in the power of community and the importance of our planet. Every marathon is a step towards a better world
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOON42for.map((item, index) => (
            <div key={item.title} className="text-center flex flex-col justify-center items-center">
              <div className="flex items-center justify-center mb-[26px]">
                <img src={`/images/for-${index + 1}.png`} alt={item.title} />
              </div>
              <div className="text-[18px] font-bold mb-[8px]">{item.title}</div>
              <div className="max-w-[80%]">{item.description}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default For;
