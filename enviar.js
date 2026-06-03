/* api/enviar.js — recebe o briefing do formulário:
   1) guarda no Vercel KV (para o painel), se configurado;
   2) envia por email via Resend (com anexos JSON + TXT).
   O envio nunca derruba a resposta: se faltar config, ainda retorna ok. */

import { kv } from "@vercel/kv";
import { Resend } from "resend";
import { briefToObject, briefToText, briefToHtml, slug } from "./_brief.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const brief = req.body && req.body.brief;
  if (!brief || !brief.empresa) return res.status(400).json({ error: "briefing inválido" });

  const entry = { id: "br-" + Date.now(), ts: new Date().toISOString(), brief };

  // 1) salva no painel (KV). Se o KV não estiver configurado, apenas ignora.
  try { await kv.lpush("briefings", JSON.stringify(entry)); } catch (e) { /* sem KV: segue */ }

  // 2) email
  let emailed = false, emailError = null;
  try {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY ausente");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.DESIGNER_EMAIL || "maria.brito@shakersagencia.com.br";
    const from = process.env.FROM_EMAIL || "Briefing Shakers <onboarding@resend.dev>";
    const nome = slug(brief.empresa);
    await resend.emails.send({
      from,
      to,
      subject: `Novo briefing — ${brief.empresa}`,
      html: briefToHtml(brief),
      attachments: [
        { filename: `briefing-${nome}.json`, content: Buffer.from(JSON.stringify(briefToObject(brief), null, 2)) },
        { filename: `briefing-${nome}.txt`, content: Buffer.from(briefToText(brief)) },
      ],
    });
    emailed = true;
  } catch (e) {
    emailError = String(e && e.message ? e.message : e);
  }

  return res.status(200).json({ ok: true, emailed, emailError });
}
