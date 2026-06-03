# 🚀 Como colocar o Briefing no ar (passo a passo)

Este guia é para quem **nunca** fez deploy. Vai por partes, sem pressa.
No fim você vai ter: um **link público** do formulário, **emails automáticos** chegando para a equipe, e um **painel com senha** mostrando os briefings recebidos.

São 3 etapas:
1. Criar conta no **Resend** (envio de email) — ~5 min
2. Criar conta na **Vercel** e publicar o site — ~10 min
3. Ligar o **painel** (banco KV) — ~3 min (opcional, mas recomendado)

---

## Antes de começar

Os arquivos deste projeto já estão prontos. Suba **o conteúdo desta pasta** (`shakers-vercel/`) para o seu repositório do GitHub `mlkbdesigner/SHAKERS` (pode arrastar os arquivos em **Add file → Upload files**).

> Importante: suba os arquivos na **raiz** do repositório (o `index.html` e a pasta `api/` precisam ficar no topo, não dentro de outra pasta).

---

## Etapa 1 — Resend (emails)

1. Acesse **https://resend.com** e crie uma conta (pode usar o email da Maria).
2. No menu lateral, vá em **API Keys → Create API Key**. Dê um nome (ex: "Shakers") e clique em criar.
3. **Copie a chave** que aparece (começa com `re_...`). Guarde — vamos colar na Vercel daqui a pouco.

> Sobre o remetente: no começo o sistema envia usando `onboarding@resend.dev`, que já funciona para a Maria receber. Para enviar de um endereço `@shakersagencia.com.br` de forma profissional, depois é só verificar o domínio em **Resend → Domains** (tem um passo a passo lá). Não precisa fazer isso agora.

---

## Etapa 2 — Vercel (publicar o site)

1. Acesse **https://vercel.com** e clique em **Sign Up**. Escolha **Continue with GitHub** (faz login com sua conta do GitHub).
2. No painel da Vercel, clique em **Add New… → Project**.
3. Encontre o repositório **SHAKERS** na lista e clique em **Import**.
4. Antes de finalizar, abra a seção **Environment Variables** e adicione estas variáveis (campo *Name* e campo *Value*):

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | a chave `re_...` que você copiou |
   | `DESIGNER_EMAIL` | `maria.brito@shakersagencia.com.br` |
   | `TEAM_PASSWORD` | `teamshakers` (ou a senha que quiser) |
   | `FROM_EMAIL` | `Briefing Shakers <onboarding@resend.dev>` |
   | `SESSION_SECRET` | qualquer frase longa e aleatória |

5. Clique em **Deploy** e aguarde (~1 min). No fim aparece **"Congratulations"** e um link tipo `https://shakers-xxxx.vercel.app`. **Esse é o link do seu formulário!** 🎉

Teste: abra o link, preencha um briefing e clique em **Enviar briefing**. Em alguns segundos o email deve chegar na caixa da Maria.

---

## Etapa 3 — Painel da equipe (banco KV) — recomendado

Sem isso, os emails já funcionam, mas o **Painel** aparece vazio. Para o painel guardar e listar os briefings:

1. No projeto, dentro da Vercel, abra a aba **Storage**.
2. Clique em **Create Database → KV** (Redis). Dê um nome e confirme.
3. Quando perguntar, clique em **Connect to Project** e escolha este projeto. Pronto — a Vercel adiciona as chaves do banco sozinha.
4. Vá em **Deployments → (último deploy) → ⋯ → Redeploy** para o site reconhecer o banco.

Agora, no site, clique em **Painel da equipe**, digite a senha (`teamshakers`) e veja os briefings recebidos.

---

## Trocar a senha do painel

Vá em **Vercel → seu projeto → Settings → Environment Variables**, edite o valor de `TEAM_PASSWORD`, salve e faça um **Redeploy**.

## Domínio próprio (opcional)

Em **Vercel → Settings → Domains** você pode apontar um domínio tipo `briefing.shakersagencia.com.br` para o projeto.

---

## Dúvidas comuns

- **O email não chegou.** Confira se a `RESEND_API_KEY` foi colada certa e veja a aba **Logs** da função `enviar` na Vercel. No começo, envie para o mesmo email que criou a conta Resend.
- **O painel está vazio.** Falta a Etapa 3 (criar o KV) ou fazer o Redeploy depois de criar.
- **Esqueci a senha.** Ela é o valor de `TEAM_PASSWORD` nas variáveis de ambiente.

Qualquer passo que travar, me manda um print que eu te ajudo. 💚
