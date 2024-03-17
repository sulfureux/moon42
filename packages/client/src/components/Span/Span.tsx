import React, { PropsWithChildren } from "react";

const Span: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <span className={`text-[#BE513F] ${className}`}>{children}</span>;
};

export default Span;
