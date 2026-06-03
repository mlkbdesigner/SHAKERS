/* ============================================================
   Summary.jsx — detalhe read-only de um briefing (usado no Painel)
   + helpers de exportação (texto / JSON / PDF)
   ============================================================ */

function allKeywords(brief) {
  return [...(brief.palavras || []), ...(brief.palavrasCustom || [])];
}
function allTones(brief) {
  return [...(brief.tom || []), ...(brief.tomCustom || [])];
}
function allOf(brief, stdKey, customKey) {
  return [...(brief[stdKey] || []), ...(brief[customKey] || [])];
}

function buildBriefObject(brief) {
  return {
    gerado_em: new Date().toISOString(),
    empresa: brief.empresa,
    nicho: brief.nicho,
    o_que_faz: brief.frase,
    historia_proposito: brief.historia,
    valores: allOf(brief, "valores", "valoresCustom"),
    palavras_chave: allKeywords(brief),
    tom_de_voz: allTones(brief),
    se_fosse_pessoa: brief.persona,
    sensacoes_que_quer: allOf(brief, "sensacoesQuer", "sensacoesQuerCustom"),
    sensacoes_que_nao_quer: allOf(brief, "sensacoesNao", "sensacoesNaoCustom"),
    publico_alvo: brief.publico,
    concorrentes: brief.concorrentes,
    diferencial: brief.diferencial,
    estilo_visual: allOf(brief, "estilo", "estiloCustom"),
    cores_preferidas: brief.coresPref,
    cores_a_evitar: brief.coresEvitar,
    elementos_restricoes: brief.restricoes,
    observacoes: brief.obs,
  };
}

