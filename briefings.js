/* api/briefings.js — lista os briefings recebidos (protegido por sessão). */
import { kv } from "@vercel/kv";
import { isAuthed } from "./_auth.js";

export default async function handler(req, res) {
  if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });
  let briefings = [];
  try {
    const raw = await kv.lrange("briefings", 0, -1);
    briefings = (raw || []).map((x) => (typeof x === "string" ? JSON.parse(x) : x));
  } catch (e) { /* sem KV: lista vazia */ }
  return res.status(200).json({ briefings });
}
