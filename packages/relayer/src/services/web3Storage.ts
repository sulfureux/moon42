// import { Web3Storage } from "web3.storage";
// import { WEB3_STORAGE_API_TOKEN } from "../config";

// export const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_API_TOKEN });

// export const createFilePath = (cid: string, filename: string) => {
//   return `https://${cid}.ipfs.w3s.link/${filename}`;
// };

// import { Web3Storage } from "web3.storage";
// import config from "../config";

import { CarReader } from "@ipld/car";
import { importDAG } from "@ucanto/core/delegation";
import * as Signer from "@ucanto/principal/ed25519";
import { create, Client } from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

// export const web3StorageClient = new Web3Storage({ token: config.web3StorageAPIToken });

// {
//   "did": "did:key:z6MksCgTKNhwwcNR7cBtCtLgsVh48hf43neEqFDRh7xZYPGr",
//   "key": "MgCaJfWuo6pwjiaQQYiNiRj61pfdy7Ch20Sk3oKPo4mljhu0BvWvRPOiG8CCOLuHIzO9fwwpSO2RQzNlcQRhn7yCrmGc="
// }

// {
//   "did": "did:key:z6MkmFJcpEQsZX9RbX9MtRykhNUueEie2nwDt6gzC3qUxQ8H",
//   "key": "MgCY6SpvlsR0W6bOggOnHi70IxmeZtmyv9gyGwA1naVQ0be0BZPG/dPym0rsvP/uv/o/KI100bUiBquS8zwx1/LxXuCo="
// }

// {
//   "did": "did:key:z6MkedCh9iEQ28eo9wGvHZe2RHRKhoS1cJSyvvFQVEz8yEs2",
//   "key": "MgCaWKHATpnuCH/5KMnbitX4pspvGpGwehbOZG/TUrEWOqu0BAowEeteEi0abhA5NgFbBu3BAVgpuYbo+raxay1uI8Tk="
// }

// did:key:z6MkqY7yUxk6nqLYd1hYfygMPbRgY9mN8waJaLNHxp8Egjg8

// did:mailto:gmail.com:pierreneter
// did:key:z6MkjGBjhBJAWX7dMXyfiLf2fQJEXVzCduqgoNBx6gMQMM1e
// Y6Jlcm9vdHOC2CpYJQABcRIg20QqmaHS33cuzDg87HMgFzuKNPO4rokOFVjjaqKZLu3YKlglAAFxEiCk3
// w3 delegation create did:key:z6MkedCh9iEQ28eo9wGvHZe2RHRKhoS1cJSyvvFQVEz8yEs2 --can 'store/add' --can 'upload/add' | base64

export let web3StorageClient: Client;

