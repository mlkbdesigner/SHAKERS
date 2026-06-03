/* ============================================================
   Form.jsx — Etapa 1: Briefing (scroll único)
   ============================================================ */

function Chip({ label, on, onClick }) {
  return (
    <button type="button" className={"chip" + (on ? " on" : "")} onClick={onClick}>
      <span className="tick">✓</span>{label}
    </button>
  );
}

function ChipGroup({ options, value, onToggle }) {
  return (
    <div className="chips">
      {options.map((opt) => (
        <Chip key={opt} label={opt} on={value.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </div>
  );
}

function MultiPicker({ options, brief, update, stdKey, customKey }) {
  const [draft, setDraft] = React.useState("");
  const std = brief[stdKey] || [];
  const custom = brief[customKey] || [];
  const addCustom = () => {
    const v = draft.trim();
    if (!v) { setDraft(""); return; }
    if (![...std, ...custom].some(p => p.toLowerCase() === v.toLowerCase())) {
      update({ [customKey]: [...custom, v] });
    }
    setDraft("");
  };
  const toggle = (opt) => {
    update({ [stdKey]: std.includes(opt) ? std.filter(p => p !== opt) : [...std, opt] });
  };
  const removeCustom = (opt) => update({ [customKey]: custom.filter(p => p !== opt) });

  return (
    <div className="chips">
      {options.map((opt) => (
        <Chip key={opt} label={opt} on={std.includes(opt)} onClick={() => toggle(opt)} />
      ))}
      {custom.map((opt) => (
        <span key={opt} className="chip chip-custom">
          {opt}<span className="x" onClick={() => removeCustom(opt)}>✕</span>
        </span>
      ))}
      <input
        className="chip-input"
        placeholder="+ adicionar…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
        onBlur={addCustom}
      />
    </div>
  );
}

function Radio({ options, value, onChange }) {
  return (
    <div className="radio-row">
      {options.map((opt) => (
        <button type="button" key={opt}
          className={"radio-opt" + (value === opt ? " on" : "")}
          onClick={() => onChange(value === opt ? "" : opt)}>
          <span className="dot"></span>{opt}
        </button>
      ))}
    </div>
  );
}

function Form({ brief, update, onSubmit, progress, sending }) {
  return (
    <div className="view">
      <div className="lead">
        <div className="eyebrow">Briefing de marca</div>
        <h1 className="display">Vamos conhecer <em>sua marca</em></h1>
        <p>Quanto mais você contar sobre o negócio, a personalidade e o que sente, mais certeiro fica o trabalho. Não precisa preencher tudo — vá no que fizer sentido, no seu ritmo. Ao final, é só enviar.</p>
      </div>

      {/* 01 · SOBRE A EMPRESA */}
      <section className="section">
        <div className="section-head">
          <span className="idx">01</span>
          <h2>Sobre a empresa</h2>
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Nome da empresa <span className="req">*</span></label>
            <input className="input" value={brief.empresa}
              onChange={(e) => update({ empresa: e.target.value })}
              placeholder="ex: Café da Esquina" />
          </div>
          <div className="field">
            <label>Nicho / segmento</label>
            <input className="input" value={brief.nicho}
              onChange={(e) => update({ nicho: e.target.value })}
              placeholder="ex: cafeteria artesanal" />
          </div>
        </div>
        <div className="field">
          <label>O que a marca faz, em uma frase? <span className="desc">o jeito mais simples de explicar pra um estranho</span></label>
          <input className="input" value={brief.frase}
            onChange={(e) => update({ frase: e.target.value })}
            placeholder="ex: um café de bairro que torra os próprios grãos" />
        </div>
        <div className="field">
          <label>História &amp; propósito <span className="desc">por que ela existe, o que a move</span></label>
          <textarea className="textarea" value={brief.historia}
            onChange={(e) => update({ historia: e.target.value })}
            placeholder="Como nasceu, o que acredita, qual mudança quer causar…" />
        </div>
        <div className="field">
          <label>Valores da marca</label>
          <MultiPicker options={window.VALUES} brief={brief} update={update} stdKey="valores" customKey="valoresCustom" />
        </div>
      </section>

      {/* 02 · PERSONALIDADE */}
      <section className="section">
        <div className="section-head">
          <span className="idx">02</span>
          <h2>Personalidade da marca</h2>
          <span className="hint">múltipla escolha</span>
        </div>
        <div className="field">
          <label>Palavras-chave da marca <span className="desc">selecione e/ou adicione as suas</span></label>
          <MultiPicker options={window.KEYWORDS} brief={brief} update={update} stdKey="palavras" customKey="palavrasCustom" />
        </div>
        <div className="field">
          <label>Tom de voz <span className="desc">selecione e/ou adicione os seus</span></label>
          <MultiPicker options={window.TONES} brief={brief} update={update} stdKey="tom" customKey="tomCustom" />
        </div>
        <div className="field">
          <label>Se a marca fosse uma pessoa, como ela seria? <span className="desc">opcional, mas ajuda muito</span></label>
          <input className="input" value={brief.persona}
            onChange={(e) => update({ persona: e.target.value })}
            placeholder="ex: uma amiga acolhedora que entende de café e não é esnobe" />
        </div>
      </section>

      {/* 03 · SENSAÇÕES */}
      <section className="section section-accent">
        <div className="section-head">
          <span className="idx">03</span>
          <h2>Sensações</h2>
          <span className="hint">o coração do briefing</span>
        </div>
        <p className="section-note">Como alguém deve <b>se sentir</b> ao encontrar sua marca — e o que ela <b>nunca</b> deveria transmitir. É o que mais guia as escolhas visuais.</p>
        <div className="field">
          <label className="feel-label feel-want">Sensações que QUERO transmitir</label>
          <MultiPicker options={window.FEEL_WANT} brief={brief} update={update} stdKey="sensacoesQuer" customKey="sensacoesQuerCustom" />
        </div>
        <div className="field">
          <label className="feel-label feel-avoid">Sensações que NÃO quero transmitir</label>
          <MultiPicker options={window.FEEL_AVOID} brief={brief} update={update} stdKey="sensacoesNao" customKey="sensacoesNaoCustom" />
        </div>
      </section>

      {/* 04 · PÚBLICO & POSICIONAMENTO */}
      <section className="section">
        <div className="section-head">
          <span className="idx">04</span>
          <h2>Público &amp; posicionamento</h2>
        </div>
        <div className="field">
          <label>Quem é o cliente ideal?</label>
          <textarea className="textarea" value={brief.publico}
            onChange={(e) => update({ publico: e.target.value })}
            placeholder="Idade, hábitos, o que valoriza, onde costuma estar…" />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Concorrentes de referência</label>
            <input className="input" value={brief.concorrentes}
              onChange={(e) => update({ concorrentes: e.target.value })}
              placeholder="ex: Coffee Lab, Café Cultura" />
          </div>
          <div className="field">
            <label>O que torna a marca única?</label>
            <input className="input" value={brief.diferencial}
              onChange={(e) => update({ diferencial: e.target.value })}
              placeholder="o diferencial que ninguém mais tem" />
          </div>
        </div>
      </section>

      {/* 05 · PREFERÊNCIAS VISUAIS */}
      <section className="section">
        <div className="section-head">
          <span className="idx">05</span>
          <h2>Preferências visuais</h2>
          <span className="hint">gostos &amp; restrições</span>
        </div>
        <div className="field">
          <label>Estilo visual desejado</label>
          <MultiPicker options={window.STYLES} brief={brief} update={update} stdKey="estilo" customKey="estiloCustom" />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Cores que você ama</label>
            <input className="input" value={brief.coresPref}
              onChange={(e) => update({ coresPref: e.target.value })}
              placeholder="ex: verde-musgo, terracota, off-white" />
          </div>
          <div className="field">
            <label>Cores / elementos a evitar</label>
            <input className="input" value={brief.coresEvitar}
              onChange={(e) => update({ coresEvitar: e.target.value })}
              placeholder="ex: nada de roxo, sem gradientes berrantes" />
          </div>
        </div>
        <div className="field">
          <label>Elementos obrigatórios ou restrições <span className="desc">algo que precisa estar ou não pode aparecer</span></label>
          <textarea className="textarea" value={brief.restricoes}
            onChange={(e) => update({ restricoes: e.target.value })}
            placeholder="ex: manter o símbolo do grão, precisa funcionar em PB, sem pessoas nas fotos…" />
        </div>
      </section>

      {/* 06 · OBSERVAÇÕES */}
      <section className="section">
        <div className="section-head">
          <span className="idx">06</span>
          <h2>Observações livres</h2>
          <span className="hint">opcional</span>
        </div>
        <div className="field">
          <label>Algo mais que o time precisa saber?</label>
          <textarea className="textarea" value={brief.obs}
            onChange={(e) => update({ obs: e.target.value })}
            placeholder="Referências que ama ou odeia, histórias da marca, qualquer detalhe…" />
        </div>
      </section>

      <div className="actionbar">
        <div className="actionbar-inner">
          <div className="meta"><b>{progress}%</b> preenchido</div>
          <div className="spacer"></div>
          <button className="btn btn-primary btn-send" disabled={!brief.empresa.trim() || sending} onClick={onSubmit}>
            {sending ? "Enviando…" : "✦ Enviar briefing"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.Form = Form;
