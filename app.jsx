/* ============================================================
   app.jsx — raiz: formulário de página única + envio + painel
   ============================================================ */

const STORAGE_KEY = "briefing-marca-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function computeProgress(brief) {
  const arr = (k) => (brief[k] || []).length > 0;
  const txt = (k) => (brief[k] || "").trim();
  const checks = [
    txt("empresa"),
    txt("nicho"),
    txt("frase"),
    txt("historia"),
    arr("valores") || arr("valoresCustom"),
    arr("palavras") || arr("palavrasCustom"),
    arr("tom") || arr("tomCustom"),
    arr("sensacoesQuer") || arr("sensacoesQuerCustom"),
    arr("sensacoesNao") || arr("sensacoesNaoCustom"),
    txt("publico"),
    txt("concorrentes") || txt("diferencial"),
    arr("estilo") || arr("estiloCustom"),
    txt("coresPref") || txt("coresEvitar"),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function TopBar({ view, onReset, onOpenPanel, onClosePanel }) {
  const inPanel = view === "panel" || view === "detail";
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="wordmark">
          <span className="glyph"><img src="logo.png" alt="Shakers" /></span>
          <span>BRIEFING PARA DESIGNERS</span>
        </div>
        <div className="topbar-actions">
          {inPanel ? (
            <button className="reset-btn" onClick={onClosePanel}>← Voltar ao formulário</button>
          ) : (
            <React.Fragment>
              <button className="reset-btn" onClick={onOpenPanel} title="Briefings recebidos">▦ Painel da equipe</button>
              <button className="reset-btn" onClick={onReset} title="Começar um novo briefing">↻ Recomeçar</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

function SentScreen({ onReset }) {
  return (
    <div className="view">
      <div className="sent-screen">
        <div className="sent-check">✓</div>
        <div className="eyebrow">Briefing enviado</div>
        <h1 className="display">Tudo certo, <em>obrigada!</em></h1>
        <p>Seu briefing foi enviado para a equipe de design. Em breve entramos em contato pra dar os próximos passos.</p>
        <div className="sent-to">
          <span className="sent-to-ico">✉</span>
          <span>enviado para a <b>equipe de design</b></span>
        </div>
        <div className="sent-actions">
          <button className="btn btn-primary" onClick={onReset}>Preencher um novo briefing</button>
        </div>
        <p className="note" style={{ maxWidth: "46ch", margin: "20px auto 0" }}>
          Neste protótipo o envio é simulado e o briefing aparece no “Painel da equipe”. Na versão hospedada, ele chega de verdade no email da equipe com PDF e JSON anexos.
        </p>
      </div>
    </div>
  );
}

function App() {
  const saved = loadState();
  const [view, setView] = React.useState("form"); // form | sent | panel | detail
  const [brief, setBrief] = React.useState({ ...window.EMPTY_BRIEF, ...(saved?.brief || {}) });
  const [sending, setSending] = React.useState(false);
  const [viewing, setViewing] = React.useState(null);
  const [panelAuthed, setPanelAuthed] = React.useState(() => {
    try { return sessionStorage.getItem("painel-auth") === "1"; } catch (e) { return false; }
  });
  const [toastMsg, setToastMsg] = React.useState("");
  const toastTimer = React.useRef(null);

  // persiste só o rascunho do formulário
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ brief })); } catch (e) {}
  }, [brief]);

  const update = (patch) => setBrief((b) => ({ ...b, ...patch }));
  const progress = computeProgress(brief);

  const toast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  };

  const enviar = () => {
    // Envia para /api/enviar (Vercel). Em preview estático, cai no fallback local.
    setSending(true);
    window.apiEnviar(brief).then(() => {
      setSending(false);
      setView("sent");
      window.scrollTo(0, 0);
    });
  };

  const reset = (skipConfirm) => {
    if (!skipConfirm && !window.confirm("Começar um novo briefing? Os dados atuais serão apagados.")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setBrief(window.EMPTY_BRIEF);
    setView("form");
    window.scrollTo(0, 0);
  };

  const Form = window.Form, BriefingDetail = window.BriefingDetail, Panel = window.Panel, PanelAuth = window.PanelAuth;

  return (
    <div className="app">
      <TopBar
        view={view}
        onReset={() => reset(false)}
        onOpenPanel={() => { setView("panel"); window.scrollTo(0, 0); }}
        onClosePanel={() => { setView("form"); window.scrollTo(0, 0); }}
      />
      {view === "form" ? <div className="progress-line"><i style={{ width: progress + "%" }}></i></div> : null}

      <div className="wrap">
        {view === "form" && (
          <Form brief={brief} update={update} onSubmit={enviar} progress={progress} sending={sending} />
        )}
        {view === "sent" && (
          <SentScreen onReset={() => reset(true)} />
        )}
        {view === "panel" && (
          panelAuthed ? (
            <Panel
              onOpen={(entry) => { setViewing(entry); setView("detail"); window.scrollTo(0, 0); }}
              toast={toast}
            />
          ) : (
            <PanelAuth onUnlock={() => setPanelAuthed(true)} />
          )
        )}
        {view === "detail" && viewing && (
          <BriefingDetail
            brief={viewing.brief} ts={viewing.ts}
            onBack={() => { setView("panel"); window.scrollTo(0, 0); }}
            toast={toast}
          />
        )}
      </div>

      <div className={"toast" + (toastMsg ? " show" : "")}>{toastMsg}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
