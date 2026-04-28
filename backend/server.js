require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// ─── Fail-fast env var validation ────────────────────────────────────────────
const REQUIRED_ENV = ['JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k]);
if (missingEnv.length > 0) {
  console.error(`[FATAL] Variáveis de ambiente obrigatórias ausentes: ${missingEnv.join(', ')}`);
  console.error('[FATAL] Configure-as no painel da Vercel em Settings > Environment Variables.');
  process.exit(1);
}
if (!process.env.POSTGRES_URL) {
  console.warn('[WARN] POSTGRES_URL não definida. Usando SQLite local.');
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { init } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security headers (helmet) ────────────────────────────────────────────────
// Disabling contentSecurityPolicy here since we serve mixed static+API.
// Configure per your needs in production.
app.use(helmet({ contentSecurityPolicy: false }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Frontend and API are on the same origin — CORS is mostly for dev tooling.
app.use(cors({
  origin: true,        // Reflect the request origin (same-site deployment)
  credentials: true,  // Required for cookies to be sent cross-origin in dev
}));

// ─── Body / Cookie parsers ────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── Rate limiting for auth routes ───────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // Max 10 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' },
});

// Apply limiter BEFORE the route handlers
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── DB Init guard (prevents race condition on Vercel cold start) ─────────────
// initPromise is started immediately when the module loads. The middleware
// simply awaits it on the first request so no route runs before tables exist.
let dbInitialized = false;
const initPromise = init().then(() => { dbInitialized = true; }).catch(err => {
  console.error('[FATAL] Erro ao inicializar o banco de dados:', err.message);
});

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initPromise;
    } catch {
      return res.status(503).json({ message: 'Serviço temporariamente indisponível. Banco de dados não inicializado.' });
    }
  }
  next();
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/links', require('./routes/links'));
app.use('/api/public', require('./routes/public'));

// ─── Public profile catch-all ─────────────────────────────────────────────────
app.get('/:username', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/profile.html'));
});


if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
