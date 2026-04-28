// ─── DOM refs ─────────────────────────────────────────────────────────────────
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const message = document.getElementById('message');
const passwordInput = document.getElementById('password');
const strengthContainer = document.getElementById('password-strength-container');
const strengthChecks = {
  length: document.getElementById('strength-length'),
  uppercase: document.getElementById('strength-uppercase'),
  lowercase: document.getElementById('strength-lowercase'),
  number: document.getElementById('strength-number'),
  special: document.getElementById('strength-special'),
};

let isLogin = true;

// ─── Password strength indicator ─────────────────────────────────────────────
const validatePassword = () => {
  const value = passwordInput.value;
  const checks = {
    length:    value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number:    /\d/.test(value),
    special:   /[@$!%*?&]/.test(value),
  };
  let allValid = true;
  for (const key in checks) {
    const el = strengthChecks[key];
    if (el) {
      el.classList.toggle('valid', checks[key]);
      if (!checks[key]) allValid = false;
    }
  }
  return allValid;
};
passwordInput.addEventListener('input', validatePassword);

// ─── Session check — redirect if already logged in ───────────────────────────
(async () => {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) window.location.href = '/dashboard.html';
  } catch (_) { /* not logged in, stay on page */ }
})();

// ─── Toggle login / register ─────────────────────────────────────────────────
toggleAuth.addEventListener('click', () => {
  isLogin = !isLogin;
  authTitle.textContent     = isLogin ? 'Bem-vindo'     : 'Criar conta';
  authSubtitle.textContent  = isLogin ? 'Entre na sua conta para continuar' : 'Cadastre-se para criar seu perfil personalizado';
  submitBtn.textContent     = isLogin ? 'Entrar'        : 'Criar Conta';
  toggleAuth.textContent    = isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre';
  message.textContent = '';
  document.getElementById('username').value = '';
  passwordInput.value = '';
  strengthContainer.style.display = isLogin ? 'none' : 'block';
  validatePassword();
});

// ─── Form submit ──────────────────────────────────────────────────────────────
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = passwordInput.value;

  // Client-side validation (mirrors backend — source of truth is backend)
  if (!isLogin) {
    if (!USERNAME_REGEX.test(username)) {
      message.textContent = 'O usuário pode conter apenas letras, números e underscores (_).';
      message.style.color = '#ff4b2b';
      return;
    }
    if (!validatePassword()) {
      message.textContent = 'A senha deve cumprir todos os requisitos de segurança.';
      message.style.color = '#ff4b2b';
      return;
    }
  }

  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Aguarde...';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Required so the server can set HttpOnly cookies
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        // Token lives in HttpOnly cookie — store only the non-sensitive username
        localStorage.setItem('username', data.username);
        window.location.href = '/dashboard.html';
      } else {
        message.textContent = 'Registro bem-sucedido! Faça o login.';
        message.style.color = '#00ff88';
        setTimeout(() => {
          isLogin = true;
          toggleAuth.click();
        }, 1800);
      }
    } else {
      message.textContent = data.message;
      message.style.color = '#ff4b2b';
    }
  } catch (error) {
    message.textContent = 'Erro ao conectar ao servidor.';
    message.style.color = '#ff4b2b';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? 'Entrar' : 'Criar Conta';
  }
});
