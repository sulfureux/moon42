import React, { lazy, Suspense } from "react";

export const create =
  (Inner: React.LazyExoticComponent<React.FC>, Loading?: React.ReactNode): React.FC =>
  () => {
    if (Loading) return <Suspense fallback={Loading}>{<Inner />}</Suspense>;
    return <Suspense fallback={<div></div>}>{<Inner />}</Suspense>;
  };

export const LazyHome = create(lazy(() => import("../../pages/home")));
export const LazyCampaigns = create(lazy(() => import("../../pages/campaigns")));
export const LazyCampaign = create(lazy(() => import("../../pages/campaign")));
export const LazyProfile = create(lazy(() => import("../../pages/profile")));
export const LazyCreateCampaign = create(lazy(() => import("../../pages/admin/createCampaign")));
export const LazyUserTracks = create(lazy(() => import("../../pages/admin/userTracks")));
export const LazyAdmin = create(lazy(() => import("../../pages/admin/index")));
