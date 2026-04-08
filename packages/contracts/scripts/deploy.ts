import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("No deployer signer available");

  console.log("Deploying BenchRegistry with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // The attestor address — in production, this comes from the generated keypair.
  // For initial deployment, the deployer is also the attestor.
  const attestorAddress = process.env.ATTESTOR_ADDRESS || deployer.address;

  const Factory = await ethers.getContractFactory("BenchRegistry");
  const registry = await Factory.deploy(attestorAddress);
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("BenchRegistry deployed to:", address);
  console.log("Attestor set to:", attestorAddress);
  console.log("");
  console.log("Add this to your .env:");
  console.log(`BENCH_REGISTRY_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
