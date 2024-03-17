import { Link } from "react-router-dom";
import { useAccount, useConnect } from "wagmi";
import Button from "./Button";

const Connect = () => {
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors } = useConnect();

  const connect = async () => {
    wagmiConnect({ connector: connectors[0] });
  };

  const Profile = () => {
    if (isConnected) {
      return (
        <Link to={`/profile/${address}`}>
          <Button>View Profile</Button>
        </Link>
      );
    } else {
      return <Button onClick={connect}>Connect Wallet</Button>;
    }
  };

  return Profile();
};

export default Connect;
