import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { SIGNER_ADDRESS, SIGNER_PRIVATE_KEY } from "../config";

// https://docs.ver.ax/verax-documentation/developer-guides/for-attestation-issuers/create-a-schema
// https://docs.ver.ax/verax-documentation/developer-guides/tutorials/from-a-schema-to-an-attestation

export const createVeraxAttestation = async (address: string, campaign_id: string, participant: string, created_date: string, type: number, track: number) => {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET, SIGNER_ADDRESS as `0x${string}`, SIGNER_PRIVATE_KEY as `0x${string}`);

  const txHash = await veraxSdk.portal.attest(
    "0x2c5a509c0ccac40f2764c342dee6c5048c4e3e3c",
    {
      schemaId: "0x1f7932eeac6e39d7d60494c098a9bd9e2a93eefd66b73aa2b9ec2794de371f5e",
      expirationDate: Math.floor(Date.now() / 1000) + 2592000,
      subject: address,
      attestationData: [
        {
          campaign_id,
          participant,
          created_date,
          type,
          track,
        },
      ],
    },
    [],
  );

  return txHash;
};
