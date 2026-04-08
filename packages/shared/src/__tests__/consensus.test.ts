import { describe, it, expect } from 'vitest';
import { scoreToConfidenceTier, computeCertificationLevel } from '../types/consensus.js';

describe('scoreToConfidenceTier', () => {
  it('returns STRONG for 90-100', () => {
    expect(scoreToConfidenceTier(90)).toBe('STRONG');
    expect(scoreToConfidenceTier(95)).toBe('STRONG');
    expect(scoreToConfidenceTier(100)).toBe('STRONG');
  });

  it('returns MODERATE for 70-89', () => {
    expect(scoreToConfidenceTier(70)).toBe('MODERATE');
    expect(scoreToConfidenceTier(80)).toBe('MODERATE');
    expect(scoreToConfidenceTier(89)).toBe('MODERATE');
  });

  it('returns WEAK for 50-69', () => {
    expect(scoreToConfidenceTier(50)).toBe('WEAK');
    expect(scoreToConfidenceTier(60)).toBe('WEAK');
    expect(scoreToConfidenceTier(69)).toBe('WEAK');
  });

  it('returns NONE for 0-49', () => {
    expect(scoreToConfidenceTier(0)).toBe('NONE');
    expect(scoreToConfidenceTier(25)).toBe('NONE');
    expect(scoreToConfidenceTier(49)).toBe('NONE');
  });
});

describe('computeCertificationLevel', () => {
  describe('CERTIFIED', () => {
    it('certifies within 10 bps with strong agreement', () => {
      expect(computeCertificationLevel(5, 92, 8)).toBe('CERTIFIED');
    });

    it('certifies at exactly 10 bps with agreement >= 70', () => {
      expect(computeCertificationLevel(10, 70, 5)).toBe('CERTIFIED');
    });
  });

  describe('WARNING', () => {
    it('warns for 10-50 bps delta', () => {
      expect(computeCertificationLevel(15, 92, 8)).toBe('WARNING');
      expect(computeCertificationLevel(50, 92, 8)).toBe('WARNING');
    });

    it('warns for agreement 50-69 even with good bps', () => {
      expect(computeCertificationLevel(5, 60, 5)).toBe('WARNING');
      expect(computeCertificationLevel(5, 50, 5)).toBe('WARNING');
    });

    it('warns for single source regardless of other factors', () => {
      expect(computeCertificationLevel(0, 100, 1)).toBe('WARNING');
      expect(computeCertificationLevel(5, 95, 1)).toBe('WARNING');
    });
  });

  describe('FAILED', () => {
    it('fails for > 50 bps delta', () => {
      expect(computeCertificationLevel(51, 92, 8)).toBe('FAILED');
      expect(computeCertificationLevel(100, 92, 8)).toBe('FAILED');
    });

    it('fails for agreement < 50', () => {
      expect(computeCertificationLevel(5, 49, 8)).toBe('FAILED');
      expect(computeCertificationLevel(5, 0, 8)).toBe('FAILED');
    });

    it('fails for both bad bps and bad agreement', () => {
      expect(computeCertificationLevel(100, 20, 8)).toBe('FAILED');
    });
  });

  describe('edge cases', () => {
    it('handles zero bps delta with perfect agreement', () => {
      expect(computeCertificationLevel(0, 100, 10)).toBe('CERTIFIED');
    });

    it('handles exactly 2 sources', () => {
      expect(computeCertificationLevel(5, 95, 2)).toBe('CERTIFIED');
    });
  });
});
