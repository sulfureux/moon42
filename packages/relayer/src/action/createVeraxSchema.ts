import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { SIGNER_ADDRESS, SIGNER_PRIVATE_KEY } from "../config";

// https://docs.ver.ax/verax-documentation/developer-guides/for-attestation-issuers/create-a-schema
// https://docs.ver.ax/verax-documentation/developer-guides/tutorials/from-a-schema-to-an-attestation

export const createVeraxSchema = async () => {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET, SIGNER_ADDRESS as `0x${string}`, SIGNER_PRIVATE_KEY as `0x${string}`);

  const SCHEMA = "(string campaign_id, string participant, string created_date, uint16 type, uint16 track)";
  const schemaId = await veraxSdk.schema.getIdFromSchemaString(SCHEMA);

  console.log(schemaId);
  // 0x1f7932eeac6e39d7d60494c098a9bd9e2a93eefd66b73aa2b9ec2794de371f5e

  const data = await veraxSdk.schema.findOneById("0x1f7932eeac6e39d7d60494c098a9bd9e2a93eefd66b73aa2b9ec2794de371f5e");

  console.log(data);

  // {
  //   id: '0x1f7932eeac6e39d7d60494c098a9bd9e2a93eefd66b73aa2b9ec2794de371f5e',
  //   name: 'moon42 schema',
  //   description: 'This Schema is used for Moon42 project',
  //   context: 'https://moon42.run/',
  //   schema: '(string campaign_id, string participant, string created_date, uint16 type, uint16 track)'
  // }

  return;
  // const txHash = await veraxSdk.schema.create("moon42 schema", "This Schema is used for Moon42 project", "https://moon42.run/", SCHEMA);
  const txHash = await veraxSdk.schema.simulateCreate("moon42 schema", "This Schema is used for Moon42 project", "https://moon42.run/", SCHEMA);

  console.log(txHash);
};
