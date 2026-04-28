const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database');
const authMiddleware = require('../middleware/auth');
const { USERNAME_REGEX, PASSWORD_REGEX } = require('../utils/validators');

// ─── Cookie config ────────────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

const COOKIE_OPTIONS = {
  httpOnly: true,       // JS cannot read this cookie → blocks XSS token theft
  secure: isProduction, // HTTPS only in production; plain HTTP ok in dev
  sameSite: 'Strict',   // Blocks CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Signs a JWT and writes it as an HttpOnly cookie.
 * No token is ever sent in the response body.
 */
const issueToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('access_token', token, COOKIE_OPTIONS);
};

// ─── Register ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e senha são obrigatórios.' });
  }
  if (!USERNAME_REGEX.test(username)) {
    return res.status(400).json({
      message: 'O nome de usuário pode conter apenas letras, números e sublinhados (_).',
    });
  }
  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      message: 'Senha fraca. Requisitos: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'Usuário registrado com sucesso.', userId: result.rows[0].id });
  } catch (error) {
    if (error.code === '23505' || error.errno === 19) {
      return res.status(400).json({ message: 'Username já existe.' });
    }
    console.error('[register]', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e senha são obrigatórios.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    issueToken(res, user.id);
    res.json({ username: user.username });
  } catch (error) {
    console.error('[login]', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Strict',
  });
  res.json({ message: 'Sessão encerrada.' });
});

// ─── Session check ────────────────────────────────────────────────────────────
// Used by frontend to verify if the user is still authenticated.
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error('[me]', error);
    res.status(500).json({ message: 'Erro interno.' });
  }
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL in .env
// Setup guide: https://console.cloud.google.com/
//
// 1. Install: npm install passport passport-google-oauth20 (already done)
// 2. Fill in the env vars below and uncomment this block.
//
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    // Try to find existing user by google_id first, then by email
    let result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
    if (!result.rows[0]) {
      // Create a unique username from the Google display name
      const baseUsername = profile.displayName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').substring(0, 20);
      const username = `${baseUsername}_${profile.id.substring(0, 6)}`;
      result = await db.query(
        'INSERT INTO users (username, google_id, avatar) VALUES ($1, $2, $3) RETURNING *',
        [username, profile.id, profile.photos[0]?.value]
      );
    }
    done(null, result.rows[0]);
  } catch (err) { done(err); }
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/?error=oauth' }),
  (req, res) => {
    issueToken(res, req.user.id);
    res.redirect('/dashboard.html');
  }
);

// ─── Admin: Clear Database ────────────────────────────────────────────────────
// Protected by X-Admin-Secret header. Only for dev/staging environments.
// In production, do NOT set the ADMIN_SECRET env var.
router.delete('/admin/clear-db', async (req, res) => {
  const secret = req.header('X-Admin-Secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Acesso proibido.' });
  }
  try {
    await db.query('DELETE FROM links');
    await db.query('DELETE FROM users');
    res.json({ message: 'Banco de dados limpo com sucesso.' });
  } catch (error) {
    console.error('[clear-db]', error);
    res.status(500).json({ message: 'Erro ao limpar banco.', error: error.message });
  }
});

module.exports = router;
