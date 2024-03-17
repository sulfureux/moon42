import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <ScrollToTop />
    </>
  );
};

export default RootLayout;
