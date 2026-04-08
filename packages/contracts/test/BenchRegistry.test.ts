import { expect } from "chai";
import { ethers } from "hardhat";
import { BenchRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("BenchRegistry", function () {
  let registry: BenchRegistry;
  let owner: SignerWithAddress;
  let attestor: SignerWithAddress;
  let agent: SignerWithAddress;
  let other: SignerWithAddress;

  const certHash = ethers.keccak256(ethers.toUtf8Bytes("test-cert-1"));
  const sigHash = ethers.keccak256(ethers.toUtf8Bytes("test-sig-1"));

  beforeEach(async function () {
    [owner, attestor, agent, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("BenchRegistry");
    registry = await Factory.deploy(attestor!.address);
    await registry.waitForDeployment();
  });

  describe("deployment", function () {
    it("sets owner correctly", async function () {
      expect(await registry.owner()).to.equal(owner!.address);
    });

    it("sets attestor correctly", async function () {
      expect(await registry.attestor()).to.equal(attestor!.address);
    });

    it("starts with zero anchors", async function () {
      expect(await registry.totalAnchors()).to.equal(0);
    });

    it("reverts with zero attestor address", async function () {
      const Factory = await ethers.getContractFactory("BenchRegistry");
      await expect(Factory.deploy(ethers.ZeroAddress))
        .to.be.revertedWith("Bench: zero attestor");
    });
  });

  describe("anchorCertificate", function () {
    it("anchors a certificate successfully", async function () {
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 2, 92, 10, 9, sigHash
      );

      expect(await registry.totalAnchors()).to.equal(1);
      const anchor = await registry.getAnchor(certHash);
      expect(anchor.agent).to.equal(agent!.address);
      expect(anchor.certificationLevel).to.equal(2);
      expect(anchor.sourceAgreementScore).to.equal(92);
      expect(anchor.sourcesQueried).to.equal(10);
      expect(anchor.sourcesSuccessful).to.equal(9);
    });

    it("emits CertificateAnchored event", async function () {
      await expect(
        registry.connect(attestor!).anchorCertificate(
          certHash, agent!.address, 2, 92, 10, 9, sigHash
        )
      ).to.emit(registry, "CertificateAnchored")
        .withArgs(certHash, agent!.address, 2, 92, 10, await ethers.provider.getBlockNumber() + 1);
    });

    it("increments certifiedCount for level 2", async function () {
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 2, 92, 10, 9, sigHash
      );
      const stats = await registry.getAgentStats(agent!.address);
      expect(stats.certified).to.equal(1);
      expect(stats.warning).to.equal(0);
      expect(stats.failed).to.equal(0);
      expect(stats.total).to.equal(1);
    });

    it("increments warningCount for level 1", async function () {
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 1, 65, 8, 7, sigHash
      );
      const stats = await registry.getAgentStats(agent!.address);
      expect(stats.warning).to.equal(1);
    });

    it("increments failedCount for level 0", async function () {
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 0, 30, 10, 4, sigHash
      );
      const stats = await registry.getAgentStats(agent!.address);
      expect(stats.failed).to.equal(1);
    });

    it("reverts if not called by attestor", async function () {
      await expect(
        registry.connect(other!).anchorCertificate(
          certHash, agent!.address, 2, 92, 10, 9, sigHash
        )
      ).to.be.revertedWith("Bench: not attestor");
    });

    it("reverts on duplicate cert hash", async function () {
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 2, 92, 10, 9, sigHash
      );
      await expect(
        registry.connect(attestor!).anchorCertificate(
          certHash, agent!.address, 2, 92, 10, 9, sigHash
        )
      ).to.be.revertedWith("Bench: already anchored");
    });

    it("reverts for invalid certification level", async function () {
      await expect(
        registry.connect(attestor!).anchorCertificate(
          certHash, agent!.address, 3, 92, 10, 9, sigHash
        )
      ).to.be.revertedWith("Bench: invalid level");
    });

    it("reverts for agreement score > 100", async function () {
      await expect(
        registry.connect(attestor!).anchorCertificate(
          certHash, agent!.address, 2, 101, 10, 9, sigHash
        )
      ).to.be.revertedWith("Bench: invalid score");
    });
  });

  describe("batchAnchor", function () {
    it("anchors multiple certificates in one transaction", async function () {
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("test-cert-2"));
      const hash3 = ethers.keccak256(ethers.toUtf8Bytes("test-cert-3"));
      const sig2 = ethers.keccak256(ethers.toUtf8Bytes("test-sig-2"));
      const sig3 = ethers.keccak256(ethers.toUtf8Bytes("test-sig-3"));

      await registry.connect(attestor!).batchAnchor(
        [certHash, hash2, hash3],
        [agent!.address, agent!.address, agent!.address],
        [2, 1, 0],
        [92, 65, 30],
        [10, 8, 10],
        [9, 7, 4],
        [sigHash, sig2, sig3]
      );

      expect(await registry.totalAnchors()).to.equal(3);
      const stats = await registry.getAgentStats(agent!.address);
      expect(stats.certified).to.equal(1);
      expect(stats.warning).to.equal(1);
      expect(stats.failed).to.equal(1);
      expect(stats.total).to.equal(3);
    });

    it("reverts on array length mismatch", async function () {
      await expect(
        registry.connect(attestor!).batchAnchor(
          [certHash],
          [agent!.address, other!.address], // wrong length
          [2],
          [92],
          [10],
          [9],
          [sigHash]
        )
      ).to.be.revertedWith("Bench: length mismatch");
    });
  });

  describe("markExecutionVerified", function () {
    it("emits ExecutionVerified event", async function () {
      const txHash = ethers.keccak256(ethers.toUtf8Bytes("tx-hash-1"));
      await registry.connect(attestor!).anchorCertificate(
        certHash, agent!.address, 2, 92, 10, 9, sigHash
      );

      await expect(
        registry.connect(attestor!).markExecutionVerified(certHash, true, txHash)
      ).to.emit(registry, "ExecutionVerified")
        .withArgs(certHash, agent!.address, true, txHash);
    });

    it("reverts for non-existent cert", async function () {
      const txHash = ethers.keccak256(ethers.toUtf8Bytes("tx-hash-1"));
      await expect(
        registry.connect(attestor!).markExecutionVerified(certHash, true, txHash)
      ).to.be.revertedWith("Bench: not found");
    });
  });

  describe("setAttestor", function () {
    it("updates attestor when called by owner", async function () {
      await registry.connect(owner!).setAttestor(other!.address);
      expect(await registry.attestor()).to.equal(other!.address);
    });

    it("emits AttestorUpdated event", async function () {
      await expect(registry.connect(owner!).setAttestor(other!.address))
        .to.emit(registry, "AttestorUpdated")
        .withArgs(attestor!.address, other!.address);
    });

    it("reverts when called by non-owner", async function () {
      await expect(
        registry.connect(attestor!).setAttestor(other!.address)
      ).to.be.revertedWith("Bench: not owner");
    });

    it("reverts for zero address", async function () {
      await expect(
        registry.connect(owner!).setAttestor(ethers.ZeroAddress)
      ).to.be.revertedWith("Bench: zero attestor");
    });
  });

  describe("getAgentCerts", function () {
    it("returns paginated cert hashes", async function () {
      const hashes = [];
      for (let i = 0; i < 5; i++) {
        const h = ethers.keccak256(ethers.toUtf8Bytes(`cert-${i}`));
        const s = ethers.keccak256(ethers.toUtf8Bytes(`sig-${i}`));
        hashes.push(h);
        await registry.connect(attestor!).anchorCertificate(
          h, agent!.address, 2, 90, 10, 9, s
        );
      }

      // Get first 3
      const page1 = await registry.getAgentCerts(agent!.address, 0, 3);
      expect(page1.length).to.equal(3);
      expect(page1[0]).to.equal(hashes[0]);

      // Get next 3 (only 2 remaining)
      const page2 = await registry.getAgentCerts(agent!.address, 3, 3);
      expect(page2.length).to.equal(2);

      // Offset beyond length returns empty
      const page3 = await registry.getAgentCerts(agent!.address, 10, 3);
      expect(page3.length).to.equal(0);
    });
  });
});
