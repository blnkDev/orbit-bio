# Orbit-Bio 🌐

Uma plataforma moderna, segura e esteticamente premium para gerenciamento de perfis biográficos (Bio Links). Personalize sua presença online com estilo.

## ✨ Funcionalidades

- 🚀 **Dashboard Intuitivo**: Gerencie seus links e informações de perfil em tempo real.
- 🔐 **Autenticação Segura**: Login via Google OAuth e sistema próprio com JWT.
- 🎨 **Design Premium**: Interface responsiva com estética dark mode, glassmorphism e animações suaves.
- 🛠️ **Arquitetura Escalável**: Backend em Express.js preparado para deployment em Vercel e integração com PostgreSQL.
- 📊 **Segurança de Ponta**: Proteção contra ataques de força bruta (Rate Limiting) e headers de segurança (Helmet).

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla).
- **Backend**: Node.js, Express.js.
- **Banco de Dados**: SQLite (Desenvolvimento), PostgreSQL (Produção).
- **Autenticação**: Passport.js (Google OAuth), JWT, BCrypt.js.

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v20 ou superior)
- NPM ou Yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/blnkDev/orbit-bio.git
   cd orbit-bio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `backend/.env.example` para `backend/.env`.
   - Preencha as chaves necessárias (JWT_SECRET, Google OAuth, etc.).

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.