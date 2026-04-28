const username = window.location.pathname.substring(1);

async function loadProfile() {
  if (!username) {
    document.getElementById('error-container').style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`/api/public/${username}`);
    if (!res.ok) throw new Error('User not found');
    const { user, links } = await res.json();

    document.title = user.display_name || user.username;
    document.getElementById('profile-avatar').src = user.avatar || '';
    
    // Configurar Nome e Username
    const usernameEl = document.getElementById('profile-username');
    const profileContainer = document.getElementById('profile-container');
    const wallpaperBg = document.getElementById('wallpaper-bg');

    // Aplicar animação de reveal ao container principal e itens
    if (profileContainer) {
      const animType = user.reveal_animation || 'reveal-up';
      const animDuration = user.reveal_duration || 1;
      
      profileContainer.style.display = 'block';
      profileContainer.style.animation = `${animType} ${animDuration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
      
      // Aplicar aos itens internos com atraso escalonado
      const revealItems = document.querySelectorAll('.reveal-item');
      revealItems.forEach((item, index) => {
        item.style.animationName = animType;
        item.style.animationDuration = `${animDuration}s`;
        item.style.animationDelay = `${(index * 0.1) + 0.2}s`;
      });
    }

    // Aplicar efeitos de wallpaper
    if (wallpaperBg) {
      wallpaperBg.style.setProperty('--wallpaper-blur', `${user.wallpaper_blur || 0}px`);
      wallpaperBg.style.setProperty('--wallpaper-brightness', `${user.wallpaper_brightness || 100}%`);
      
      // Aplicar filtros diretamente no style para garantir funcionamento
      wallpaperBg.style.filter = `blur(${user.wallpaper_blur || 0}px) brightness(${user.wallpaper_brightness || 100}%)`;
      
      if (user.wallpaper_overlay_color) {
        wallpaperBg.style.setProperty('--wallpaper-overlay-color', user.wallpaper_overlay_color);
        wallpaperBg.classList.add('has-overlay');
      } else {
        wallpaperBg.classList.remove('has-overlay');
      }
      wallpaperBg.classList.add('revealed'); // Inicia a animação do wallpaper
    }

    // Iniciar áudio se existir
    const audio = document.getElementById('bg-audio');
    if (audio) {
      audio.play().catch(e => console.log("Autoplay bloqueado:", e));
      // Atualizar ícones do player se for customizado
      const playIcon = document.getElementById('play-icon');
      const pauseIcon = document.getElementById('pause-icon');
      const visualizer = document.getElementById('music-visualizer');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (visualizer) visualizer.classList.add('active');
    }
    if (user.display_name) {
      usernameEl.textContent = user.display_name;
      if (user.show_username) {
        const span = document.createElement('span');
        span.className = 'username-handle';
        span.textContent = `@${user.username}`;
        usernameEl.appendChild(document.createElement('br'));
        usernameEl.appendChild(span);
      }
    } else {
      usernameEl.textContent = `@${user.username}`;
    }

    if (user.location) {
      // XSS Fix: Build location element with DOM APIs — no innerHTML interpolation
      const locationEl = document.getElementById('profile-location');
      locationEl.style.display = 'flex';
      locationEl.innerHTML = ''; // clear, then repopulate with controlled content
      // Static SVG icon (no user data)
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '12'); svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'currentColor');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z');
      svg.appendChild(path);
      locationEl.appendChild(svg);
      // User text — set via textContent (XSS-safe)
      locationEl.appendChild(document.createTextNode(' ' + user.location));
    } else {
      document.getElementById('profile-location').style.display = 'none';
    }
    document.getElementById('profile-bio').textContent = user.bio || '';
    document.getElementById('wallpaper-bg').style.backgroundImage = `url(${user.wallpaper_url || ''})`;

    // Aplicar personalizações via CSS Variables
    const root = document.documentElement;
    const opacity = user.profile_opacity !== undefined ? user.profile_opacity : 0.6;
    const blur = user.profile_blur !== undefined ? user.profile_blur : 20;
    
    // Converter hex em rgba para o fundo do card
    const bgColor = user.bg_color || '#141414';
    // Suporte para hex de 3 e 6 dígitos, com fallback
    let hex = bgColor.startsWith('#') ? bgColor.substring(1) : bgColor;
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        root.style.setProperty('--card-bg', `rgba(${r}, ${g}, ${b}, ${opacity})`);
      } else {
        // Fallback para o padrão se a conversão falhar
        root.style.setProperty('--card-bg', `rgba(20, 20, 20, ${opacity})`);
      }
    } else {
      // Fallback para o padrão se o formato for inválido
      root.style.setProperty('--card-bg', `rgba(20, 20, 20, ${opacity})`);
    }
    root.style.setProperty('--profile-blur', `${blur}px`);
    root.style.setProperty('--text-color', user.text_color || '#ffffff');
    
    // Aplicar Glow
    if (user.glow_intensity > 0) {
      const glowColor = user.text_color || '#ffffff';
      const intensity = user.glow_intensity;
      root.style.setProperty('--text-glow', `0 0 ${10 * intensity}px ${glowColor}`);
      root.style.setProperty('--icon-glow', `drop-shadow(0 0 ${8 * intensity}px ${user.icon_color || glowColor})`);
    } else {
      root.style.setProperty('--text-glow', 'none');
      root.style.setProperty('--icon-glow', 'none');
    }

    // Aplicar novas personalizações
    if (user.font_family) {
      document.body.style.fontFamily = user.font_family;
    }
    if (user.cursor_type && user.cursor_type !== 'default') {
      document.body.style.cursor = user.cursor_type;
      // Aplicar cursor a todos os elementos clicáveis também
      const style = document.createElement('style');
      style.textContent = `* { cursor: ${user.cursor_type} !important; }`;
      document.head.appendChild(style);
    }
    if (user.card_animation && user.card_animation !== 'none') {
      document.getElementById('profile-container').classList.add(`anim-${user.card_animation}`);
    }
    if (user.show_verified_badge) {
      document.getElementById('verified-badge').style.display = 'flex';
    }

    if (user.music_url) {
      const audioContainer = document.getElementById('audio-container');
      audioContainer.style.display = 'block';
      
      // Aplicar estilos do card ao container de música
      audioContainer.className = 'music-embed-card';
      audioContainer.style.backgroundColor = `rgba(${hexToRgb(user.bg_color || '#141414')}, ${opacity})`;
      audioContainer.style.backdropFilter = `blur(${blur}px) saturate(180%)`;
      audioContainer.style.webkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
      audioContainer.style.color = user.text_color || '#ffffff';

      if (user.music_url.includes('spotify.com')) {
        // XSS Fix: Extract only the track ID (alphanumeric) and set via DOM
        const rawId = user.music_url.split('/').pop().split('?')[0];
        const spotifyId = rawId.replace(/[^a-zA-Z0-9]/g, ''); // strip any injection chars
        const iframe = document.createElement('iframe');
        iframe.width = '100%'; iframe.height = '80'; iframe.frameBorder = '0';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy'; iframe.allowFullscreen = true;
        iframe.src = `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`;
        audioContainer.innerHTML = '';
        audioContainer.appendChild(iframe);
      } else {
        // Link direto (mp3, etc) - Versão inspirada no guns.lol
        // XSS Fix: Build audio player with DOM APIs — user URLs set via .src property
        audioContainer.innerHTML = ''; // clear container
        const visualizer  = document.createElement('div');
        visualizer.className = 'music-player-visualizer'; visualizer.id = 'music-visualizer';
        const coverImg = document.createElement('img');
        coverImg.className = 'music-cover'; coverImg.id = 'music-art';
        coverImg.src = user.avatar || '/icons/spotify.svg'; // .src property is XSS-safe
        const infoContainer = document.createElement('div');
        infoContainer.className = 'music-info-container';
        const titleDiv = document.createElement('div'); titleDiv.className = 'music-title'; titleDiv.id = 'music-title'; titleDiv.textContent = 'Carregando...';
        const artistDiv = document.createElement('div'); artistDiv.className = 'music-artist'; artistDiv.id = 'music-artist'; artistDiv.textContent = 'Background Audio';
        const timeDiv = document.createElement('div'); timeDiv.className = 'music-time'; timeDiv.id = 'music-time'; timeDiv.textContent = '0:00 / 0:00';
        infoContainer.append(titleDiv, artistDiv, timeDiv);
        const controls = document.createElement('div'); controls.className = 'music-controls-compact';
        const playPauseBtn = document.createElement('button'); playPauseBtn.className = 'compact-btn'; playPauseBtn.id = 'play-pause-btn';
        playPauseBtn.innerHTML = '<svg id="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><svg id="pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        controls.appendChild(playPauseBtn);
        const audioEl = document.createElement('audio');
        audioEl.id = 'bg-audio'; audioEl.loop = true;
        audioEl.src = user.music_url; // .src property is XSS-safe
        const progressContainer = document.createElement('div'); progressContainer.className = 'music-progress-container';
        const progressBar = document.createElement('div'); progressBar.className = 'music-progress-bar'; progressBar.id = 'progress-bar';
        progressContainer.appendChild(progressBar);
        audioContainer.append(visualizer, coverImg, infoContainer, controls, audioEl, progressContainer);
        
        const audio = document.getElementById('bg-audio');
        const btn = document.getElementById('play-pause-btn');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const timeDisplay = document.getElementById('music-time');
        const titleDisplay = document.getElementById('music-title');

        // Criar visualizador simples (barras animadas)
        for(let i=0; i<30; i++) {
          const bar = document.createElement('div');
          bar.className = 'v-bar';
          bar.style.left = `${i * 3.4}%`;
          bar.style.animationDelay = `${Math.random() * 2}s`;
          visualizer.appendChild(bar);
        }

        // Tentar pegar o nome do arquivo como título
        const fileName = user.music_url.split('/').pop().split('?')[0].replace(/%20|_/g, ' ');
        titleDisplay.textContent = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;

        btn.onclick = (e) => {
          if (e) e.stopPropagation(); // Evitar fechar a intro se clicar no player
          if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            visualizer.classList.add('active');
          } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            visualizer.classList.remove('active');
          }
        };

        audio.ontimeupdate = () => {
          const percent = (audio.currentTime / audio.duration) * 100;
          progressBar.style.width = `${percent}%`;
          
          const formatTime = (t) => {
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
          };
          
          if (!isNaN(audio.duration)) {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
          }
        };
      }
    }

    if (user.bg_color && !user.wallpaper_url) {
      document.body.style.backgroundColor = user.bg_color;
    }

    const linksList = document.getElementById('profile-links-list');
    const socialList = document.getElementById('social-icons');

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      if (link.type === 'social') {
        const iconName = link.title.toLowerCase();
        a.innerHTML = `<div class="social-icon-img" style="-webkit-mask-image: url('/icons/${iconName}.svg'); mask-image: url('/icons/${iconName}.svg'); background-color: ${user.icon_color || '#ffffff'}"></div>`;
        socialList.appendChild(a);
      } else {
        a.className = 'link-card';
        a.textContent = link.title;
        
        // Hover effect dinâmico para links
        a.addEventListener('mouseenter', () => {
          a.style.backgroundColor = `#ffffff22`;
        });
        a.addEventListener('mouseleave', () => {
          a.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        });
        
        linksList.appendChild(a);
      }
    });

    // Removido display block redundante, já tratado no reveal animation
  } catch (error) {
    console.error(error);
    document.getElementById('error-container').style.display = 'block';
  }
}

function hexToRgb(hex) {
  let h = hex.startsWith('#') ? hex.substring(1) : hex;
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return isNaN(r) ? '20, 20, 20' : `${r}, ${g}, ${b}`;
}

loadProfile();
