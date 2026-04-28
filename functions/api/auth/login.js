import { verifyPassword, createToken, createRefreshToken, getJwtSecret } from '../../lib/auth.js';
import { jsonResponse, errorResponse } from '../../lib/response.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  const { username, password } = body;

  if (!username || !password) {
    return errorResponse('Username and password are required');
  }

  const user = await env.CSAS_DB.prepare(
    'SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ?'
  ).bind(username, username).first();

  if (!user) {
    return errorResponse('Invalid credentials', 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return errorResponse('Invalid credentials', 401);
  }

  const secret = getJwtSecret(env);
  const tokenPayload = { sub: String(user.id), username: user.username, role: user.role };
  const access = await createToken(tokenPayload, secret);
  const refresh = await createRefreshToken(tokenPayload, secret);

  return jsonResponse({
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    access,
    refresh,
    role: user.role,
  });
}
