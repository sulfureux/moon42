import { Button } from "@mui/joy";
import { Step, StepLabel, Stepper } from "@mui/material";
import { Exit } from "@styled-icons/boxicons-regular";
import { TravelExplore } from "@styled-icons/material-outlined";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import { useAccount, useContractReads, useContractWrite, useWaitForTransaction } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import config from "../../config";
import { getCampaigns, registerCampaign, selectCampaign } from "../../features/campaigns/reducer";
import { sleep } from "../../services/utils/sleep";
import Connect from "../Button/Connect";
import Claimable from "../Home/Claimable";
import Container from "../Layout/Container";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import { setToast } from "../Toast/toastReducer";
import Campaigns from "./Campaigns";

const CampaignDetail: React.FC = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();

  const dispatch = useAppDispatch();

  const campaign = useAppSelector(selectCampaign);
  const current = campaign.campaigns.find((item) => item._id === id);

  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(-1);
  const { addPopup, removeAll } = usePopups();

  useEffectOnce(() => {
    dispatch(getCampaigns());
  });

  const marks = [
    {
      value: 0,
      label: `${current?.startTime.format("MMM DD, YYYY HH:mmA")}`,
    },
    {
      value: 100,
      label: current?.hasEndTime ? (current?.endTime ? `${current.endTime.format("MMM DD, YYYY HH:mmA")}` : "∞") : "∞",
    },
  ];

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
                          <p>Close</p>
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

  const CTAButton = () => {
    if (!isConnected || !address) {
      return <Connect />;
    }

    switch (current?.claim?.status) {
      case "available":
        return (
          <Button
            size="lg"
            onClick={async () => {
              setMinting(true);

              if (!valid) return;

              try {
                dispatch(
                  registerCampaign({
                    id: current._id!,
                    callback: ({ data }) => {
                      write({
                        args: [data.nft.baseNft.campaignId, data.nft.baseNft.type, data.nft.baseNft._id, data.nft.baseNft.metadata, data.proof],
                      });
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
            Register
          </Button>
        );
      case "not_start_yet":
        return (
          <Button size="lg" disabled>
            Not Start Yet
          </Button>
        );
      case "ended":
        return (
          <Button size="lg" disabled>
            Ended
          </Button>
        );
      case "finished":
        return (
          <Button size="lg" disabled>
            Finished
          </Button>
        );
      case "unfinished":
        return (
          <Button size="lg" disabled>
            Unfinished
          </Button>
        );
      case "registered":
        return (
          <Button size="lg" disabled>
            Registered
          </Button>
        );
      case "claimable":
        return <span className="font-bold">Claimable</span>;

      default:
        break;
    }
  };

  if (!campaign.isInit) {
    return null;
  }

  if (!current) {
    return "Not Found 404";
  }

  return (
    <>
      <section className="">
        <Container>
          <div className="mx-auto w-full overflow-hidden rounded">
            <div className="relative z-20 h-[140px] sm:h-[160px] md:h-auto">
              <img src={current.banner} alt="profile cover" className="h-full w-full object-cover object-center" />
            </div>
            <div className="flex flex-wrap px-5 pb-3 pt-6 sm:px-9 md:flex-nowrap">
              <div className="relative -top-14 z-30 h-[120px] w-full max-w-[120px] border-4 border-[#fdf3ff] bg-white shadow-card sm:h-[160px] sm:max-w-[160px]">
                <img src={current.image} className="h-full w-full object-cover object-center" />
              </div>
              <div className="w-full md:pl-6">
                <div className="mb-6 items-center justify-between sm:flex">
                  <div className="mb-2 sm:mb-0">
                    <h4 className="mb-1.5 text-2xl font-bold text-black">{current.name}</h4>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-body-color">{current.joined} participants</p>
                    <div className="flex items-center space-x-3 sm:justify-end">{CTAButton()}</div>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm text-body-color">{current.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[30px] text-center font-bold">{campaign.isLoading ? "Loading ..." : ""}</div>

          <div className="mb-6">
            <Stepper activeStep={0} alternativeLabel>
              {marks.map((label) => (
                <Step key={label.value}>
                  <StepLabel>{label.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <div className="mb-6">
            Curent process:{" "}
            <span className="text-[19px]">
              <NumericFormat value={Math.round(current.claim.distance)} thousandSeparator="," displayType="text" />
            </span>{" "}
            meters
          </div>
        </Container>
      </section>

      <Claimable showWithoutNfts={false} campaignId={current._id!} />
      <section className="bg-[#F6F6F6] px-6 py-[56px]">
        <Container>
          <div className="text-[26px] font-bold mb-6">Tracks</div>

          <div className="grid grid-cols-3">
            {current.tracks.map((item) => (
              <div key={item.track}>
                <div className="shadow-three mb-10 rounded-lg bg-white p-4 pb-6">
                  <div className="mb-6 w-full overflow-hidden rounded-md">
                    <img src={item.image} alt="card image" className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="px-[10px]">
                    <h3 className="text-center font-bold text-[24px]">{item.track} meters</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-[16px] mt-[156px]">
            <div className="text-[32px] font-bold">View more running campaigns</div>
          </div>
        </Container>
      </section>
      <Campaigns />
    </>
  );
};

export default CampaignDetail;
