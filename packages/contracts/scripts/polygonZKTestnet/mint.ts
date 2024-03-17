import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  const moon42NFT = await ethers.getContractFactory("Moon42NFT");
  const moon42NFTContract = moon42NFT.attach("");

  // const tx = await moon42NFTContract.connect(owner).safeMint();
  // console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
