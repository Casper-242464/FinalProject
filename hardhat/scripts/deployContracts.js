const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await hre.ethers.getContractFactory("Vault");
  console.log("Deploying Vault...");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  console.log(`Vault deployed to: ${await vault.getAddress()}`);

  const LoyaltyToken = await hre.ethers.getContractFactory("LoyaltyToken");
  console.log("Deploying CasinoLoyaltyToken...");
  const token = await LoyaltyToken.deploy();
  await token.waitForDeployment();
  console.log(`LoyaltyToken deployed to: ${await token.getAddress()}`);

  const Casino = await hre.ethers.getContractFactory("Casino");
  console.log("Deploying Casino...");
  const casino = await Casino.deploy(await vault.getAddress(), await token.getAddress());
  await casino.waitForDeployment();
  console.log(`Casino deployed to: ${await casino.getAddress()}`);

  console.log("Setting casino address in Vault...");
  await vault.setCasino(await casino.getAddress());

  console.log("Setting casino address in CasinoLoyaltyToken...");
  await token.setCasino(await casino.getAddress());

  console.log("All contracts deployed and configured!");

  const contractsDir = __dirname + "/../../frontend/artifacts/contracts";
  const casinoAddress = await casino.getAddress();

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ 
        Casino: casinoAddress,
    }, undefined, 2)
  );
}

main()
.then(() => process.exit(0)).catch((error) => 
  {
    console.error(error);
    process.exit(1);
  }
);