function buildPlainText(brief) {
  const L = [];
  const j = (a) => a.join(", ") || "—";
  L.push(`BRIEFING DE MARCA — ${brief.empresa || "Sem nome"}`);
  L.push(`Gerado em ${new Date().toLocaleString("pt-BR")}`);
  L.push("");
  L.push("— EMPRESA —");
  L.push(`Nicho/segmento: ${brief.nicho || "—"}`);
  L.push(`O que faz: ${brief.frase || "—"}`);
  L.push(`História & propósito: ${brief.historia || "—"}`);
  L.push(`Valores: ${j(allOf(brief, "valores", "valoresCustom"))}`);
  L.push("");
  L.push("— PERSONALIDADE —");
  L.push(`Palavras-chave: ${j(allKeywords(brief))}`);
  L.push(`Tom de voz: ${j(allTones(brief))}`);
  if (brief.persona) L.push(`Se fosse uma pessoa: ${brief.persona}`);
  L.push("");
  L.push("— SENSAÇÕES —");
  L.push(`QUER transmitir: ${j(allOf(brief, "sensacoesQuer", "sensacoesQuerCustom"))}`);
  L.push(`NÃO quer transmitir: ${j(allOf(brief, "sensacoesNao", "sensacoesNaoCustom"))}`);
  L.push("");
  L.push("— PÚBLICO & POSICIONAMENTO —");
  L.push(`Público-alvo: ${brief.publico || "—"}`);
  L.push(`Concorrentes: ${brief.concorrentes || "—"}`);
  L.push(`Diferencial: ${brief.diferencial || "—"}`);
  L.push("");
  L.push("— PREFERÊNCIAS VISUAIS —");
  L.push(`Estilo: ${j(allOf(brief, "estilo", "estiloCustom"))}`);
  L.push(`Cores preferidas: ${brief.coresPref || "—"}`);
  L.push(`Cores/elementos a evitar: ${brief.coresEvitar || "—"}`);
  L.push(`Elementos obrigatórios / restrições: ${brief.restricoes || "—"}`);
  L.push("");
  L.push("— OBSERVAÇÕES —");
  L.push(brief.obs || "—");
  return L.join("\n");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function SumRow({ k, children, empty }) {
  return (
    <div className="sum-row">
      <div className="k">{k}</div>
      <div className={"v" + (empty ? " empty" : "")}>{children}</div>
    </div>
  );
}

function Tags({ items, plain }) {
  if (!items.length) return <span className="v empty">—</span>;
  return (
    <div className="tag-row">
      {items.map((t) => <span key={t} className={"tag" + (plain ? " plain" : "")}>{t}</span>)}
    </div>
  );
}

function FeelTags({ items, kind }) {
  if (!items.length) return <span className="v empty">—</span>;
  return (
    <div className="tag-row">
      {items.map((t) => <span key={t} className={"tag feel-" + kind}>{t}</span>)}
    </div>
  );
}

function fmtDate(ts) {
  try { return new Date(ts).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}

/* Detalhe read-only de um briefing — usado no Painel da equipe */
function BriefingDetail({ brief, ts, onBack, toast }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(buildPlainText(brief)); toast("Briefing copiado!"); }
    catch (e) { toast("Não foi possível copiar"); }
  };
  const dlJSON = () => {
    download(`briefing-${(brief.empresa || "marca").toLowerCase().replace(/\s+/g, "-")}.json`,
      JSON.stringify(buildBriefObject(brief), null, 2), "application/json");
    toast("JSON baixado!");
  };
  const dlPDF = () => { window.print(); };

  const kws = allKeywords(brief);
  const quer = allOf(brief, "sensacoesQuer", "sensacoesQuerCustom");
  const nao = allOf(brief, "sensacoesNao", "sensacoesNaoCustom");
  const valores = allOf(brief, "valores", "valoresCustom");
  const estilo = allOf(brief, "estilo", "estiloCustom");

  return (
    <div className="view">
      <div className="detail-top">
        <button className="btn btn-ghost" onClick={onBack}>← Voltar ao painel</button>
        <div className="detail-actions">
          <button className="btn btn-soft" onClick={copy}>📋 Copiar</button>
          <button className="btn btn-soft" onClick={dlPDF}>📄 PDF</button>
          <button className="btn btn-soft" onClick={dlJSON}>{ "{ }" } JSON</button>
        </div>
      </div>

      <div className="detail-wrap">
        <div className="sumcard">
          <div className="sc-head">
            <div className="eyebrow">Briefing recebido{ts ? " · " + fmtDate(ts) : ""}</div>
            <h2>{brief.empresa || "Marca sem nome"}</h2>
          </div>
          <div className="sc-body">
            <SumRow k="Nicho / segmento" empty={!brief.nicho}>{brief.nicho || "—"}</SumRow>
            <SumRow k="O que faz" empty={!brief.frase}>{brief.frase || "—"}</SumRow>
            <SumRow k="História & propósito" empty={!brief.historia}>{brief.historia || "—"}</SumRow>
            <SumRow k="Valores"><Tags items={valores} /></SumRow>
            <SumRow k="Palavras-chave"><Tags items={kws} /></SumRow>
            <SumRow k="Tom de voz"><Tags items={allTones(brief)} plain /></SumRow>
            <SumRow k="Se fosse uma pessoa" empty={!brief.persona}>{brief.persona || "—"}</SumRow>
            <SumRow k="Sensações que QUER transmitir"><FeelTags items={quer} kind="yes" /></SumRow>
            <SumRow k="Sensações que NÃO quer transmitir"><FeelTags items={nao} kind="no" /></SumRow>
            <SumRow k="Público-alvo" empty={!brief.publico}>{brief.publico || "—"}</SumRow>
            <SumRow k="Concorrentes" empty={!brief.concorrentes}>{brief.concorrentes || "—"}</SumRow>
            <SumRow k="Diferencial" empty={!brief.diferencial}>{brief.diferencial || "—"}</SumRow>
            <SumRow k="Estilo visual"><Tags items={estilo} plain /></SumRow>
            <SumRow k="Cores preferidas" empty={!brief.coresPref}>{brief.coresPref || "—"}</SumRow>
            <SumRow k="Cores / elementos a evitar" empty={!brief.coresEvitar}>{brief.coresEvitar || "—"}</SumRow>
            <SumRow k="Elementos obrigatórios / restrições" empty={!brief.restricoes}>{brief.restricoes || "—"}</SumRow>
            <SumRow k="Observações" empty={!brief.obs}>{brief.obs || "—"}</SumRow>
          </div>
        </div>
      </div>
    </div>
  );
}

window.BriefingDetail = BriefingDetail;
window.briefingHelpers = { allKeywords, allTones, allOf };
