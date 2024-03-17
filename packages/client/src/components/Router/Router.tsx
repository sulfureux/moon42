import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import Layout from "../Layout/Layout";
import RootLayout from "../Layout/RootLayout";
import { LazyAdmin, LazyCampaign, LazyCampaigns, LazyCreateCampaign, LazyHome, LazyProfile, LazyUserTracks } from "./elements";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<LazyHome />} />
            <Route path="/campaigns" element={<LazyCampaigns />} />
            <Route path="/campaign/:id" element={<LazyCampaign />} />
            {/* <Route path="/profile" element={<UserLayout />}> */}
            <Route path="/profile/:address" element={<LazyProfile />} />
            {/* </Route> */}
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin" element={<LazyAdmin />} />
            <Route path="/admin/create" element={<LazyCreateCampaign />} />
            <Route path="/admin/tracks" element={<LazyUserTracks />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
