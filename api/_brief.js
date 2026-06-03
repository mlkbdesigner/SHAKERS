/* api/_brief.js — monta o briefing em objeto / texto / HTML (lado servidor).
   Espelha a leitura do front (Summary.jsx). */

function allOf(b, a, c) {
  return [...(b[a] || []), ...(b[c] || [])];
}
export function slug(s) {
  return (s || "marca").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function briefToObject(b) {
  return {
    recebido_em: new Date().toISOString(),
    empresa: b.empresa || "",
    nicho: b.nicho || "",
    o_que_faz: b.frase || "",
    historia_proposito: b.historia || "",
    valores: allOf(b, "valores", "valoresCustom"),
    palavras_chave: allOf(b, "palavras", "palavrasCustom"),
    tom_de_voz: allOf(b, "tom", "tomCustom"),
    se_fosse_pessoa: b.persona || "",
    sensacoes_que_quer: allOf(b, "sensacoesQuer", "sensacoesQuerCustom"),
    sensacoes_que_nao_quer: allOf(b, "sensacoesNao", "sensacoesNaoCustom"),
    publico_alvo: b.publico || "",
    concorrentes: b.concorrentes || "",
    diferencial: b.diferencial || "",
    estilo_visual: allOf(b, "estilo", "estiloCustom"),
    cores_preferidas: b.coresPref || "",
    cores_a_evitar: b.coresEvitar || "",
    elementos_restricoes: b.restricoes || "",
    observacoes: b.obs || "",
  };
}

export function briefToText(b) {
  const j = (a) => a.join(", ") || "—";
  const L = [];
  L.push(`BRIEFING DE MARCA — ${b.empresa || "Sem nome"}`);
  L.push(`Recebido em ${new Date().toLocaleString("pt-BR")}`);
  L.push("");
  L.push("— EMPRESA —");
  L.push(`Nicho/segmento: ${b.nicho || "—"}`);
  L.push(`O que faz: ${b.frase || "—"}`);
  L.push(`História & propósito: ${b.historia || "—"}`);
  L.push(`Valores: ${j(allOf(b, "valores", "valoresCustom"))}`);
  L.push("");
  L.push("— PERSONALIDADE —");
  L.push(`Palavras-chave: ${j(allOf(b, "palavras", "palavrasCustom"))}`);
  L.push(`Tom de voz: ${j(allOf(b, "tom", "tomCustom"))}`);
  if (b.persona) L.push(`Se fosse uma pessoa: ${b.persona}`);
  L.push("");
  L.push("— SENSAÇÕES —");
  L.push(`QUER transmitir: ${j(allOf(b, "sensacoesQuer", "sensacoesQuerCustom"))}`);
  L.push(`NÃO quer transmitir: ${j(allOf(b, "sensacoesNao", "sensacoesNaoCustom"))}`);
  L.push("");
  L.push("— PÚBLICO & POSICIONAMENTO —");
  L.push(`Público-alvo: ${b.publico || "—"}`);
  L.push(`Concorrentes: ${b.concorrentes || "—"}`);
  L.push(`Diferencial: ${b.diferencial || "—"}`);
  L.push("");
  L.push("— PREFERÊNCIAS VISUAIS —");
  L.push(`Estilo: ${j(allOf(b, "estilo", "estiloCustom"))}`);
  L.push(`Cores preferidas: ${b.coresPref || "—"}`);
  L.push(`Cores/elementos a evitar: ${b.coresEvitar || "—"}`);
  L.push(`Elementos obrigatórios / restrições: ${b.restricoes || "—"}`);
  L.push("");
  L.push("— OBSERVAÇÕES —");
  L.push(b.obs || "—");
  return L.join("\n");
}

export function briefToHtml(b) {
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const chips = (arr, color) => (arr.length
    ? `<div>${arr.map((t) => `<span style="display:inline-block;background:${color || "#eef6f1"};color:#15623f;border:1px solid #cfe6d8;border-radius:999px;padding:3px 11px;font-size:13px;margin:0 6px 6px 0;">${esc(t)}</span>`).join("")}</div>`
    : `<span style="color:#9aa49d;">—</span>`);
  const row = (k, v) => `<tr><td style="padding:11px 0;border-bottom:1px solid #ececec;vertical-align:top;width:38%;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8a948c;font-weight:700;">${esc(k)}</td><td style="padding:11px 0 11px 16px;border-bottom:1px solid #ececec;font-size:15px;color:#1a201c;">${v}</td></tr>`;
  const txt = (s) => (s ? esc(s) : `<span style="color:#9aa49d;">—</span>`);
  const quer = allOf(b, "sensacoesQuer", "sensacoesQuerCustom");
  const nao = allOf(b, "sensacoesNao", "sensacoesNaoCustom");

  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f7f3;font-family:Helvetica,Arial,sans-serif;padding:28px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e1e7df;border-radius:16px;overflow:hidden;">
    <div style="background:#1b9460;color:#fff;padding:24px 28px;">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85;">Novo briefing recebido</div>
      <div style="font-size:26px;font-weight:700;margin-top:4px;">${esc(b.empresa || "Marca sem nome")}</div>
    </div>
    <div style="padding:10px 28px 26px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Nicho / segmento", txt(b.nicho))}
        ${row("O que faz", txt(b.frase))}
        ${row("História & propósito", txt(b.historia))}
        ${row("Valores", chips(allOf(b, "valores", "valoresCustom")))}
        ${row("Palavras-chave", chips(allOf(b, "palavras", "palavrasCustom")))}
        ${row("Tom de voz", chips(allOf(b, "tom", "tomCustom")))}
        ${row("Se fosse uma pessoa", txt(b.persona))}
        ${row("Sensações que QUER", chips(quer, "#e6f3ec"))}
        ${row("Sensações que NÃO quer", chips(nao, "#f7e6e2"))}
        ${row("Público-alvo", txt(b.publico))}
        ${row("Concorrentes", txt(b.concorrentes))}
        ${row("Diferencial", txt(b.diferencial))}
        ${row("Estilo visual", chips(allOf(b, "estilo", "estiloCustom")))}
        ${row("Cores preferidas", txt(b.coresPref))}
        ${row("Cores a evitar", txt(b.coresEvitar))}
        ${row("Elementos / restrições", txt(b.restricoes))}
        ${row("Observações", txt(b.obs))}
      </table>
      <p style="color:#8a948c;font-size:12px;margin-top:20px;">JSON e TXT do briefing seguem em anexo. Você também pode ver tudo no painel da equipe.</p>
    </div>
  </div>
  </body></html>`;
}
