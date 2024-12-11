import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  /////factory deploy
  const bidi = await ethers.getContractFactory("BidifyFactory");
  // Estimate gas
  const estimatedGas = await ethers.provider.estimateGas({
    from: deployer.address,
    data: bidi.bytecode
  })
  console.log("Estimated Gas for Deployment:", estimatedGas.toString());
  const fee = await ethers.provider.getFeeData()
  console.log(fee)

  // Check if the deployer has enough funds to cover the gas cost
  // const gasPrice = await ethers.provider.get();
  // const requiredBalance = estimatedGas.mul(gasPrice);
  // console.log("Required balance:", ethers.utils.formatEther(requiredBalance), "ETH");


  const contract = await bidi.deploy();

  /////token deploy
  // const bidi = await ethers.getContractFactory("BidifyToken");
  // const token = await bidi.deploy("StandardBidifyToken", "SBT");

  console.log("factory address:", await contract.getAddress());

  const tx = await contract.createCollection("StandardBidifyToken", "SBT", deployer.address);
  await tx.wait();

  const collection = await contract.getCollections();
  if (collection) {
    const token = collection[0][0];
    console.log("token address", token)
  }

  const txx = await contract.transferOwnership("0x24D1162C385a8f4ac84D29269CB7aB0Ca21A7586");
  await txx.wait();
  const owner = await contract.owner();
  console.log("owner address", owner)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });