// ─── Auth check via HttpOnly cookie ──────────────────────────────────────────
// No token is stored in localStorage. The browser sends the HttpOnly cookie
// automatically. We just need credentials: 'include' on every fetch.
(async () => {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) { window.location.href = '/'; return; }
    const data = await res.json();
    // Store only non-sensitive username for display purposes
    localStorage.setItem('username', data.username);
    document.getElementById('view-profile-link').href = `/${data.username}`;
  } catch (_) {
    window.location.href = '/';
  }
})();

// ─── Logout ───────────────────────────────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  localStorage.clear();
  window.location.href = '/';
});

// ─── Tab navigation ───────────────────────────────────────────────────────────
const tabBtns = document.querySelectorAll('.sidebar-tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(tabId) {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
  tabPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.tab === tabId));
  localStorage.setItem('activeTab', tabId);
}

tabBtns.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

// Restore last active tab
const savedTab = localStorage.getItem('activeTab') || 'profile';
activateTab(savedTab);

// ─── Notifications ────────────────────────────────────────────────────────────
function showNotification(text, type = 'success') {
  const container = document.getElementById('notification-container');
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = text; // textContent — no XSS
  container.appendChild(n);
  setTimeout(() => {
    n.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => n.remove(), 500);
  }, 3000);
}

// ─── Profile form refs ────────────────────────────────────────────────────────
const profileForm         = document.getElementById('profile-form');
const displayNameInput    = document.getElementById('display-name-input');
const showUsernameInput   = document.getElementById('show-username-input');
const avatarInput         = document.getElementById('avatar-input');
const bioInput            = document.getElementById('bio-input');
const wallpaperInput      = document.getElementById('wallpaper-input');
const locationInput       = document.getElementById('location-input');
const opacityInput        = document.getElementById('opacity-input');
const blurInput           = document.getElementById('blur-input');
const textInput           = document.getElementById('text-input');
const bgInput             = document.getElementById('bg-input');
const iconInput           = document.getElementById('icon-input');
const fontInput           = document.getElementById('font-input');
const cursorInput         = document.getElementById('cursor-input');
const animationInput      = document.getElementById('animation-input');
const glowInput           = document.getElementById('glow-input');
const musicInput          = document.getElementById('music-input');
const verifiedInput       = document.getElementById('verified-input');
const avatarPreview       = document.getElementById('avatar-preview');
const wallpaperPreview    = document.getElementById('wallpaper-preview');

const getVal     = (id) => document.getElementById(id)?.value ?? '';
const getChecked = (id) => document.getElementById(id)?.checked ?? false;

// ─── Image URL previews ───────────────────────────────────────────────────────
avatarInput?.addEventListener('input', () => {
  avatarPreview.src = avatarInput.value;
  avatarPreview.style.display = avatarInput.value ? 'block' : 'none';
});
wallpaperInput?.addEventListener('input', () => {
  wallpaperPreview.src = wallpaperInput.value;
  wallpaperPreview.style.display = wallpaperInput.value ? 'block' : 'none';
});

