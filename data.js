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

Object.assign(window, {
  KEYWORDS, TONES, VALUES, FEEL_WANT, FEEL_AVOID, STYLES, DESIGNER_EMAIL, EMPTY_BRIEF,
  loadInbox, saveToInbox, deleteFromInbox,
});
