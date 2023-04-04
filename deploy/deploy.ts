import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv"

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);
  dotenv.config()

  // Initialize the wallet.
  const wallet = new Wallet(process.env.PRIVATE_KEY as string);
  let BidifyFactoryAddress

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  {
    const artifact = await deployer.loadArtifact("BidifyFactory");

    // Estimate contract deployment fee
    const deploymentFee = await deployer.estimateDeployFee(artifact, []);

    // // OPTIONAL: Deposit funds to L2
    // // Comment this block if you already have funds on zkSync.
    // const depositHandle = await deployer.zkWallet.deposit({
    //   to: deployer.zkWallet.address,
    //   token: utils.ETH_ADDRESS,
    //   amount: deploymentFee.mul(2),
    // });
    // // Wait until the deposit is processed on zkSync
    // await depositHandle.wait();

    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    const BidifyFactoryContract = await deployer.deploy(artifact, []);

    //obtain the Constructor Arguments
    console.log("constructor args:" + BidifyFactoryContract.interface.encodeDeploy([]));

    // Show the contract info.
    BidifyFactoryAddress = BidifyFactoryContract.address;
    console.log(`${artifact.contractName} was deployed to ${BidifyFactoryAddress}`);
  }

  {
    const artifact = await deployer.loadArtifact("BidifyToken");

    // Estimate contract deployment fee
    const deploymentFee = await deployer.estimateDeployFee(artifact, ["Standard BidifyMint Nft", "SBN"]);

    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    const BidifyTokenContract = await deployer.deploy(artifact, ["Standard BidifyMint Nft", "SBN"]);

    //obtain the Constructor Arguments
    console.log("constructor args:" + BidifyTokenContract.interface.encodeDeploy(["Standard BidifyMint Nft", "SBN"]));
    BidifyTokenContract.transferOwnership(BidifyFactoryAddress)
    // Show the contract info.
    const contractAddress = BidifyTokenContract.address;
    console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
  }

}
