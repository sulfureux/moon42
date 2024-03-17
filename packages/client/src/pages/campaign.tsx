import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import CampaignDetail from "../components/Campaign/CampaignDetail";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Campaign: React.FC = () => {
  return <CampaignDetail />;
};

export default Campaign;
