/* ============================================================
   data.js — constantes do formulário + caixa de entrada (painel)
   (vanilla JS, exporta para window)
   ============================================================ */

const KEYWORDS = [
  "Luxo", "Minimalista", "Jovem", "Arrojado", "Tradicional",
  "Sustentável", "Tecnológico", "Feminino", "Masculino", "Descolado",
];
const TONES = ["Formal", "Descontraído", "Inspiracional", "Técnico", "Divertido"];
const VALUES = [
  "Sustentabilidade", "Transparência", "Qualidade", "Inovação", "Inclusão",
  "Artesanal", "Comunidade", "Ética", "Excelência", "Criatividade",
];
/* sensações que a marca QUER transmitir */
const FEEL_WANT = [
  "Confiança", "Sofisticação", "Acolhimento", "Energia", "Calma",
  "Modernidade", "Tradição", "Exclusividade", "Proximidade", "Inovação", "Leveza",
];
/* sensações que a marca NÃO quer transmitir */
const FEEL_AVOID = [
  "Frieza", "Amadorismo", "Antiquado", "Genérico", "Agressivo",
  "Infantil", "Distância", "Complicado", "Exagero", "Corporativo demais",
];
const STYLES = [
  "Minimalista", "Moderno", "Clássico", "Vintage / Retrô", "Lúdico",
  "Sofisticado", "Orgânico / Natural", "Geométrico", "Artesanal", "Tecnológico", "Editorial",
];

/* destino dos briefings enviados (usado pelo backend Vercel — não exibido no app) */
const DESIGNER_EMAIL = "maria.brito@shakersagencia.com.br";

const EMPTY_BRIEF = {
  // sobre a empresa
  empresa: "",
  nicho: "",
  frase: "",
  historia: "",
  valores: [],
  valoresCustom: [],
  // objetivo do projeto
  tipoProjeto: "",
  objetivo: "",
  redesignMotivo: "",
  // personalidade
  palavras: [],
  palavrasCustom: [],
  tom: [],
  tomCustom: [],
  persona: "",
  // sensações
  sensacoesQuer: [],
  sensacoesQuerCustom: [],
  sensacoesNao: [],
  sensacoesNaoCustom: [],
  // público & posicionamento
  publico: "",
  concorrentes: "",
  diferencial: "",
  // preferências visuais
  estilo: [],
  estiloCustom: [],
  coresPref: "",
  coresEvitar: "",
  restricoes: "",
  // livre
  obs: "",
};

/* ---- caixa de entrada (painel da equipe) ----
   No protótipo é localStorage; na Vercel vira um banco/tabela alimentado pelo /api/enviar. */
const INBOX_KEY = "briefing-inbox-v1";
function loadInbox() {
  try { return JSON.parse(localStorage.getItem(INBOX_KEY) || "[]"); }
  catch (e) { return []; }
}
function saveToInbox(entry) {
  const list = loadInbox();
  list.unshift(entry);
  try { localStorage.setItem(INBOX_KEY, JSON.stringify(list)); } catch (e) {}
  return list;
}
function deleteFromInbox(id) {
  const list = loadInbox().filter((x) => x.id !== id);
  try { localStorage.setItem(INBOX_KEY, JSON.stringify(list)); } catch (e) {}
  return list;
}

/* ============================================================
   Camada de API (Vercel) com FALLBACK local.
   - Quando hospedado na Vercel, usa as rotas /api/* reais.
   - Em preview estático (sem backend), cai no localStorage,
     então a interface continua funcionando para demonstração.
   ============================================================ */

async function apiEnviar(brief) {
  try {
    const r = await fetch("/api/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief }),
    });
    if (r.ok) return { ok: true, mode: "api" };
    throw new Error("status " + r.status);
  } catch (e) {
    // fallback: salva localmente (modo demonstração)
    saveToInbox({ id: "br-" + Date.now(), ts: new Date().toISOString(), brief });
    return { ok: true, mode: "local" };
  }
}

async function apiLogin(password) {
  try {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) return { ok: true, mode: "api" };
    if (r.status === 401) return { ok: false, mode: "api" };
    throw new Error("status " + r.status);
  } catch (e) {
    // fallback: confere a senha localmente (modo demonstração)
    return { ok: password === "teamshakers", mode: "local" };
  }
}

async function apiBriefings() {
  try {
    const r = await fetch("/api/briefings", { headers: { "Accept": "application/json" } });
    if (r.ok) {
      const data = await r.json();
      return { list: Array.isArray(data.briefings) ? data.briefings : [], mode: "api" };
    }
    throw new Error("status " + r.status);
  } catch (e) {
    return { list: loadInbox(), mode: "local" };
  }
}

async function apiExcluir(id) {
  try {
    const r = await fetch("/api/excluir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) return { ok: true, mode: "api" };
    throw new Error("status " + r.status);
  } catch (e) {
    deleteFromInbox(id);
    return { ok: true, mode: "local" };
  }
}

Object.assign(window, {
  KEYWORDS, TONES, VALUES, FEEL_WANT, FEEL_AVOID, STYLES, DESIGNER_EMAIL, EMPTY_BRIEF,
  loadInbox, saveToInbox, deleteFromInbox,
  apiEnviar, apiLogin, apiBriefings, apiExcluir,
});
