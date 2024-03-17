import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import React from "react";
import { Link } from "react-router-dom";

const Admin: React.FC = () => {
  return (
    <List
      orientation="horizontal"
      variant="outlined"
      sx={{
        flexGrow: 0,
        mx: "auto",
        "--ListItemDecorator-size": "48px",
        "--ListItem-paddingY": "1rem",
        borderRadius: "sm",
      }}
    >
      <ListItem>
        <Link to="/admin/create" className="flex items-center">
          <ListItemDecorator>
            <Avatar size="sm" src="/static/images/avatar/1.jpg" />
          </ListItemDecorator>
          Create Campaign
        </Link>
      </ListItem>
      {/* <ListDivider inset="gutter" /> */}
    </List>
  );
};

export default Admin;
