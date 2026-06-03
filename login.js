/* api/login.js — confere a senha da equipe e cria a sessão (cookie). */
import { sessionCookie } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const password = (req.body && req.body.password) || "";
  const expected = process.env.TEAM_PASSWORD || "teamshakers";
  if (!password || password !== expected) {
    return res.status(401).json({ ok: false });
  }
  res.setHeader("Set-Cookie", sessionCookie(false));
  return res.status(200).json({ ok: true });
}
