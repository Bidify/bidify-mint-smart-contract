import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const ETHERSCAN_KEY: any = process.env.ETHERSCAN_KEY;
const SEPOLIA_URL: any = process.env.SEPOLIA_URL;
const GOERLI_URL: any = process.env.GOERLI_URL;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
