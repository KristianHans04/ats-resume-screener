import { verifyToken, getJwtSecret } from '../lib/auth.js';
import { corsHeaders, errorResponse } from '../lib/response.js';

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register'];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, ''); // strip trailing slash

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // Skip auth for public paths
  if (!PUBLIC_PATHS.includes(path)) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return addCors(errorResponse('Authentication required', 401));
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, getJwtSecret(env));
    if (!payload) {
      return addCors(errorResponse('Invalid or expired token', 401));
    }

    // Attach user info to the context
    context.data = context.data || {};
    context.data.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }

  // Continue to the function handler
  const response = await context.next();
  return addCors(response);
}

function addCors(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders())) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
