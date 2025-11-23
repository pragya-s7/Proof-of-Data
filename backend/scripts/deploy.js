require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const hre = require("hardhat");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);
  console.log(
    "Balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );

  //
  // Deploy DeTrainMarketplace
  //
  const Marketplace = await ethers.getContractFactory("DeTrainMarketplace");
  const market = await Marketplace.deploy();
  await market.deployed();

  console.log("DeTrainMarketplace deployed at:", market.address);

  //
  // 1) Write deployed-addresses.json inside backend/
  //
  const deployedPath = path.join(__dirname, "..", "deployed-addresses.json");

  fs.writeFileSync(
    deployedPath,
    JSON.stringify(
      {
        network: hre.network.name,
        DeTrainMarketplace: market.address,
      },
      null,
      2
    )
  );

  console.log("Saved deployed address → backend/deployed-addresses.json");

  //
  // 2) Export ABI into proof-of-data-1/abis
  //
  const projectRoot = path.join(__dirname, "..", ".."); // goes to proof-of-data-1
  const abiDir = path.join(projectRoot, "abis");

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const artifact = await hre.artifacts.readArtifact("DeTrainMarketplace");

  fs.writeFileSync(
    path.join(abiDir, "DeTrainMarketplace.json"),
    JSON.stringify(
      {
        address: market.address,
        abi: artifact.abi,
      },
      null,
      2
    )
  );

  console.log("ABI exported → abis/DeTrainMarketplace.json");
  console.log("Deployment complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});