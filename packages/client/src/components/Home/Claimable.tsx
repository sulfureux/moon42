import { Button, Card, Grid } from "@mui/joy";
import { Exit } from "@styled-icons/boxicons-regular";
import { TravelExplore } from "@styled-icons/material-outlined";
import React, { useEffect, useState } from "react";
import { useAccount, useContractReads, useContractWrite, useWaitForTransaction } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import config from "../../config";
import { claimVerax, getCampaigns, getClaimed, selectCampaign } from "../../features/campaigns/reducer";
import { sleep } from "../../services/utils/sleep";
import Cointainer from "../Layout/Container";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import { setToast } from "../Toast/toastReducer";

const Claimable: React.FC<{ showWithoutNfts: boolean; campaignId?: string }> = ({ showWithoutNfts = true, campaignId = null }) => {
  const campaign = useAppSelector(selectCampaign);
  const dispatch = useAppDispatch();
  const campaignRedux = campaign;

  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(-1);
  const { addPopup, removeAll } = usePopups();

  const { address } = useAccount();

  useEffect(() => {
    dispatch(getClaimed());
  }, []);

  // start
  const {
    data: contract,
    isError: contractError,
    isLoading: contractLoading,
    isFetched: contractFetched,
  } = useContractReads({
    watch: true,
    contracts: [
      {
        ...config.contract,
        functionName: "totalSupply",
      },
      {
        ...config.contract,
        functionName: "tokenURI",
        args: [tokenId],
      },
    ],
  });

  const tokenURI = (contract?.[1].result || "") as string;

  const {
    data: mintData,
    write,
    status: mintStatus,
    isLoading: mintLoading,
  } = useContractWrite({
    address: config.contractAddress,
    abi: config.contract.abi,
    functionName: "safeMint",
    onError(error) {
      setMinting(false);

      dispatch(
        setToast({
          show: true,
          title: "",
          message: error.message.split("\n")?.[0] || error.message,
          type: "error",
        }),
      );
    },
  });

  const {
    data: txData,
    isError: txError,
    isLoading: txLoading,
    isFetched,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: mintData?.hash,
  });

  const mintSuccess = mintStatus === "success" && !!txData;
  const loading = minting || mintLoading || txLoading;
  const valid = !loading && address;
  const hasError = contractError || txError;

  useEffect(() => {
    if (mintSuccess && isFetched) {
      const nftId = parseInt(txData.logs[0].topics[3] as any, 16);
      setTokenId(nftId);
    }
  }, [mintSuccess, isFetched, txData]);

  useEffect(() => {
    if (tokenURI && tokenId != -1) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: `Submit transaction success!`,
          type: "success",
        }),
      );

      const fetchMetadata = () => {
        fetch(tokenURI)
          .then(async (res: any) => {
            const metadata = await res.json();

            setTimeout(() => {
              addPopup({
                Component: () => {
                  return (
                    <Popup className="bg-white">
                      <h2 className="text-center font-bold text-[24px] leading-[28px] ">Congratulation!</h2>
                      <div className="px-3 mb-20 mt-12">
                        <div className="flex flex-col justify-center items-center space-y-2">
                          <img className="w-[400px] h-[400px] border border-none rounded-2xl" src={metadata.image} alt="nftimg" />
                          <div className="text-[18px] font-semibold">{metadata.name}</div>
                        </div>
                      </div>
                      <div className="w-full flex justify-between items-center !text-white">
                        <button
                          onClick={() => {
                            window.open(`${config.explorerURL}/${mintData?.hash}`, "_blank", "noopener,noreferrer");
                          }}
                          className="flex-1 bg-[#8d1cfe] max-w-[220px] text-[16px] leading-[32px] font-bold px-6 py-2 border border-none rounded-3xl flex space-x-2 justify-center items-center"
                        >
                          <p>View on explorer</p>
                          <TravelExplore size={20} />
                        </button>
                        <button
                          onClick={() => removeAll()}
                          className="flex-1 bg-[#8d1cfe] max-w-[200px] text-[16px] leading-[32px] font-bold px-6 py-2 border border-none rounded-3xl flex space-x-2 justify-center items-center"
                        >
                          <p>Exit</p>
                          <Exit size={20} />
                        </button>
                      </div>
                    </Popup>
                  );
                },
                removeCallback: () => {
                  setMinting(false);
                  setTokenId(-1);
                },
              });

              setMinting(false);

              setTimeout(() => {
                dispatch(getCampaigns());
              }, 2000);
            }, 3000);

            return;
          })
          .catch(() => {
            sleep(2000).then(() => {
              fetchMetadata();
            });
          });
      };

      fetchMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPopup, dispatch, removeAll, tokenURI]);

  //  end

  let claimedNft = false;

  if (!address) return null;

  return (
    <section className="py-[50px]">
      <Cointainer>
        {showWithoutNfts ? (
          <div className="mb-[16px]">
            <div className="text-[42px] font-bold text-center">Join running campaigns</div>
            <div className="text-[16px] text-center">Become part of the MOON42 runner community</div>
          </div>
        ) : (
          ""
        )}

        {campaign.campaigns.length ? (
          <div className="flex gap-4">
            {campaign.campaigns.map((campaign) => {
              if (campaignId) {
                if (campaignId !== campaign._id) return null;
              }

              campaign.claim.claimedNfts.map((claimed) => {
                if (claimed.campaignId == campaign._id) {
                  claimedNft = true;
                }
              });

              return campaign.claim.nfts.map((nft) => {
                const claimedVerax = campaignRedux.claimed.find((item) => item.address.toLocaleLowerCase() === address!.toLocaleLowerCase() && item.campaignId == campaign._id!);

                return (
                  <Grid key={nft._id} xs={12} sm={6} md={3} display="flex" alignItems="center" minHeight={180}>
                    <Card sx={{ width: 320 }}>
                      <div className="truncate font-bold text-[16px]">{nft.data.name}</div>
                      <img src={nft.data.image} alt={nft.data.name} />

                      <div className="flex items-center justify-center w-full py-[15px]">
                        <div className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Medal</div>
                      </div>

                      <div>
                        <div className="flex flex-col gap-2">
                          {claimedNft ? (
                            <span className="text-center items-center rounded-[18px] bg-green-100 px-4 py-1 text-[12px] font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                              Claimed {config.isTestnet ? "Linea Goerli" : "Polygon ZK"} Moon42 Cert NFT
                            </span>
                          ) : (
                            <Button
                              variant="solid"
                              size="md"
                              color="primary"
                              sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                              onClick={async () => {
                                setMinting(true);

                                if (!valid) return;

                                try {
                                  write({
                                    args: [nft.campaignId, nft.type, nft._id, nft.metadata, nft.proof],
                                  });
                                } catch (error) {
                                  console.error(error);
                                  setMinting(false);
                                }
                              }}
                              loading={minting}
                            >
                              Claim {config.isTestnet ? "Linea Goerli" : "Polygon ZK"} Moon42 Cert NFT
                            </Button>
                          )}

                          {claimedVerax ? (
                            <span className="text-center items-center rounded-[18px] bg-green-100 px-4 py-1 text-[12px] font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                              <a href="https://explorer.ver.ax/linea-testnet/attestations/my_attestations" target="_blank">
                                Claimed Linea Verax Attestation
                              </a>
                            </span>
                          ) : (
                            <Button
                              variant="solid"
                              size="md"
                              color="primary"
                              sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                              onClick={async () => {
                                setMinting(true);

                                if (!valid) return;

                                try {
                                  dispatch(
                                    claimVerax({
                                      id: campaign._id!,
                                      callback: () => {
                                        dispatch(getClaimed());
                                      },
                                    }),
                                  );
                                } catch (error) {
                                  console.error(error);
                                  setMinting(false);
                                }
                              }}
                              loading={minting}
                            >
                              Claim Linea Verax Attestation
                            </Button>
                          )}

                          <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                            onClick={async () => {
                              setMinting(true);

                              if (!valid) return;

                              try {
                                // TO-DO
                                dispatch(
                                  setToast({
                                    show: true,
                                    title: "",
                                    message: "Coming soon",
                                    type: "info",
                                  }),
                                );
                                setMinting(false);
                              } catch (error) {
                                console.error(error);
                                setMinting(false);
                              }
                            }}
                            loading={minting}
                          >
                            Claim Cert on Mina
                          </Button>

                          <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                            onClick={async () => {
                              setMinting(true);

                              if (!valid) return;

                              try {
                                // TO-DO
                                dispatch(
                                  setToast({
                                    show: true,
                                    title: "",
                                    message: "Coming soon",
                                    type: "info",
                                  }),
                                );
                                setMinting(false);
                              } catch (error) {
                                console.error(error);
                                setMinting(false);
                              }
                            }}
                            loading={minting}
                          >
                            Claim Cert NFT on Polygon ID
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Grid>
                );
              });
            })}
          </div>
        ) : (
          ""
        )}
      </Cointainer>
    </section>
  );
};

export default Claimable;
