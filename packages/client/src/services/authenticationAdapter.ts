import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import config from "../config";

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch(`${config.apiURL}/api/nonce`);
    return await response.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in to moon42.run",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    const verifyRes = await fetch(`${config.apiURL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    });
    return Boolean(verifyRes.ok);
  },
  signOut: async () => {
    await fetch(`${config.apiURL}/api/logout`);
  },
});

export default authenticationAdapter;
