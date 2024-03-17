import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  const moon42NFT = await ethers.getContractFactory("Moon42NFT");
  const moon42NFTContract = moon42NFT.attach("0x6508cA841569a3e04e03dD2E1B43138302084993");

  const tx = await moon42NFTContract.connect(owner).setSigner("0x1f770ec2Cfc479f7D9020B2600430ed6E38E7db1");
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