// ─── Load profile ─────────────────────────────────────────────────────────────
async function loadProfile() {
  try {
    const res = await fetch('/api/user/profile', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();

    if (displayNameInput)   displayNameInput.value   = data.display_name || '';
    if (showUsernameInput)  showUsernameInput.checked = data.show_username !== 0;
    if (avatarInput)        avatarInput.value        = data.avatar || '';
    if (bioInput)           bioInput.value           = data.bio || '';
    if (wallpaperInput)     wallpaperInput.value     = data.wallpaper_url || '';
    if (locationInput)      locationInput.value      = data.location || '';
    if (musicInput)         musicInput.value         = data.music_url || '';
    if (verifiedInput)      verifiedInput.checked    = !!data.show_verified_badge;

    if (opacityInput) {
      opacityInput.value = data.profile_opacity !== undefined ? data.profile_opacity * 100 : 60;
      const d = document.getElementById('opacity-val-display');
      if (d) d.textContent = `${opacityInput.value}%`;
    }
    if (blurInput) {
      blurInput.value = data.profile_blur ?? 20;
      const d = document.getElementById('blur-val-display');
      if (d) d.textContent = `${blurInput.value}px`;
    }
    if (glowInput) {
      glowInput.value = data.glow_intensity !== undefined ? data.glow_intensity * 100 : 0;
      const d = document.getElementById('glow-val-display');
      if (d) d.textContent = `${glowInput.value}%`;
    }

    if (textInput)  { textInput.value  = data.text_color  || '#ffffff'; updateColorUI('text-input',  textInput.value); }
    if (bgInput)    { bgInput.value    = data.bg_color    || '#121212'; updateColorUI('bg-input',    bgInput.value); }
    if (iconInput)  { iconInput.value  = data.icon_color  || '#ffffff'; updateColorUI('icon-input',  iconInput.value); }
    if (fontInput)  fontInput.value    = data.font_family || "'Inter', sans-serif";
    if (cursorInput)    cursorInput.value    = data.cursor_type    || 'default';
    if (animationInput) animationInput.value = data.card_animation || 'none';

    const wpBlur   = document.getElementById('wp-blur-input');
    const wpBright = document.getElementById('wp-brightness-input');
    const wpOverlay = document.getElementById('wp-overlay-input');
    if (wpBlur)    { wpBlur.value    = data.wallpaper_blur       || 0;   document.getElementById('wp-blur-val-display').textContent = `${wpBlur.value}px`; }
    if (wpBright)  { wpBright.value  = data.wallpaper_brightness || 100; document.getElementById('wp-brightness-val-display').textContent = `${wpBright.value}%`; }
    if (wpOverlay) { wpOverlay.value = data.wallpaper_overlay_color || '#00000000'; updateColorUI('wp-overlay-input', wpOverlay.value); }

    if (data.avatar && avatarPreview)      { avatarPreview.src = data.avatar; avatarPreview.style.display = 'block'; }
    if (data.wallpaper_url && wallpaperPreview) { wallpaperPreview.src = data.wallpaper_url; wallpaperPreview.style.display = 'block'; }
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  }
}

// ─── Slider setup ─────────────────────────────────────────────────────────────
const setupSlider = (id, displayId, unit) => {
  const slider   = document.getElementById(id);
  const display  = document.getElementById(displayId);
  const tooltip  = document.getElementById(`${id.replace('-input', '')}-tooltip`);
  const markers  = document.querySelector(`.slider-markers[data-for="${id}"]`);

  if (!slider) return;

  const updateMarkers = (val) => {
    markers?.querySelectorAll('.marker').forEach(m => {
      m.classList.toggle('active', parseInt(m.dataset.val) <= parseInt(val));
    });
  };
  const updateTooltip = (val) => {
    if (!tooltip) return;
    tooltip.textContent = `${val}${unit}`;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const pct = (val - min) / (max - min);
    tooltip.style.left = `calc(${pct * 100}% - ${(pct - 0.5) * 20}px)`;
  };

  slider._updateMarkers = updateMarkers;
  slider._updateTooltip = updateTooltip;

  slider.addEventListener('input', () => {
    if (display) display.textContent = `${slider.value}${unit}`;
    updateMarkers(slider.value);
    updateTooltip(slider.value);
  });
  markers?.querySelectorAll('.marker').forEach(m => {
    m.addEventListener('click', () => {
      slider.value = m.dataset.val;
      if (display) display.textContent = `${slider.value}${unit}`;
      updateMarkers(slider.value);
      updateTooltip(slider.value);
    });
  });
  setTimeout(() => { updateMarkers(slider.value); updateTooltip(slider.value); }, 100);
};

setupSlider('opacity-input',       'opacity-val-display',       '%');
setupSlider('blur-input',          'blur-val-display',          'px');
setupSlider('glow-input',          'glow-val-display',          '%');
setupSlider('wp-blur-input',       'wp-blur-val-display',       'px');
setupSlider('wp-brightness-input', 'wp-brightness-val-display', '%');

// ─── Color picker UI ──────────────────────────────────────────────────────────
function updateColorUI(inputId, hex) {
  const preview = document.getElementById(`${inputId}-preview`);
  const hexText = document.getElementById(`${inputId}-hex`);
  if (preview) preview.style.backgroundColor = hex;
  if (hexText) hexText.textContent = hex;
}

document.querySelectorAll('.custom-color-picker').forEach(wrapper => {
  const input = document.getElementById(wrapper.dataset.id);
  wrapper.addEventListener('click', () => input?.click());
  input?.addEventListener('input', () => updateColorUI(wrapper.dataset.id, input.value));
});

// ─── Theme presets ────────────────────────────────────────────────────────────
const themes = {
  midnight:  { bg_color: '#121212', text_color: '#ffffff', icon_color: '#7b2cbf', profile_opacity: 60, profile_blur: 20, glow_intensity: 30, font_family: "'Inter', sans-serif",       card_animation: 'float' },
  matrix:    { bg_color: '#000000', text_color: '#00ff88', icon_color: '#00ff88', profile_opacity: 40, profile_blur: 10, glow_intensity: 80, font_family: "'Roboto Mono', monospace",  card_animation: 'glow' },
  cyberpunk: { bg_color: '#001219', text_color: '#00f5d4', icon_color: '#ff0054', profile_opacity: 70, profile_blur: 15, glow_intensity: 60, font_family: "'Poppins', sans-serif",     card_animation: 'pulse' },
  minimal:   { bg_color: '#ffffff', text_color: '#000000', icon_color: '#222222', profile_opacity: 90, profile_blur:  5, glow_intensity:  0, font_family: "'Inter', sans-serif",       card_animation: 'none' },
  ocean:     { bg_color: '#001d3d', text_color: '#caf0f8', icon_color: '#00b4d8', profile_opacity: 50, profile_blur: 25, glow_intensity: 40, font_family: "'Poppins', sans-serif",     card_animation: 'float' },
};

document.querySelectorAll('.theme-preset-card').forEach(card => {
  card.addEventListener('click', () => {
    const t = themes[card.dataset.theme];
    if (!t) return;
    if (bgInput)   { bgInput.value   = t.bg_color;   updateColorUI('bg-input',   t.bg_color); }
    if (textInput) { textInput.value = t.text_color;  updateColorUI('text-input', t.text_color); }
    if (iconInput) { iconInput.value = t.icon_color;  updateColorUI('icon-input', t.icon_color); }
    if (opacityInput) {
      opacityInput.value = t.profile_opacity;
      document.getElementById('opacity-val-display').textContent = `${t.profile_opacity}%`;
      opacityInput._updateTooltip?.(t.profile_opacity);
      opacityInput._updateMarkers?.(t.profile_opacity);
    }
    if (blurInput) {
      blurInput.value = t.profile_blur;
      document.getElementById('blur-val-display').textContent = `${t.profile_blur}px`;
      blurInput._updateTooltip?.(t.profile_blur);
      blurInput._updateMarkers?.(t.profile_blur);
    }
    if (glowInput) {
      glowInput.value = t.glow_intensity;
      document.getElementById('glow-val-display').textContent = `${t.glow_intensity}%`;
      glowInput._updateTooltip?.(t.glow_intensity);
      glowInput._updateMarkers?.(t.glow_intensity);
    }
    if (fontInput)      fontInput.value      = t.font_family;
    if (animationInput) animationInput.value = t.card_animation;
    showNotification(`Tema "${card.dataset.theme}" aplicado! Salve para confirmar.`);
  });
});

// ─── Change Username ─────────────────────────────────────────────────────────
const changeUsernameBtn = document.getElementById('change-username-btn');
const usernameChangeInput = document.getElementById('username-change-input');
const usernameMessage = document.getElementById('username-message');

changeUsernameBtn?.addEventListener('click', async () => {
  const newUsername = usernameChangeInput.value.trim();
  usernameMessage.style.display = 'block';

  if (!newUsername) {
    usernameMessage.style.color = '#ff4b2b';
    usernameMessage.textContent = 'Por favor, insira um nome de usuário.';
    return;
  }

  // Frontend validation to match backend rules
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  if (newUsername.length < 3 || newUsername.length > 20) {
    usernameMessage.style.color = '#ff4b2b';
    usernameMessage.textContent = 'O nome de usuário deve ter entre 3 e 20 caracteres.';
    return;
  }
  if (!USERNAME_REGEX.test(newUsername)) {
    usernameMessage.style.color = '#ff4b2b';
    usernameMessage.textContent = 'Apenas letras, números e underlines são permitidos.';
    return;
  }

  try {
    const res = await fetch('/api/user/username', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: newUsername }),
    });

    const data = await res.json();

    if (res.ok) {
      usernameMessage.style.color = '#00ff88';
      usernameMessage.textContent = 'Username alterado com sucesso!';
      localStorage.setItem('username', data.username);
      document.getElementById('view-profile-link').href = `/${data.username}`;
      showNotification('Username atualizado com sucesso!');
    } else {
      usernameMessage.style.color = '#ff4b2b';
      usernameMessage.textContent = data.message || 'Erro ao alterar o nome de usuário.';
    }
  } catch (error) {
    usernameMessage.style.color = '#ff4b2b';
    usernameMessage.textContent = 'Erro de conexão. Tente novamente.';
  }
});

