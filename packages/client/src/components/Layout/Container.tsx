import React, { PropsWithChildren } from "react";

const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto px-6 container">{children}</div>;
};

export default Container;
