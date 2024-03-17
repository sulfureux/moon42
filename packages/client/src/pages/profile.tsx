import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import ProfileComponent from "../components/Profile/Profile";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Profile: React.FC = () => {
  return <ProfileComponent />;
};

export default Profile;
