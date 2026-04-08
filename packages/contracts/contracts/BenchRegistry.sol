// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BenchRegistry v2
 * @notice On-chain anchor for Bench Best Execution Certificates.
 * @dev Stores minimal cert data on-chain (hash, level, score, counts).
 *      Full multi-source data lives off-chain in PostgreSQL.
 *
 *      Deployed on X Layer (chain ID 196) for zero gas fees.
 */
contract BenchRegistry {

    struct AnchorRecord {
        bytes32 certHash;
        address agent;
        uint64 blockNumber;
        uint64 timestamp;
        uint8 certificationLevel;     // 0=FAILED, 1=WARNING, 2=CERTIFIED
        uint8 sourceAgreementScore;   // 0-100
        uint8 sourcesQueried;
        uint8 sourcesSuccessful;
        bytes32 attestorSignatureHash;
    }

    address public attestor;
    address public owner;

    mapping(bytes32 => AnchorRecord) public anchors;
    mapping(address => bytes32[]) public agentCerts;
    mapping(address => uint256) public certifiedCount;
    mapping(address => uint256) public warningCount;
    mapping(address => uint256) public failedCount;

    uint256 public totalAnchors;

    event CertificateAnchored(
        bytes32 indexed certHash,
        address indexed agent,
        uint8 certificationLevel,
        uint8 sourceAgreementScore,
        uint8 sourcesQueried,
        uint64 blockNumber
    );

    event ExecutionVerified(
        bytes32 indexed certHash,
        address indexed agent,
        bool honored,
        bytes32 txHash
    );

    event AttestorUpdated(address indexed oldAttestor, address indexed newAttestor);

    modifier onlyAttestor() {
        require(msg.sender == attestor, "Bench: not attestor");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Bench: not owner");
        _;
    }

    constructor(address _attestor) {
        require(_attestor != address(0), "Bench: zero attestor");
        owner = msg.sender;
        attestor = _attestor;
    }

    /**
     * @notice Anchor a single certificate on-chain.
     */
    function anchorCertificate(
        bytes32 certHash,
        address agent,
        uint8 certificationLevel,
        uint8 sourceAgreementScore,
        uint8 sourcesQueried,
        uint8 sourcesSuccessful,
        bytes32 attestorSignatureHash
    ) external onlyAttestor {
        _anchorCertificate(
            certHash, agent, certificationLevel,
            sourceAgreementScore, sourcesQueried,
            sourcesSuccessful, attestorSignatureHash
        );
    }

    /**
     * @notice Anchor multiple certificates in a single transaction.
     * @dev Gas efficient for batch operations.
     */
    function batchAnchor(
        bytes32[] calldata certHashes,
        address[] calldata agents,
        uint8[] calldata levels,
        uint8[] calldata agreementScores,
        uint8[] calldata _sourcesQueried,
        uint8[] calldata _sourcesSuccessful,
        bytes32[] calldata sigHashes
    ) external onlyAttestor {
        uint256 len = certHashes.length;
        require(len == agents.length, "Bench: length mismatch");
        require(len == levels.length, "Bench: length mismatch");
        require(len == agreementScores.length, "Bench: length mismatch");
        require(len == _sourcesQueried.length, "Bench: length mismatch");
        require(len == _sourcesSuccessful.length, "Bench: length mismatch");
        require(len == sigHashes.length, "Bench: length mismatch");

        for (uint256 i = 0; i < len; i++) {
            _anchorCertificate(
                certHashes[i], agents[i], levels[i],
                agreementScores[i], _sourcesQueried[i],
                _sourcesSuccessful[i], sigHashes[i]
            );
        }
    }

    /**
     * @notice Mark a certificate's execution as verified.
     */
    function markExecutionVerified(
        bytes32 certHash,
        bool honored,
        bytes32 txHash
    ) external onlyAttestor {
        require(anchors[certHash].agent != address(0), "Bench: not found");
        emit ExecutionVerified(certHash, anchors[certHash].agent, honored, txHash);
    }

    /**
     * @notice Update the attestor address. Only callable by owner.
     */
    function setAttestor(address newAttestor) external onlyOwner {
        require(newAttestor != address(0), "Bench: zero attestor");
        emit AttestorUpdated(attestor, newAttestor);
        attestor = newAttestor;
    }

    // ========================================================================
    // View Functions
    // ========================================================================

    function getAgentCerts(
        address agent,
        uint256 offset,
        uint256 limit
    ) external view returns (bytes32[] memory) {
        bytes32[] storage all = agentCerts[agent];
        if (offset >= all.length) return new bytes32[](0);

        uint256 end = offset + limit;
        if (end > all.length) end = all.length;

        bytes32[] memory result = new bytes32[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = all[i];
        }
        return result;
    }

    function getAgentStats(address agent) external view returns (
        uint256 certified,
        uint256 warning,
        uint256 failed,
        uint256 total
    ) {
        certified = certifiedCount[agent];
        warning = warningCount[agent];
        failed = failedCount[agent];
        total = certified + warning + failed;
    }

    function getAnchor(bytes32 certHash) external view returns (AnchorRecord memory) {
        return anchors[certHash];
    }

    // ========================================================================
    // Internal
    // ========================================================================

    function _anchorCertificate(
        bytes32 certHash,
        address agent,
        uint8 certificationLevel,
        uint8 sourceAgreementScore,
        uint8 sourcesQueried,
        uint8 sourcesSuccessful,
        bytes32 attestorSignatureHash
    ) internal {
        require(anchors[certHash].agent == address(0), "Bench: already anchored");
        require(certificationLevel <= 2, "Bench: invalid level");
        require(sourceAgreementScore <= 100, "Bench: invalid score");

        anchors[certHash] = AnchorRecord({
            certHash: certHash,
            agent: agent,
            blockNumber: uint64(block.number),
            timestamp: uint64(block.timestamp),
            certificationLevel: certificationLevel,
            sourceAgreementScore: sourceAgreementScore,
            sourcesQueried: sourcesQueried,
            sourcesSuccessful: sourcesSuccessful,
            attestorSignatureHash: attestorSignatureHash
        });

        agentCerts[agent].push(certHash);
        totalAnchors++;

        if (certificationLevel == 2) certifiedCount[agent]++;
        else if (certificationLevel == 1) warningCount[agent]++;
        else failedCount[agent]++;

        emit CertificateAnchored(
            certHash,
            agent,
            certificationLevel,
            sourceAgreementScore,
            sourcesQueried,
            uint64(block.number)
        );
    }
}
