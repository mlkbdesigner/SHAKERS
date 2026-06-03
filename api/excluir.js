/* api/excluir.js — remove um briefing do painel (protegido por sessão). */
import { kv } from "@vercel/kv";
import { isAuthed } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });
  const id = req.body && req.body.id;
  if (!id) return res.status(400).json({ error: "id ausente" });
  try {
    const raw = await kv.lrange("briefings", 0, -1);
    for (const item of raw || []) {
      const obj = typeof item === "string" ? JSON.parse(item) : item;
      if (obj && obj.id === id) {
        await kv.lrem("briefings", 1, item);
        break;
      }
    }
  } catch (e) { /* sem KV: nada a fazer */ }
  return res.status(200).json({ ok: true });
}
