import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/authentication/reducer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const AdminLayout: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isVerifyInit && !auth.isAdmin) {
      navigate("/");
    }
  }, [auth]);

  return (
    <div className="mx-auto px-6 container flex flex-col justify-between gap-3 min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AdminLayout;
