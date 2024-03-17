import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/authentication/reducer";
import Logo from "../Common/Logo";
import Container from "../Layout/Container";
// import Discord from "../Icon/Discord";
// import Twitter from "../Icon/Twitter";

const Footer: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  return (
    <footer className="py-[30px]">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex gap-2 items-center">
              <Logo />
            </Link>

            {auth.isAdmin && (
              <div>
                <Link to="/admin/create">Create campaign</Link>
              </div>
            )}
          </div>
          <div className="flex gap-[16px]"></div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