export const web3StorageInit = async () => {
  const principal = Signer.parse("MgCaWKHATpnuCH/5KMnbitX4pspvGpGwehbOZG/TUrEWOqu0BAowEeteEi0abhA5NgFbBu3BAVgpuYbo+raxay1uI8Tk=");
  const store = new StoreMemory();
  const client = await create({ principal, store });

  const proof = await parseProof(
    "EaJlcm9vdHOAZ3ZlcnNpb24BvgUBcRIg1cCAQiSeAQLIFofMvBFddny+eqaSJHYfNZA1+uITTLeoYXNYRO2hA0BVfmzRkBTppluEPnzgEFTYdu5SJzJMoPyaMTlvlEQzlVPvkHB96GgAU8A71XEqc3Tc4ibAQcPYZU5w05MqMrEAYXZlMC45LjFjYXR0hqJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZziiY2NhbmdzdG9yZS8qZHdpdGh4OGRpZDprZXk6ejZNa3FZN3lVeGs2bnFMWWQxaFlmeWdNUGJSZ1k5bU44d2FKYUxOSHhwOEVnamc4omNjYW5odXBsb2FkLypkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZziiY2NhbmhhY2Nlc3MvKmR3aXRoeDhkaWQ6a2V5Ono2TWtxWTd5VXhrNm5xTFlkMWhZZnlnTVBiUmdZOW1OOHdhSmFMTkh4cDhFZ2pnOKJjY2FuamZpbGVjb2luLypkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZziiY2Nhbmd1c2FnZS8qZHdpdGh4OGRpZDprZXk6ejZNa3FZN3lVeGs2bnFMWWQxaFlmeWdNUGJSZ1k5bU44d2FKYUxOSHhwOEVnamc4Y2F1ZFgi7QFHdCyLexAeD9spkA3D6SvHqNH3ECPzkKUjTaLSr6fmRWNleHAaZ9afmWNmY3SBoWVzcGFjZaFkbmFtZWZtb29uNDJjaXNzWCLtAaSvVaK90jen0x5uzg1z4g07hev1iUdl9Lhwkk57sktNY3ByZoC+BQFxEiDVwIBCJJ4BAsgWh8y8EV12fL56ppIkdh81kDX64hNMt6hhc1hE7aEDQFV+bNGQFOmmW4Q+fOAQVNh27lInMkyg/JoxOW+URDOVU++QcH3oaABTwDvVcSpzdNziJsBBw9hlTnDTkyoysQBhdmUwLjkuMWNhdHSGomNjYW5nc3BhY2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtxWTd5VXhrNm5xTFlkMWhZZnlnTVBiUmdZOW1OOHdhSmFMTkh4cDhFZ2pnOKJjY2FuZ3N0b3JlLypkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZziiY2Nhbmh1cGxvYWQvKmR3aXRoeDhkaWQ6a2V5Ono2TWtxWTd5VXhrNm5xTFlkMWhZZnlnTVBiUmdZOW1OOHdhSmFMTkh4cDhFZ2pnOKJjY2FuaGFjY2Vzcy8qZHdpdGh4OGRpZDprZXk6ejZNa3FZN3lVeGs2bnFMWWQxaFlmeWdNUGJSZ1k5bU44d2FKYUxOSHhwOEVnamc4omNjYW5qZmlsZWNvaW4vKmR3aXRoeDhkaWQ6a2V5Ono2TWtxWTd5VXhrNm5xTFlkMWhZZnlnTVBiUmdZOW1OOHdhSmFMTkh4cDhFZ2pnOKJjY2FuZ3VzYWdlLypkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZzhjYXVkWCLtAUd0LIt7EB4P2ymQDcPpK8eo0fcQI/OQpSNNotKvp+ZFY2V4cBpn1p+ZY2ZjdIGhZXNwYWNloWRuYW1lZm1vb240MmNpc3NYIu0BpK9Vor3SN6fTHm7ODXPiDTuF6/WJR2X0uHCSTnuyS01jcHJmgNwDAXESIO1irogEmwKHG5TCyFtgplQClVlCcKMo+cIjY+iH0FuaqGFzWETtoQNAkxlvRtOyCUluMOV4pVz1n34ji8VUCbam5+BkCPQSYZCJRmbpUYaywvijTmvGaQoHcDtBFe5c8djx1t4ToHYcBGF2ZTAuOS4xY2F0dIKiY2NhbmlzdG9yZS9hZGRkd2l0aHg4ZGlkOmtleTp6Nk1rcVk3eVV4azZucUxZZDFoWWZ5Z01QYlJnWTltTjh3YUphTE5IeHA4RWdqZziiY2Nhbmp1cGxvYWQvYWRkZHdpdGh4OGRpZDprZXk6ejZNa3FZN3lVeGs2bnFMWWQxaFlmeWdNUGJSZ1k5bU44d2FKYUxOSHhwOEVnamc4Y2F1ZFgi7QECjAR614SLRpuEDk2AVsG7cEBWCm5huj6trFrLW4jxOWNleHD2Y2ZjdIGhZXNwYWNloWRuYW1lZm1vb240MmNpc3NYIu0BR3Qsi3sQHg/bKZANw+krx6jR9xAj85ClI02i0q+n5kVjcHJmgtgqWCUAAXESINXAgEIkngECyBaHzLwRXXZ8vnqmkiR2HzWQNfriE0y32CpYJQABcRIg1cCAQiSeAQLIFofMvBFddny+eqaSJHYfNZA1+uITTLc=",
  );
  const space = await client.addSpace(proof as any);
  await client.setCurrentSpace(space.did());

  // const account = await client.login("pierreneter@gmail.com");
  // const space = await client.createSpace("moon42");

  web3StorageClient = client;
};

export const createFilePath = (cid: string, filename: string) => {
  // return `https://${cid}.ipfs.w3s.link/${filename}`;
  return `https://${cid}.ipfs.w3s.link`;
};

async function parseProof(data: string) {
  const blocks = [];
  const reader = await CarReader.fromBytes(Buffer.from(data, "base64"));
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks as any);
}
