import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

require("dotenv").config();

const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const SEPOLIA_URL: any = process.env.SEPOLIA_URL;
// const GOERLI_URL: any = process.env.GOERLI_URL;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/", // BSC Mainnet RPC URL or use your own provider
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 8453,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [PRIVATE_KEY],
      chainId: 42161,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY],
      chainId: 43114,
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: [PRIVATE_KEY],
      chainId: 137,
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      accounts: [PRIVATE_KEY],
      chainId: 10,
    },
    mantle: {
      url: "https://rpc.mantle.xyz",
      accounts: [PRIVATE_KEY],
      chainId: 5000,
    },
    blast: {
      url: "https://rpc.blast.io",
      accounts: [PRIVATE_KEY],
      chainId: 81457, // Replace with the correct chain ID
    },
    linea: {
      url: "https://linea-mainnet.infura.io/v3/208cb2f7413042f389a884515ae9e69d",
      accounts: [PRIVATE_KEY],
      chainId: 59144,
      gasPrice: 200000000
    },
    scroll: {
      url: "https://scroll-mainnet.infura.io/v3/208cb2f7413042f389a884515ae9e69d",
      accounts: [PRIVATE_KEY],
      chainId: 534352,
    },
  },
  etherscan: {
    apiKey: {
      bsc: "3IPW76GB2KV6A2EIJS5PR8KJTYJUGPKDBU",
      scroll: "BJQC74FDJNDV5XG6K7XCZNB77G3Y3ZR6Y4",
      blast: "A1XJS3MFZX64DIFE98BHUDU1CDT4W8AUSW",
      optimisticEthereum: "5WM5GFAA3AX7WHUK2ZGEYN4GAVN5873JDX",
      arbitrumOne: "9G9UAENP3D2P4Z4FBI9ZS9JRDFBUT5AIR6",
      polygon: "FSBGFUSYSAIF8XQKES9Z716K9MQUPCJSCP",
      mantle: "N4DKJBRKKKPGJA2FTPG8QD4XPXNP8PW898",
      base: "51GJ9QY6S2UUXUDC7N5RNZC49I8MAQDPWP",
      linea: "N9CX2JVRZ6UF9HHSW85AXZQ7PVF5XSJNYF",
      avalanche: "N9CX2JVRZ6UF9HHSW85AXZQ7PVF5XSJNYF"
    },
    customChains: [
      {
        network: "scroll",
        chainId: 534352, // Same Chain ID as above
        urls: {
          apiURL: "https://api.scrollscan.com/api", // API endpoint for contract verification
          browserURL: "https://scrollscan.com/", // Base URL of the explorer
        },
      },
      {
        network: "blast",
        chainId: 81457, // Same Chain ID as above
        urls: {
          apiURL: "https://api.blastscan.io/api", // API endpoint for contract verification
          browserURL: "https://blastscan.io/", // Base URL of the explorer
        },
      },
      {
        network: "mantle",
        chainId: 5000, // Same Chain ID as above
        urls: {
          apiURL: "https://api.mantlescan.xyz/api", // API endpoint for contract verification
          browserURL: "https://mantlescan.xyz/", // Base URL of the explorer
        }
      },
      {
        network: "base",
        chainId: 8453, // Same Chain ID as above
        urls: {
          apiURL: "https://api.basescan.org/api", // API endpoint for contract verification
          browserURL: "https://basescan.org/", // Base URL of the explorer
        }
      },
      {
        network: "linea",
        chainId: 59144, // Same Chain ID as above
        urls: {
          apiURL: "https://api.lineascan.build/api", // API endpoint for contract verification
          browserURL: "https://lineascan.build/", // Base URL of the explorer
        }
      }
    ],
  },
  sourcify: {
    enabled: true,
  }
};

export default config;
