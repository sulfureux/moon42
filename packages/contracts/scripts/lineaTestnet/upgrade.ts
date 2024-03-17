import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ethers, upgrades } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  const moon42NFT = await ethers.getContractFactory("Moon42NFT");
  await upgrades.upgradeProxy("0x6508cA841569a3e04e03dD2E1B43138302084993", moon42NFT);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
