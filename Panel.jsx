/* ============================================================
   Panel.jsx — Painel da equipe: briefings recebidos
   ============================================================ */

function fmtShort(ts) {
  try { return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
  catch (e) { return ""; }
}

function InboxCard({ entry, onOpen, onDelete }) {
  const b = entry.brief || {};
  const H = window.briefingHelpers;
  const kws = H.allKeywords(b).slice(0, 3);
  const quer = H.allOf(b, "sensacoesQuer", "sensacoesQuerCustom");
  const nao = H.allOf(b, "sensacoesNao", "sensacoesNaoCustom");
  return (
    <div className="inbox-card" onClick={() => onOpen(entry)}>
      <div className="inbox-card-head">
        <div>
          <div className="inbox-empresa">{b.empresa || "Marca sem nome"}</div>
          <div className="inbox-date">{fmtShort(entry.ts)}{b.nicho ? " · " + b.nicho : ""}</div>
        </div>
        <button className="inbox-del" title="Excluir" onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}>✕</button>
      </div>
      {kws.length ? (
        <div className="tag-row" style={{ marginTop: "12px" }}>
          {kws.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      ) : null}
      <div className="inbox-feel">
        <span className="inbox-feel-item"><span className="lt yes"></span>{quer.length} a transmitir</span>
        <span className="inbox-feel-item"><span className="lt no"></span>{nao.length} a evitar</span>
      </div>
      <div className="inbox-open">Ver briefing →</div>
    </div>
  );
}

function Panel({ onOpen, toast }) {
  const [list, setList] = React.useState(window.loadInbox());

  const del = (id) => {
    if (!window.confirm("Excluir este briefing do painel?")) return;
    setList(window.deleteFromInbox(id));
    toast("Briefing excluído");
  };

  return (
    <div className="view">
      <div className="lead">
        <div className="eyebrow">Painel da equipe</div>
        <h1 className="display">Briefings <em>recebidos</em></h1>
        <p>{list.length === 0
          ? "Nenhum briefing recebido ainda. Quando um cliente enviar, ele aparece aqui."
          : `${list.length} briefing${list.length > 1 ? "s" : ""} recebido${list.length > 1 ? "s" : ""} — clique para abrir, exportar ou imprimir.`}</p>
      </div>

      {list.length === 0 ? (
        <div className="inbox-empty">
          <div className="inbox-empty-ico">▦</div>
          <p>A caixa de entrada está vazia.</p>
          <span>Os briefings enviados pelo formulário caem aqui automaticamente.</span>
        </div>
      ) : (
        <div className="inbox-grid">
          {list.map((entry) => (
            <InboxCard key={entry.id} entry={entry} onOpen={onOpen} onDelete={del} />
          ))}
        </div>
      )}

      <p className="disclaim">
        <b>Sobre o painel:</b> neste protótipo os briefings ficam salvos só neste navegador. Na versão hospedada na Vercel, cada envio é gravado no servidor (e disparado por email via Resend), então a equipe vê todos os briefings de qualquer dispositivo.
      </p>
    </div>
  );
}

function PanelAuth({ onUnlock }) {
  const [pwd, setPwd] = React.useState("");
  const [err, setErr] = React.useState(false);
  const submit = (e) => {
    if (e) e.preventDefault();
    if (pwd === "teamshakers") {
      try { sessionStorage.setItem("painel-auth", "1"); } catch (x) {}
      onUnlock();
    } else {
      setErr(true);
    }
  };
  return (
    <div className="view">
      <div className="auth-screen">
        <div className="auth-lock">🔒</div>
        <div className="eyebrow">Painel da equipe</div>
        <h1 className="display">Acesso <em>restrito</em></h1>
        <p>Esta área é só para a equipe de design. Informe a senha para ver os briefings recebidos.</p>
        <form className="auth-form" onSubmit={submit}>
          <input
            className={"input" + (err ? " input-err" : "")}
            type="password"
            value={pwd}
            autoFocus
            placeholder="Senha de acesso"
            onChange={(e) => { setPwd(e.target.value); setErr(false); }}
          />
          <button className="btn btn-primary" type="submit">Entrar</button>
        </form>
        {err ? <p className="auth-err">Senha incorreta. Tente novamente.</p> : null}
      </div>
    </div>
  );
}

window.Panel = Panel;
window.PanelAuth = PanelAuth;