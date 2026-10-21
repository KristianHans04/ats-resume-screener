import { verifyToken, getJwtSecret } from '../lib/auth.js';
import { corsHeaders, errorResponse } from '../lib/response.js';

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register'];

export async function onRequest(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

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

      context.data = context.data || {};
      context.data.user = {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    }

    const response = await context.next();
    return addCors(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[CSAS] Middleware error:", message, stack);
    return addCors(new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      code: "MIDDLEWARE_ERROR",
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
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
