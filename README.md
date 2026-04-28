<p align="center">
  <img src="frontend/favicon.png" width="150" alt="Orbis Bio Logo">
</p>

# Orbit Bio

> Uma plataforma open-source, moderna e segura para gerenciamento de perfis e agregação de links (Bio Links). Construída pela comunidade, para a comunidade!

O **Orbit Bio** (anteriormente Orbis Bio) é um projeto de código aberto focado em oferecer uma alternativa robusta e gratuita para concentrar sua presença online em um único lugar. Nossa principal missão é construir a melhor plataforma de Bio Links possível de forma colaborativa, e **sua ajuda é fundamental**! Seja resolvendo problemas de UI, otimizando o backend ou implementando novas features, estamos de portas abertas para contribuições de desenvolvedores de todos os níveis.

## ✨ Funcionalidades

- **Perfis Personalizáveis:** Crie uma página com a sua identidade visual.
- **Gerenciamento de Links:** Adicione, edite e reordene seus links facilmente no Dashboard.
- **Autenticação Segura:** Login tradicional com criptografia avançada e suporte a Social Login (Google OAuth).
- **Dashboard Intuitivo:** Gerencie seu nome de usuário, links e configurações gerais da conta.
- **URLs Amigáveis:** Tenha o seu próprio endereço personalizado (ex: `orbitbio.space/seu-nome`).
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

## 🛠️ Ambiente de Desenvolvimento (Setup)

Se você quer contribuir com o código, siga os passos abaixo para configurar seu ambiente local:

### Pré-requisitos
- Node.js (v20 ou superior)
- PostgreSQL configurado e rodando

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/blnkDev/orbit-bio.git
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

## 🤝 Como Contribuir

Nós adoramos receber contribuições! Se você deseja ajudar a melhorar o Orbit Bio, siga os passos abaixo:

1. Faça um **Fork** do repositório.
2. Crie uma branch para a sua feature: `git checkout -b feature/minha-feature`.
3. Faça os commits com suas alterações: `git commit -m 'feat: minha nova funcionalidade'`.
4. Envie o código para o seu fork: `git push origin feature/minha-feature`.
5. Abra um **Pull Request** detalhando suas alterações.

Dê uma olhada na nossa aba de [Issues](https://github.com/blnkDev/orbit-bio/issues) para encontrar tarefas abertas (procure pelas labels `good first issue` ou `help wanted`).

## 🗺️ O que precisamos de ajuda? (Roadmap)
- 🎨 Melhorias de UI/UX e novos temas para os perfis públicos.
- 🧪 Criação de testes unitários e de integração.
- 📈 Integração com ferramentas de Analytics (ex: Google Analytics, Pixel).
- 🌍 Internacionalização (suporte a novos idiomas).

## ☁️ Deploy (Vercel)

A aplicação é otimizada para a Vercel. O arquivo `vercel.json` converte as rotas do Express para funções Serverless. Para testar o ambiente de produção localmente ou subir seu próprio fork, basta conectar o repositório à Vercel e configurar as variáveis de ambiente.

## 📄 Licença

Este projeto é de código aberto sob a licença ISC. Sinta-se à vontade para bifurcar e colaborar!
