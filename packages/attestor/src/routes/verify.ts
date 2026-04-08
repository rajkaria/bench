import { Hono } from 'hono';
import { verifyCertHash, verifyCertificateSignature, type CertLevelKey } from '@bench/shared';
import type { BestExecutionCertificateV2, CertHashableBody } from '@bench/shared';

export function createVerifyRoute() {
  const app = new Hono();

  /** Verify a certificate's integrity and attestor signature. */
  app.post('/v1/verify', async (c) => {
    const cert = await c.req.json<BestExecutionCertificateV2>();

    if (!cert.certHash || !cert.attestor?.signature) {
      return c.json({ error: 'certHash and attestor.signature are required' }, 400);
    }

    // Step 1: Verify the cert hash matches the body
    const hashableBody: CertHashableBody = {
      version: cert.version,
      certId: cert.certId,
      agent: cert.agent,
      trade: cert.trade,
      sources: cert.sources,
      consensus: cert.consensus,
      chosen: cert.chosen,
      quality: cert.quality,
    };

    const hashValid = verifyCertHash(hashableBody, cert.certHash);

    // Step 2: Verify the attestor signature
    let signatureValid = false;
    let recoveredAddress: string | null = null;

    try {
      recoveredAddress = await verifyCertificateSignature(
        cert.attestor.signature as `0x${string}`,
        cert.certHash as `0x${string}`,
        cert.quality.certificationLevel as CertLevelKey,
        cert.consensus.sourceAgreementScore,
        cert.attestor.signedAt,
      );
      signatureValid = recoveredAddress.toLowerCase() === cert.attestor.address.toLowerCase();
    } catch {
      signatureValid = false;
    }

    return c.json({
      valid: hashValid && signatureValid,
      checks: {
        hashValid,
        signatureValid,
        recoveredAddress,
        expectedAddress: cert.attestor.address,
      },
      certificate: {
        certId: cert.certId,
        certificationLevel: cert.quality.certificationLevel,
        sourceAgreementScore: cert.consensus.sourceAgreementScore,
        confidenceTier: cert.consensus.confidenceTier,
        sourcesQueried: cert.sources.queried.length,
        sourcesSuccessful: cert.sources.successful.length,
      },
    });
  });

  return app;
}
