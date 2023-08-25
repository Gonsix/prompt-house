import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [account1, account2, account3] = await ethers.getSigners();
    
  const Market = await ethers.getContractFactory("SPTMarket");
  const market= await Market.deploy(); // Contract object, 
  const tx = await market.deploymentTransaction();
  await tx?.wait();
  const ContractAddress = await market.getAddress()
  console.log("Deployed to: ", ContractAddress);
  const obj = {
    address: ContractAddress
  }
  const json = JSON.stringify(obj);
  fs.writeFileSync('contractAddress.json', json);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
