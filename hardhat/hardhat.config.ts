require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  networks: {
    hardhat: {
    },
    polygon_mumbai: {
      url: "https://mumbai.rpc.thirdweb.com",
      accounts: [process.env.KOME_PRIVATE_KEY]
    },
    polygonzkEvm: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.KOME_PRIVATE_KEY]
    }
  },
   solidity: "0.8.19",
}