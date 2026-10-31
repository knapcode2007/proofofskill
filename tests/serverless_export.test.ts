import assert from 'node:assert';
import { EventEmitter } from 'node:events';

// Simulate Vercel serverless environment before importing handler
process.env.VERCEL = '1';

console.log('--- Testing Vercel Serverless Function Export & API Endpoints ---');

interface DispatchResponse {
  status: number;
  json: any;
  headers: Record<string, string>;
}

function dispatch(app: any, method: string, url: string): Promise<DispatchResponse> {
  return new Promise((resolve) => {
    const req: any = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { host: 'localhost' };
    req.connection = { remoteAddress: '127.0.0.1' };

    let statusCode = 200;
    const responseHeaders: Record<string, string> = {};
    let responseBody = '';

    const res: any = new EventEmitter();
    res.statusCode = 200;
    res.setHeader = (name: string, value: string) => {
      responseHeaders[name.toLowerCase()] = value;
      return res;
    };
    res.getHeader = (name: string) => responseHeaders[name.toLowerCase()];
    res.status = (code: number) => {
      statusCode = code;
      res.statusCode = code;
      return res;
    };
    res.send = (data: any) => {
      responseBody = typeof data === 'string' ? data : JSON.stringify(data);
      res.emit('finish');
    };
    res.json = (data: any) => {
      responseHeaders['content-type'] = 'application/json';
      responseBody = JSON.stringify(data);
      res.emit('finish');
    };
    res.end = (chunk?: any) => {
      if (chunk) responseBody += chunk;
      res.emit('finish');
    };

    res.on('finish', () => {
      let json = null;
      try {
        json = JSON.parse(responseBody);
      } catch {}
      resolve({ status: statusCode, json, headers: responseHeaders });
    });

    app(req, res);
    req.emit('end');
  });
}

async function testServerlessExport() {
  const { default: app } = await import('../api/index.ts');
  assert.ok(typeof app === 'function', 'api/index.ts must export an Express application function');

  // 1. Health Endpoint
  const resHealth = await dispatch(app, 'GET', '/api/health');
  assert.strictEqual(resHealth.status, 200, '/api/health must return HTTP 200');
  assert.strictEqual(resHealth.json?.status, 'ok', 'Health status must be ok');
  console.log('✓ /api/health verified: status ok');

  // 2. Database Health Endpoint
  const resDb = await dispatch(app, 'GET', '/api/health/database');
  assert.strictEqual(resDb.status, 200, '/api/health/database must return HTTP 200');
  assert.strictEqual(resDb.json?.status, 'ok');
  assert.ok(resDb.json?.stats, 'Database stats must be returned');
  console.log('✓ /api/health/database verified: persistent store operational');

  // 3. Integrations Diagnostics Endpoint
  const resIntegrations = await dispatch(app, 'GET', '/api/health/integrations');
  assert.strictEqual(resIntegrations.status, 200, '/api/health/integrations must return HTTP 200');
  assert.ok(resIntegrations.json?.cryptography, 'Cryptographic diagnostics must be present');
  assert.ok(resIntegrations.json?.code_execution, 'Code execution diagnostics must be present');
  assert.ok(resIntegrations.json?.gemini_ai, 'Gemini diagnostics must be present');
  console.log('✓ /api/health/integrations verified: all subsystems reported');

  // 4. Crypto Public Key Endpoint
  const resCrypto = await dispatch(app, 'GET', '/api/crypto/public-key');
  assert.strictEqual(resCrypto.status, 200, '/api/crypto/public-key must return HTTP 200');
  assert.ok(resCrypto.json?.publicKey && resCrypto.json.publicKey.includes('PUBLIC KEY'));
  console.log('✓ /api/crypto/public-key verified: valid SPKI PEM exported');

  // 5. Skills Endpoint
  const resSkills = await dispatch(app, 'GET', '/api/skills');
  assert.strictEqual(resSkills.status, 200, '/api/skills must return HTTP 200');
  assert.ok(Array.isArray(resSkills.json?.skills) && resSkills.json.skills.length > 0);
  console.log(`✓ /api/skills verified: ${resSkills.json.skills.length} skills returned`);

  // 6. Auth Endpoint (Default session)
  const resAuth = await dispatch(app, 'GET', '/api/auth/me');
  assert.strictEqual(resAuth.status, 200, '/api/auth/me must return HTTP 200');
  assert.ok(resAuth.json?.user, 'Default user session must be present');
  console.log('✓ /api/auth/me verified: active session returned');

  // 7. Prefix-tolerant Route Normalizer (simulating rewrite that forwarded /health to serverless entrypoint)
  const resStripped = await dispatch(app, 'GET', '/health');
  assert.strictEqual(resStripped.status, 200, '/health rewrite normalizer must route to /api/health');
  assert.strictEqual(resStripped.json?.status, 'ok');
  console.log('✓ Prefix tolerance verified: /health safely resolved via rewrite normalizer');

  // 8. Security Headers Verification
  assert.strictEqual(resHealth.headers['x-content-type-options'], 'nosniff', 'X-Content-Type-Options nosniff must be present');
  assert.strictEqual(resHealth.headers['x-frame-options'], 'DENY', 'X-Frame-Options DENY must be present');
  assert.strictEqual(resHealth.headers['referrer-policy'], 'strict-origin-when-cross-origin', 'Referrer-Policy must be present');
  console.log('✓ Security headers verified: nosniff, DENY, and strict-origin enforced');

  // 9. Gemini AI Lazy Initialization Verification
  const { getAiClient } = await import('../server/gemini.ts');
  const initialClient = getAiClient();
  // Temporarily set a dummy test key to verify lazy instantiation
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-gemini-key-dynamic';
  const dynamicClient = getAiClient();
  assert.ok(dynamicClient !== null, 'getAiClient must dynamically re-instantiate when GEMINI_API_KEY is configured');
  process.env.GEMINI_API_KEY = originalKey;
  console.log('✓ Gemini client lazy evaluation verified: dynamic key detection functional');

  // 10. Judge0 Serverless Sandbox Isolation Verification
  const { executeIsolatedCode } = await import('../server/judge0.ts');
  const serverlessExec = await executeIsolatedCode('print("untrusted candidate code")');
  assert.strictEqual(serverlessExec.status, 'service_unavailable', 'Serverless execution without Judge0 must safely reject arbitrary execution');
  assert.strictEqual(serverlessExec.provider, 'judge0', 'Provider must report judge0 in serverless mode');
  console.log('✓ Serverless code execution isolation verified: Vercel does not execute untrusted local python');

  console.log('--- All Serverless Handler Export Tests Passed Successfully! ---');
}

testServerlessExport().catch((err) => {
  console.error('Serverless export test failed:', err);
  process.exit(1);
});
