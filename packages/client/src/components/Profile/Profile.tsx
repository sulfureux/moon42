import { Close } from "@styled-icons/material-outlined";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useContractReads, useDisconnect, usePublicClient } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import config from "../../config";
import { clearAuth, disconnectStrava, selectAuth, verify } from "../../features/authentication/reducer";
import Button from "../Button/Button";
import ConnectStrava from "../Button/ConnectStrava";
import Campaigns from "../Campaign/Campaigns";
import Claimable from "../Home/Claimable";
import Container from "../Layout/Container";

const Profile: React.FC = () => {
  const { address: addressParam } = useParams();
  const auth = useAppSelector(selectAuth);
  const { disconnectAsync } = useDisconnect();
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isMe = addressParam == address;

  const logout = async () => {
    try {
      await disconnectAsync();
    } catch (error) {}

    try {
      // await auth.web3Auth.logout();
    } catch (error) {}

    try {
      dispatch(clearAuth());
    } catch (error) {}
  };

  const { data } = useContractReads({
    watch: true,
    contracts: [
      {
        ...config.contract,
        functionName: "balanceOf",
        args: [addressParam],
      },
    ],
  });

  const totalNfts = data?.[0].result;

  useEffect(() => {
    const run = async () => {
      const tokenURIs: string[] = [];

      for (let i = 0; i < Number(totalNfts); i++) {
        const id = await publicClient.readContract({
          ...config.contract,
          functionName: "tokenOfOwnerByIndex",
          args: [addressParam, i],
        });

        const tokenURI = await publicClient.readContract({
          ...config.contract,
          functionName: "tokenURI",
          args: [id],
        });

        tokenURIs.push(tokenURI as unknown as string);
      }

      const data = await Promise.all(
        tokenURIs.map(async (uri) => {
          const response = await axios.get(uri);
          return response.data;
        }),
      );

      setLoading(false);

      setNfts(data);
    };
    if (totalNfts) {
      run();
    } else {
      setLoading(false);
    }
  }, [totalNfts]);

  return (
    <>
      <section className="flex-1">
        <Container>
          <div>
            <div className="text-[28px]">User profile</div>
            <div>
              Address: <span className="text-[24px] font-bold"> {addressParam}</span>
              {isMe ? (
                <div className="mt-1">
                  <Button onClick={logout}>Logout</Button>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="mt-4">
              {auth.maskProfile?.map((item, index) => {
                return <div key={index}>{item.identity}</div>;
              })}
            </div>

            {isMe ? (
              <div className="mt-12">
                <div className="flex items-center gap-2">
                  <ConnectStrava />{" "}
                  {auth.isStravaConnected ? (
                    <div
                      className="inline-flex items-center rounded-full bg-red-50 p-2 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 cursor-pointer"
                      onClick={() => {
                        dispatch(
                          disconnectStrava({
                            callback: () => {
                              dispatch(verify());
                            },
                          }),
                        );
                      }}
                    >
                      <Close height={16} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {auth.isStravaConnected ? (
                  <div>
                    Strava username: <span className="font-bold">{auth.stravaProfile?.username}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="mb-[16px] mt-[60px]">
            <Claimable showWithoutNfts={false} />
          </div>

          <div className="mb-[16px] mt-[60px]">
            <div className="text-[32px] font-bold mb-4">MOON NFTs</div>

            {!totalNfts ? (
              <div className="flex items-center justify-center min-h-[300px] bg-[#fefefe] rounded-lg border-dashed border-[2px] border-[#929292]">
                {loading ? <div className="text-[24px] font-bold">Loading...</div> : <div className="text-[24px] font-bold">Have no nfts yet</div>}
              </div>
            ) : totalNfts ? (
              !nfts.length ? (
                <div className="flex items-center justify-center min-h-[300px] bg-[#fefefe] rounded-lg border-dashed border-[2px] border-[#929292]">
                  <div className="text-[24px] font-bold">Loading...</div>
                </div>
              ) : (
                <section className="bg-[#F6F6F6] px-6 py-[56px]">
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
                    {nfts.map((nft, index) => {
                      return (
                        <div key={index}>
                          <div className="shadow-three mb-10 rounded-lg bg-white p-4 pb-6">
                            <div className="mb-6 w-full overflow-hidden rounded-md">
                              <img src={nft.image} alt="card image" className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="px-[10px]">
                              <h3 className="text-center font-bold text-[14px] truncate">{nft.name}</h3>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            ) : (
              ""
            )}
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <div className="mb-[16px] mt-[50px]">
            <div className="text-[32px] font-bold">View more running campaigns</div>
          </div>
        </Container>
      </section>
      <Campaigns />
    </>
  );
};

export default Profile;