// ─── Save profile ─────────────────────────────────────────────────────────────
profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const profileData = {
    display_name:             displayNameInput?.value         || '',
    show_username:            showUsernameInput?.checked ? 1 : 0,
    avatar:                   avatarInput?.value               || '',
    bio:                      bioInput?.value                  || '',
    wallpaper_url:            wallpaperInput?.value            || '',
    location:                 locationInput?.value             || '',
    profile_opacity:          opacityInput    ? opacityInput.value / 100 : 0.6,
    profile_blur:             blurInput       ? parseInt(blurInput.value) : 20,
    text_color:               textInput?.value                 || '#ffffff',
    bg_color:                 bgInput?.value                   || '#121212',
    icon_color:               iconInput?.value                 || '#ffffff',
    font_family:              fontInput?.value                 || "'Inter', sans-serif",
    cursor_type:              cursorInput?.value               || 'default',
    card_animation:           animationInput?.value            || 'none',
    glow_intensity:           glowInput       ? glowInput.value / 100 : 0,
    music_url:                musicInput?.value                || '',
    show_verified_badge:      verifiedInput?.checked ? 1 : 0,
    wallpaper_blur:           parseInt(getVal('wp-blur-input'))       || 0,
    wallpaper_brightness:     parseInt(getVal('wp-brightness-input')) || 100,
    wallpaper_overlay_color:  getVal('wp-overlay-input')              || '',
    reveal_animation: 'reveal-up',
    reveal_duration:  0.8,
  };

  try {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      showNotification('Perfil atualizado com sucesso!');
    } else {
      const err = await res.json();
      showNotification(err.message || 'Erro ao atualizar perfil.', 'error');
    }
  } catch (err) {
    console.error('Erro ao salvar perfil:', err);
    showNotification('Erro de conexão com o servidor.', 'error');
  }
});

