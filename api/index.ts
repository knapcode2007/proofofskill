import app from '../server.ts';

// Vercel Serverless Function entrypoint
export default function handler(req: any, res: any) {
  // If request arrived at the serverless entrypoint without /api prefix, normalize it
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
