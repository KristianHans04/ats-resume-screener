import { hashPassword, createToken, createRefreshToken, getJwtSecret } from '../../lib/auth.js';
import { jsonResponse, errorResponse } from '../../lib/response.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  const { username, email, password, role } = body;

  if (!username || !password || !email) {
    return errorResponse('Username, email, and password are required');
  }

  const userRole = (role && role.toUpperCase() === 'RECRUITER') ? 'RECRUITER' : 'CANDIDATE';

  // Check if user exists
  const existing = await env.CSAS_DB.prepare(
    'SELECT id FROM users WHERE username = ? OR email = ?'
  ).bind(username, email).first();

  if (existing) {
    return errorResponse('A user with that username or email already exists');
  }

  const passwordHash = await hashPassword(password);

  const result = await env.CSAS_DB.prepare(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).bind(username, email, passwordHash, userRole).run();

  const userId = result.meta.last_row_id;
  const secret = getJwtSecret(env);

  const tokenPayload = { sub: String(userId), username, role: userRole };
  const access = await createToken(tokenPayload, secret);
  const refresh = await createRefreshToken(tokenPayload, secret);

  return jsonResponse({
    user: { id: userId, username, email, role: userRole },
    access,
    refresh,
    role: userRole,
  }, 201);
}