document.getElementById('sidebar-save-btn')?.addEventListener('click', () => {
  profileForm?.dispatchEvent(new Event('submit', { cancelable: true }));
});

// ─── Links & Socials ──────────────────────────────────────────────────────────
const socialPrefixes = {
  discord:   'https://discord.gg/',
  instagram: 'https://instagram.com/',
  spotify:   'https://open.spotify.com/user/',
  github:    'https://github.com/',
  twitter:   'https://twitter.com/',
  tiktok:    'https://tiktok.com/@',
  youtube:   'https://youtube.com/@',
  twitch:    'https://twitch.tv/',
  steam:     'https://steamcommunity.com/id/',
};

const socialPlatformSelect = document.getElementById('social-platform');
const socialPrefixSpan     = document.getElementById('social-prefix');
const socialUrlInput       = document.getElementById('social-url');

socialPlatformSelect?.addEventListener('change', () => {
  socialPrefixSpan.textContent = socialPrefixes[socialPlatformSelect.value] || '';
});

/**
 * Builds a link card using DOM APIs — NOT innerHTML — to prevent Stored XSS.
 * User-supplied values (link.title, displayUrl) are set via .textContent only.
 */
function createLinkCard(link) {
  let displayUrl = link.url;
  if (link.type === 'social') {
    const prefix = socialPrefixes[link.title.toLowerCase()];
    if (prefix && link.url.startsWith(prefix)) displayUrl = link.url.replace(prefix, '');
  }

  const card = document.createElement('div');
  card.className = 'admin-link-card';
  card.dataset.id = link.id;

  // Drag handle (static SVG — no user data)
  const linkInfo = document.createElement('div');
  linkInfo.className = 'link-info';

  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>';

  // Link details — user data goes through textContent ONLY
  const details = document.createElement('div');
  details.className = 'link-details';

  const titleSpan = document.createElement('span');
  titleSpan.className = 'link-title';
  titleSpan.textContent = link.title;   // ← XSS-safe

  const urlSpan = document.createElement('span');
  urlSpan.className = 'link-url';
  urlSpan.textContent = displayUrl;     // ← XSS-safe

  details.append(titleSpan, urlSpan);
  linkInfo.append(dragHandle, details);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.dataset.id = link.id;
  deleteBtn.textContent = '×';

  card.append(linkInfo, deleteBtn);
  return card;
}

