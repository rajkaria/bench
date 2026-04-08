-- Bench v2 — Initial Database Schema
-- PostgreSQL 16+

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- API Keys (agent authentication)
-- ============================================================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_hash TEXT NOT NULL UNIQUE,         -- SHA-256 of the API key (never store plaintext)
  agent_address TEXT NOT NULL,            -- Wallet address this key belongs to
  label TEXT,                             -- Optional human-readable label
  rate_limit_per_minute INT NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_agent ON api_keys(agent_address);

-- ============================================================================
-- Certificates (BEC v2)
-- ============================================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cert_id TEXT NOT NULL UNIQUE,           -- UUID v4 from the certificate
  cert_hash TEXT NOT NULL UNIQUE,         -- 0x-prefixed SHA-256

  -- Agent
  agent_address TEXT NOT NULL,
  agent_id TEXT,
  agent_framework TEXT,

  -- Trade
  chain_id INT NOT NULL,
  block_number BIGINT NOT NULL,
  trade_timestamp BIGINT NOT NULL,        -- Unix seconds
  input_token_address TEXT NOT NULL,
  input_token_symbol TEXT NOT NULL,
  input_token_amount TEXT NOT NULL,        -- Raw amount (decimal string)
  output_token_address TEXT NOT NULL,
  output_token_symbol TEXT NOT NULL,
  swap_type TEXT NOT NULL,                -- 'single-chain-evm' | 'single-chain-solana' | 'cross-chain'

  -- Consensus
  consensus_best_source TEXT NOT NULL,
  consensus_best_output TEXT NOT NULL,
  consensus_median TEXT NOT NULL,
  consensus_stddev TEXT NOT NULL,
  source_agreement_score SMALLINT NOT NULL CHECK (source_agreement_score BETWEEN 0 AND 100),
  confidence_tier TEXT NOT NULL,           -- 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE'
  sources_queried SMALLINT NOT NULL,
  sources_successful SMALLINT NOT NULL,
  sources_filtered SMALLINT NOT NULL,

  -- Chosen route
  chosen_source TEXT NOT NULL,
  chosen_output TEXT NOT NULL,

  -- Quality
  slippage_delta_bps SMALLINT NOT NULL,
  output_delta TEXT NOT NULL,
  output_delta_usd NUMERIC(18,6) NOT NULL DEFAULT 0,
  certification_level TEXT NOT NULL,       -- 'CERTIFIED' | 'WARNING' | 'FAILED'
  certification_reason TEXT NOT NULL,

  -- Attestor
  attestor_address TEXT NOT NULL,
  attestor_public_key TEXT NOT NULL,
  attestor_signature TEXT NOT NULL,
  signed_at BIGINT NOT NULL,

  -- On-chain anchor (nullable, populated after anchoring)
  anchor_contract TEXT,
  anchor_tx_hash TEXT,
  anchor_block_number BIGINT,
  anchor_chain_id INT,

  -- Full certificate JSON (for API responses and verification)
  full_certificate JSONB NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certs_agent ON certificates(agent_address);
CREATE INDEX idx_certs_chain ON certificates(chain_id);
CREATE INDEX idx_certs_level ON certificates(certification_level);
CREATE INDEX idx_certs_created ON certificates(created_at DESC);
CREATE INDEX idx_certs_agreement ON certificates(source_agreement_score);

-- ============================================================================
-- Source Responses (individual adapter responses per certificate)
-- ============================================================================
CREATE TABLE source_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cert_id TEXT NOT NULL REFERENCES certificates(cert_id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  expected_output_formatted TEXT NOT NULL,
  gas_estimate TEXT NOT NULL DEFAULT '0',
  price_impact_bps SMALLINT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL,
  fetched_at BIGINT NOT NULL,
  is_outlier BOOLEAN NOT NULL DEFAULT FALSE,
  route_summary TEXT,

  UNIQUE(cert_id, source_name)
);

CREATE INDEX idx_source_resp_cert ON source_responses(cert_id);
CREATE INDEX idx_source_resp_source ON source_responses(source_name);

-- ============================================================================
-- Source Failures (adapter failures per certificate)
-- ============================================================================
CREATE TABLE source_failures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cert_id TEXT NOT NULL REFERENCES certificates(cert_id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  error TEXT NOT NULL,
  failed_at BIGINT NOT NULL,

  UNIQUE(cert_id, source_name)
);

-- ============================================================================
-- Execution Verifications (post-trade)
-- ============================================================================
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cert_id TEXT NOT NULL UNIQUE REFERENCES certificates(cert_id) ON DELETE CASCADE,
  tx_hash TEXT NOT NULL,
  actual_output TEXT NOT NULL,
  predicted_output TEXT NOT NULL,
  deviation_bps SMALLINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',  -- 'PENDING' | 'HONORED' | 'VIOLATED'
  mev_detected BOOLEAN DEFAULT FALSE,
  verified_at BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exec_status ON executions(status);
CREATE INDEX idx_exec_tx ON executions(tx_hash);

-- ============================================================================
-- Agent Scores (cached computation)
-- ============================================================================
CREATE TABLE agent_scores (
  agent_address TEXT PRIMARY KEY,
  bench_score SMALLINT NOT NULL DEFAULT 0 CHECK (bench_score BETWEEN 0 AND 100),
  certification_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_slippage_delta_bps NUMERIC(8,2) NOT NULL DEFAULT 0,
  honor_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  volume_consistency NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_certs INT NOT NULL DEFAULT 0,
  certified_count INT NOT NULL DEFAULT 0,
  warning_count INT NOT NULL DEFAULT 0,
  failed_count INT NOT NULL DEFAULT 0,
  honored_count INT NOT NULL DEFAULT 0,
  violated_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Aggregator Reputation (per-source performance tracking)
-- ============================================================================
CREATE TABLE aggregator_stats (
  source_name TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  total_queries INT NOT NULL DEFAULT 0,
  successful_queries INT NOT NULL DEFAULT 0,
  best_rate_count INT NOT NULL DEFAULT 0,   -- Times this source returned consensus best
  avg_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 0,
  uptime_pct NUMERIC(5,2) NOT NULL DEFAULT 100,
  reputation_score SMALLINT NOT NULL DEFAULT 50 CHECK (reputation_score BETWEEN 0 AND 100),
  last_queried_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- On-Chain Anchors (tracking what's been written to BenchRegistry)
-- ============================================================================
CREATE TABLE anchors (
  cert_hash TEXT PRIMARY KEY,
  tx_hash TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  chain_id INT NOT NULL DEFAULT 196,       -- X Layer
  gas_used TEXT,
  anchored_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
