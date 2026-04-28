<p align="center">
  <img src="frontend/favicon.png" width="150" alt="Orbis Bio Logo">
</p>

# Orbis Bio 🪐

> Uma plataforma moderna e segura para gerenciamento de perfis e agregação de links (Bio Links).

O **Orbis Bio** é a sua solução definitiva para concentrar toda a sua presença online em um único lugar. Crie uma página personalizada, adicione seus links, redes sociais, portfólio e compartilhe com seu público com um único URL.

## ✨ Funcionalidades

- **Perfis Personalizáveis:** Crie uma página com a sua identidade visual.
- **Gerenciamento de Links:** Adicione, edite e reordene seus links facilmente no Dashboard.
- **Autenticação Segura:** Login tradicional com criptografia avançada e suporte a Social Login (Google OAuth).
- **Dashboard Intuitivo:** Gerencie seu nome de usuário, links e configurações gerais da conta.
- **URLs Amigáveis:** Tenha o seu próprio endereço personalizado (ex: `seusite.com/seu-nome`).
- **Segurança de Nível de Produção:** Proteção contra ataques de força bruta, injeções e cabeçalhos de segurança configurados.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias:

### Frontend
- HTML5, CSS3 & Vanilla JavaScript
- Design responsivo e moderno (Glassmorphism e Micro-interações)

### Backend
- **[Node.js](https://nodejs.org/)** & **[Express](https://expressjs.com/)**
- **[PostgreSQL](https://www.postgresql.org/)** para banco de dados relacional
- **Autenticação:** JWT (JSON Web Tokens) e Passport.js
- **Segurança:** Helmet, Express Rate Limit, bcryptjs

### Infraestrutura
- Preparado para deploy "Serverless" na **[Vercel](https://vercel.com/)**

## 📂 Estrutura do Projeto

```text
orbit-bio/
├── api/             # Funções Serverless para a Vercel
├── backend/         # Código-fonte da API em Node.js (Rotas, Controladores, Middlewares)
├── frontend/        # Arquivos estáticos (HTML, CSS, JS, Ícones)
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   ├── index.html
│   └── profile.html
├── package.json     # Dependências do projeto
└── vercel.json      # Configuração de deploy para a Vercel
```

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
- Node.js (v20 ou superior)
- PostgreSQL configurado e rodando

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/orbit-bio.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd orbit-bio
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configuração das Variáveis de Ambiente:
   Crie um arquivo `.env` na raiz do projeto com as credenciais do seu banco e chaves de segurança:
   ```env
   PORT=3000
   DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
   JWT_SECRET=sua_chave_secreta_jwt
   GOOGLE_CLIENT_ID=seu_client_id_google
   GOOGLE_CLIENT_SECRET=seu_client_secret_google
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

6. Acesse a aplicação no seu navegador:
   ```text
   http://localhost:3000
   ```

## ☁️ Deploy

Este projeto está configurado nativamente para ser hospedado na **Vercel**. O arquivo `vercel.json` mapeia as rotas do backend Express para rodarem como Serverless Functions.

1. Instale o Vercel CLI ou conecte o repositório ao painel da Vercel.
2. Configure as Variáveis de Ambiente (PostgreSQL, JWT, etc.) no painel da Vercel.
3. Faça o deploy!

## 📄 Licença

Este projeto está sob a licença ISC.
