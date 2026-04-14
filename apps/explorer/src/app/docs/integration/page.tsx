export default function IntegrationPage() {
  return (
    <div className="prose-bench">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Integration Guide</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        Integrate Bench into your agent in minutes. One API call to certify best-execution.
      </p>

      {/* Quick Start */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Start</h2>

        <h3 className="text-lg font-bold mb-3">1. Request a Certified Quote</h3>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-6">
          <span className="text-bench-dim">{'// POST /v1/certify'}</span><br />
          <span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-zinc-500">&apos;https://attestor.usebench.xyz/v1/certify&apos;</span>, {'{'}<br />
          {'  '}method: <span className="text-zinc-500">&apos;POST&apos;</span>,<br />
          {'  '}headers: {'{'}<br />
          {'    '}<span className="text-zinc-500">&apos;Content-Type&apos;</span>: <span className="text-zinc-500">&apos;application/json&apos;</span>,<br />
          {'    '}<span className="text-zinc-500">&apos;X-API-Key&apos;</span>: <span className="text-zinc-500">&apos;your-api-key&apos;</span>,<br />
          {'  }'},{'{'}',<br />
          {'  '}body: JSON.stringify({'{'}<br />
          {'    '}inputToken: <span className="text-zinc-500">&apos;0xEeeeeE...&apos;</span>, <span className="text-bench-dim">// ETH</span><br />
          {'    '}outputToken: <span className="text-zinc-500">&apos;0xA0b86...&apos;</span>, <span className="text-bench-dim">// USDC</span><br />
          {'    '}inputAmount: <span className="text-zinc-500">&apos;1000000000000000000&apos;</span>, <span className="text-bench-dim">// 1 ETH in wei</span><br />
          {'    '}chainId: <span className="text-purple-400">196</span>,<br />
          {'    '}agentAddress: <span className="text-zinc-500">&apos;0xYourAgent...&apos;</span>,<br />
          {'  }'})<br />
          {'}'});
        </div>

        <h3 className="text-lg font-bold mb-3">2. Use the Certificate</h3>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-6">
          <span className="text-blue-400">const</span> cert = <span className="text-blue-400">await</span> response.json();<br /><br />
          <span className="text-bench-dim">{'// Execute the swap using the best source'}</span><br />
          console.log(cert.bestSource); <span className="text-bench-dim">{'// "1inch"'}</span><br />
          console.log(cert.bestOutputAmount); <span className="text-bench-dim">{'// "2847320000"'}</span><br />
          console.log(cert.certificationLevel); <span className="text-bench-dim">{'// "CERTIFIED"'}</span><br /><br />
          <span className="text-bench-dim">{'// Store the certificate for proof'}</span><br />
          console.log(cert.certHash); <span className="text-bench-dim">{'// "0xabc..."'}</span><br />
          console.log(cert.signature); <span className="text-bench-dim">{'// EIP-712 signature'}</span>
        </div>

        <h3 className="text-lg font-bold mb-3">3. Verify (Optional)</h3>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-4">
          <span className="text-blue-400">import</span> {'{ verify }'} <span className="text-blue-400">from</span> <span className="text-zinc-500">&apos;@usebench/verifier&apos;</span>;<br /><br />
          <span className="text-blue-400">const</span> isValid = <span className="text-blue-400">await</span> verify(cert);<br />
          console.log(isValid); <span className="text-bench-dim">{'// true'}</span>
        </div>
      </section>

      {/* API Reference */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold tracking-tight mb-6">API Reference</h2>

        {/* Certify */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 rounded text-xs font-bold bg-bench-green/10 text-bench-green border border-bench-green/20">POST</span>
            <code className="text-sm font-mono text-white">/v1/certify</code>
          </div>
          <p className="text-sm text-bench-muted mb-4">Request a certified best-execution quote. Requires API key.</p>

          <h4 className="text-sm font-bold mb-2">Request Body</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bench-border-subtle">
                  <th className="text-left py-2 pr-4 text-bench-dim font-medium">Field</th>
                  <th className="text-left py-2 pr-4 text-bench-dim font-medium">Type</th>
                  <th className="text-left py-2 text-bench-dim font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-bench-border-subtle">
                  <td className="py-2 pr-4 font-mono text-xs">inputToken</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2">Token address or symbol (e.g., &quot;ETH&quot;)</td>
                </tr>
                <tr className="border-b border-bench-border-subtle">
                  <td className="py-2 pr-4 font-mono text-xs">outputToken</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2">Token address or symbol (e.g., &quot;USDC&quot;)</td>
                </tr>
                <tr className="border-b border-bench-border-subtle">
                  <td className="py-2 pr-4 font-mono text-xs">inputAmount</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2">Amount in smallest unit (wei)</td>
                </tr>
                <tr className="border-b border-bench-border-subtle">
                  <td className="py-2 pr-4 font-mono text-xs">chainId</td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2">Target chain (196 for X Layer)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">agentAddress</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2">Your agent&apos;s wallet address</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Read endpoints */}
        <h3 className="text-lg font-bold mb-4 mt-10">Read Endpoints (Public)</h3>
        <div className="space-y-4">
          {[
            { method: 'GET', path: '/v1/stats', desc: 'Global statistics (total certs, certified rate, avg agreement)' },
            { method: 'GET', path: '/v1/certs', desc: 'Recent certificates (paginated)' },
            { method: 'GET', path: '/v1/certs/:hash', desc: 'Single certificate by hash' },
            { method: 'GET', path: '/v1/aggregators', desc: 'Aggregator performance rankings' },
            { method: 'GET', path: '/v1/agents', desc: 'Agent leaderboard' },
            { method: 'GET', path: '/v1/agents/:addr', desc: 'Single agent profile and history' },
          ].map((ep) => (
            <div key={ep.path} className="flex items-start gap-3">
              <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                {ep.method}
              </span>
              <div>
                <code className="text-sm font-mono text-white">{ep.path}</code>
                <p className="text-sm text-bench-muted mt-0.5">{ep.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Error Handling */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Error Handling</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          The API returns standard HTTP status codes. Errors include a JSON body with details:
        </p>
        <div className="bg-bench-surface border border-bench-border-subtle rounded-xl p-5 font-mono text-sm text-zinc-400 leading-[1.8] mb-4">
          {'{'}<br />
          {'  '}<span className="text-zinc-500">&quot;error&quot;</span>: <span className="text-zinc-500">&quot;Insufficient sources responded&quot;</span>,<br />
          {'  '}<span className="text-zinc-500">&quot;code&quot;</span>: <span className="text-zinc-500">&quot;INSUFFICIENT_SOURCES&quot;</span>,<br />
          {'  '}<span className="text-zinc-500">&quot;sourcesResponded&quot;</span>: <span className="text-purple-400">1</span>,<br />
          {'  '}<span className="text-zinc-500">&quot;minimumRequired&quot;</span>: <span className="text-purple-400">2</span><br />
          {'}'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bench-border-subtle">
                <th className="text-left py-2 pr-4 text-bench-dim font-medium">Code</th>
                <th className="text-left py-2 text-bench-dim font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-bench-border-subtle">
                <td className="py-2 pr-4 font-mono text-xs">400</td>
                <td className="py-2">Invalid request (missing fields, invalid token)</td>
              </tr>
              <tr className="border-b border-bench-border-subtle">
                <td className="py-2 pr-4 font-mono text-xs">401</td>
                <td className="py-2">Missing or invalid API key</td>
              </tr>
              <tr className="border-b border-bench-border-subtle">
                <td className="py-2 pr-4 font-mono text-xs">429</td>
                <td className="py-2">Rate limit exceeded</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">503</td>
                <td className="py-2">Insufficient sources available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Nav */}
      <div className="pt-8 border-t border-bench-border-subtle flex justify-between">
        <a href="/docs/who-should-use" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          ← Who Should Use Bench
        </a>
        <a href="/docs/architecture" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Architecture →
        </a>
      </div>
    </div>
  );
}
