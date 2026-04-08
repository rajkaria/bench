import { describe, it, expect } from 'vitest';
import { AGENT_CONFIG } from '../agent.js';

describe('demo-agent config', () => {
  it('has default agent ID', () => {
    expect(AGENT_CONFIG.agentId).toBe('bench-demo-agent');
  });

  it('has default framework', () => {
    expect(AGENT_CONFIG.framework).toBe('custom-ts');
  });

  it('defaults to X Layer chain', () => {
    expect(AGENT_CONFIG.chainId).toBe(196);
  });

  it('has a 5-minute default interval', () => {
    expect(AGENT_CONFIG.intervalMs).toBe(300000);
  });
});
