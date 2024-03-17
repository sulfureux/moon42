// http://github.com/gpxl-dev/truncate-eth-address/blob/main/src/index.ts

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^((?:.){12}).+((?:.){12})$/; // 4-4
const shortTruncateRegex = /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/; // 4-6
const longTruncateRegex = /^(0x[a-zA-Z0-9]{16})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/; // 4-6
const txTruncateRegex = /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/; // 6-6
const truncateSuiRegex = /^((?:.){4}).+((?:.){4})$/; // 4-4

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */

export const truncateEthAddress = (address: string) => {
  const match = address.match(truncateRegex);

  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const longTruncateEthAddress = (address: string) => {
  const match = address.match(longTruncateRegex);

  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const shortTruncateEthAddress = (address: string) => {
  const match = address.match(shortTruncateRegex);

  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const txTruncateEthAddress = (address: string) => {
  const match = address.match(txTruncateRegex);

  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const truncateSuiTx = (txn: string) => {
  const match = txn.match(truncateSuiRegex);

  if (!match) return match;
  return `${match[1]}...${match[2]}`;
};

export const addressValidator = (address: string) => {
  return /^(0x[a-f0-9]{64})$/g.test(address);
};
