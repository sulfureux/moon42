import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";
import React from "react";
import { Link } from "react-router-dom";
import CreateCampaign from "../../components/Campaign/Create";

const CreateCampaignScreen: React.FC = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumbs">
        {[
          { title: "Home", url: "/" },
          { title: "Admin", url: "/admin" },
        ].map((item) => (
          <Link key={item.title} color="neutral" to={item.url}>
            {item.title}
          </Link>
        ))}
        <Typography>Create Campaign</Typography>
      </Breadcrumbs>
      <CreateCampaign />
    </>
  );
};

export default CreateCampaignScreen;
