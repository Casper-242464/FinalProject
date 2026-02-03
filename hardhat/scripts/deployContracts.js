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

  const contractsDir = __dirname + "/../../frontend/src/contracts";
  const artifactsDir = __dirname + "/../artifacts/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  console.log("Updating frontend contract files...");

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ 
        Casino: await casino.getAddress(),
    }, undefined, 2)
  );

  const casinoArtifact = JSON.parse(
    fs.readFileSync(artifactsDir + "/Casino.sol/Casino.json", "utf8")
  );
  fs.writeFileSync(
    contractsDir + "/Casino.json",
    JSON.stringify(casinoArtifact, null, 2)
  );

  const tokenArtifact = JSON.parse(
    fs.readFileSync(artifactsDir + "/LoyaltyToken.sol/LoyaltyToken.json", "utf8")
  );
  fs.writeFileSync(
    contractsDir + "/LoyaltyToken.json",
    JSON.stringify(tokenArtifact, null, 2)
  );

  console.log("Frontend contract files updated successfully!");
}

main()
.then(() => process.exit(0)).catch((error) => 
  {
    console.error(error);
    process.exit(1);
  }
);