/* api/_auth.js — verificação de sessão (cookie) para rotas protegidas.
   Arquivos com prefixo _ não viram rotas na Vercel, mas podem ser importados. */

export function isAuthed(req) {
  const secret = process.env.SESSION_SECRET || "shakers-session-secret";
  const cookie = req.headers.cookie || "";
  const m = cookie.match(/(?:^|;\s*)painel=([^;]+)/);
  return !!(m && decodeURIComponent(m[1]) === secret);
}

export function sessionCookie(clear) {
  const secret = process.env.SESSION_SECRET || "shakers-session-secret";
  if (clear) {
    return "painel=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure";
  }
  // 7 dias
  return `painel=${encodeURIComponent(secret)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`;
}
