<p align="center">
  <img src="frontend/favicon.png" width="150" alt="Orbis Bio Logo">
</p>

# Orbit Bio

> Uma plataforma open-source, moderna e segura para gerenciamento de perfis e agregação de links (Bio Links).

O **Orbit Bio** é a sua solução definitiva para concentrar toda a sua presença online em um único lugar. Com foco em design, performance e liberdade, o projeto oferece aos usuários a capacidade de construir páginas de Bio verdadeiramente únicas. Queremos que cada perfil reflita 100% a identidade do seu criador, fugindo do visual "padrão" das plataformas convencionais.

## 📌 Funcionalidades

- **Perfis Personalizáveis:** Crie uma página com a sua identidade visual.
- **Gerenciamento de Links:** Adicione, edite e reordene seus links facilmente no Dashboard.
- **Autenticação Segura:** Login tradicional com criptografia avançada e suporte a Social Login (Google OAuth).
- **Dashboard Intuitivo:** Gerencie seu nome de usuário, links e configurações gerais da conta.
- **URLs Amigáveis:** Tenha o seu próprio endereço personalizado (ex: `orbitbio.space/seu-nome`).

## 🎨 O seu perfil, as suas regras (Personalização)

Acreditamos que a sua página de Bio deve ser a sua vitrine digital. Com o Orbit Bio, você tem acesso a:

- **Identidade Visual Completa:** Escolha cores, ajuste o estilo dos botões, adicione efeitos modernos e muito mais. O limite é a sua criatividade!
- **Micro-interações:** Animações fluidas e hover states dinâmicos que tornam a experiência de quem acessa o seu perfil muito mais premium e agradável.
- **Flexibilidade Total de Links:** Adicione todos os seus projetos, redes sociais, portfólio ou lojas virtuais, reordenando-os facilmente com nosso sistema intuitivo.
- **A sua URL:** Garanta exclusividade e presença digital com um link limpo e memorável: `orbitbio.space/seu-nome`.

## ⚙️ Destaques Técnicos & Segurança

- **Dashboard Real-Time:** Uma área administrativa simples, focada na melhor experiência do usuário (UX), para gerenciar a sua página.
- **Autenticação Segura:** Login seguro com criptografia avançada (bcrypt) e conveniência do **Google OAuth**.
- **Segurança de Ponta:** Proteções ativas contra força bruta e injeções, rodando de forma resiliente.
- **100% Open-Source:** Gratuito, transparente e em constante evolução.

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

## 📄 Licença

Este projeto é de código aberto sob a licença ISC. Sinta-se à vontade para bifurcar e colaborar!