async function updateOrder(linkIds) {
  try {
    const res = await fetch('/api/links/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ linkIds }),
    });
    if (!res.ok) throw new Error('Falha ao reordenar');
  } catch (err) {
    console.error('Erro ao reordenar:', err);
    showNotification('Erro ao salvar nova ordem.', 'error');
  }
}

async function loadLinks() {
  try {
    const res = await fetch('/api/links', { credentials: 'include' });
    if (!res.ok) return;
    const links = await res.json();

    const linksList   = document.getElementById('links-list-admin');
    const socialList  = document.getElementById('social-links-list-admin');
    if (!linksList || !socialList) return;

    linksList.innerHTML  = '';
    socialList.innerHTML = '';

    links.forEach(link => {
      const card = createLinkCard(link);
      (link.type === 'social' ? socialList : linksList).appendChild(card);
    });

    if (window.Sortable) {
      [linksList, socialList].forEach(list => {
        new Sortable(list, {
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'sortable-ghost',
          onEnd: () => {
            const ids = Array.from(list.children).map(c => c.dataset.id);
            updateOrder(ids);
          },
        });
      });
    }
  } catch (err) {
    console.error('Erro ao carregar links:', err);
  }
}

async function addLink(e, type) {
  e.preventDefault();
  const titleEl = type === 'link'
    ? e.target.elements['link-title']
    : e.target.elements['social-platform'];
  const urlEl   = type === 'link'
    ? e.target.elements['link-url']
    : e.target.elements['social-url'];

  const title = titleEl.value;
  let   url   = urlEl.value;

  if (type === 'social') {
    const prefix = socialPrefixes[title.toLowerCase()];
    if (prefix && !url.startsWith('http')) url = prefix + url;
  }

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, url, type }),
    });
    if (res.ok) {
      e.target.reset();
      if (type === 'social') socialPrefixSpan.textContent = socialPrefixes[socialPlatformSelect.value] || '';
      loadLinks();
      showNotification('Adicionado com sucesso!');
    } else {
      showNotification('Erro ao adicionar link.', 'error');
    }
  } catch (err) {
    showNotification('Erro de conexão.', 'error');
  }
}

document.getElementById('link-form')?.addEventListener('submit', e => addLink(e, 'link'));
document.getElementById('social-link-form')?.addEventListener('submit', e => addLink(e, 'social'));

document.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('delete-btn')) return;
  const id = e.target.dataset.id;
  try {
    const res = await fetch(`/api/links/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) loadLinks();
    else showNotification('Erro ao excluir link.', 'error');
  } catch (err) {
    showNotification('Erro de conexão.', 'error');
  }
});

// ─── Initial load ─────────────────────────────────────────────────────────────
loadProfile();
loadLinks();
