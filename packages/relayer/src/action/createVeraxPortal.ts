import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { SIGNER_ADDRESS, SIGNER_PRIVATE_KEY } from "../config";

// https://docs.ver.ax/verax-documentation/developer-guides/for-attestation-issuers/create-a-schema
// https://docs.ver.ax/verax-documentation/developer-guides/tutorials/from-a-schema-to-an-attestation

export const createVeraxPortal = async () => {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET, SIGNER_ADDRESS as `0x${string}`, SIGNER_PRIVATE_KEY as `0x${string}`);

  return;
  const txHash = await veraxSdk.portal.deployDefaultPortal([], "Moon42 Portal", "This Portal is used for Moon42", true, "Moon42");
  console.log(txHash);

  // 0x583f00900443256e68038707b38bc74c0176cd2e00dbc1e26bb0936d2f81e760
  // https://goerli.lineascan.build/tx/0x583f00900443256e68038707b38bc74c0176cd2e00dbc1e26bb0936d2f81e760#eventlog

  // const decodedLogs = decodeEventLog({
  //   abi: parseAbi(["event PortalRegistered(string name, string description, address portalAddress)"]),
  //   data: receipt.logs[0].data,
  //   topics: receipt.logs[0].topics,
  // });
  // const portalId = decodedLogs.args.portalAddress;
};
