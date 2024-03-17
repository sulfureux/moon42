import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { connectStrava, selectAuth } from "../../features/authentication/reducer";
import { genStravaLoginURL } from "../../services/strava";
import { openInCurrentTab } from "../../services/utils/direct";
import Button from "./Button";

const ConnectStrava = () => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();

  const connect = () => {
    dispatch(
      connectStrava({
        callback: async (data) => {
          const link = genStravaLoginURL(data);

          openInCurrentTab(link);
        },
      }),
    );
  };

  if (auth.isStravaConnected) {
    return (
      <span className="inline-flex items-center rounded-[18px] bg-green-100 px-4 py-1 text-[14px] font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
        Strava Connected
      </span>
    );
  } else {
    return <Button onClick={connect}>Connect Strava</Button>;
  }
};

export default ConnectStrava;
