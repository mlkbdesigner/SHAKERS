/* api/logout.js — encerra a sessão do painel. */
import { sessionCookie } from "./_auth.js";

export default async function handler(req, res) {
  res.setHeader("Set-Cookie", sessionCookie(true));
  return res.status(200).json({ ok: true });
}
