import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import Campaign from "./campaign";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Campaigns: React.FC = () => {
  return <Campaign />;
};

export default Campaigns;
