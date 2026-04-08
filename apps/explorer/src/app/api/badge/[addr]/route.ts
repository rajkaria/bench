import { NextResponse } from 'next/server';

/**
 * Badge SVG generator — embeddable verification badge for agents.
 * GET /api/badge/0x742d...bD18
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ addr: string }> },
) {
  const { addr } = await params;

  // In production: fetch agent score from Bench API
  const score = 94;
  const level = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C';
  const color = score >= 90 ? '#22C55E' : score >= 80 ? '#EAB308' : '#EF4444';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="32" viewBox="0 0 200 32">
  <rect width="200" height="32" rx="4" fill="#18181B"/>
  <rect x="140" width="60" height="32" rx="0" fill="${color}"/>
  <rect x="196" y="0" width="4" height="32" rx="0" fill="${color}"/>
  <text x="8" y="21" font-family="monospace" font-size="12" fill="#FAFAFA">Bench NBBO</text>
  <text x="155" y="21" font-family="monospace" font-size="12" fill="#0A0A0A" font-weight="bold">${level} ${score}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
