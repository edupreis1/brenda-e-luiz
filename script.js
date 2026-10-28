// =========================================================
// Convite Brenda & Luiz — 10.01.2027 às 16:00 (horário de Brasília)
// =========================================================
const WEDDING = new Date('2027-01-10T16:00:00-03:00');

// ---------- Música ----------
// O arquivo musica.mp3 já foi preparado começando no 0:31 da música original
// e com o volume reduzido dentro do próprio arquivo (assim fica baixinho também no iPhone,
// que não deixa o site controlar o volume).
const MUSIC_START = 0;     // segundo do arquivo em que a música começa
const MUSIC_VOLUME = 1;    // volume de 0 a 1 (o arquivo já está baixinho)

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const rand = (a, b) => a + Math.random() * (b - a);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================
// ORNAMENTOS BOTÂNICOS (desenhados em SVG)
// =========================================================
const Orn = (() => {
  const r = n => Math.round(n * 10) / 10;
  const qp = (a, b, c, t) => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]; };
  const qa = (a, b, c, t) => Math.atan2(2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1]), 2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]));

  function leaf(x, y, ang, L, W) {
    const dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
    const tx = x + dx * L, ty = y + dy * L, mx = x + dx * L * .45, my = y + dy * L * .45;
    return `<path class="o-leaf" d="M${r(x)} ${r(y)}Q${r(mx + px * W)} ${r(my + py * W)} ${r(tx)} ${r(ty)}Q${r(mx - px * W)} ${r(my - py * W)} ${r(x)} ${r(y)}Z"/>`;
  }

  function branch(a, b, c, { n = 6, size = 14, start = .15, flip = 1, berries = 0 } = {}) {
    let s = `<path class="o-stem" d="M${a}Q${b} ${c}"/>`;
    for (let i = 0; i < n; i++) {
      const t = start + (i / n) * (.95 - start);
      const [x, y] = qp(a, b, c, t);
      const side = (i % 2 ? 1 : -1) * flip;
      const L = size * (1 - t * .45);
      s += leaf(x, y, qa(a, b, c, t) + side * .8, L, L * .34);
    }
    s += leaf(c[0], c[1], qa(a, b, c, 1), size * .55, size * .2);
    for (let k = 0; k < berries; k++) {
      const t = .32 + k * .26;
      const [x, y] = qp(a, b, c, t);
      const ang = qa(a, b, c, t) + (k % 2 ? -1.57 : 1.57) * flip;
      s += `<circle class="o-dot" cx="${r(x + Math.cos(ang) * 6)}" cy="${r(y + Math.sin(ang) * 6)}" r="1.4"/>`;
    }
    return s;
  }

  function flower(cx, cy, R) {
    let s = '';
    for (let i = 0; i < 5; i++) s += leaf(cx, cy, i * 1.2566 - 1.57, R, R * .42);
    return s + `<circle class="o-dot" cx="${cx}" cy="${cy}" r="${R * .22}"/>`;
  }

  const svg = (vb, body) => `<svg viewBox="${vb}" aria-hidden="true">${body}</svg>`;

  return {
    divider: () => svg('0 0 240 40',
      branch([108, 20], [70, 8], [14, 18], { n: 6, size: 13, berries: 2 }) +
      branch([132, 20], [170, 8], [226, 18], { n: 6, size: 13, berries: 2, flip: -1 }) +
      `<path class="o-dot" d="M120 13l4.5 7-4.5 7-4.5-7z"/>`),
    corner: () => svg('0 0 140 140',
      branch([12, 12], [60, 4], [132, 16], { n: 7, size: 15, berries: 2 }) +
      branch([12, 12], [4, 60], [16, 132], { n: 7, size: 15, berries: 2, flip: -1 }) +
      branch([14, 14], [34, 30], [50, 50], { n: 3, size: 10 }) +
      flower(14, 14, 9)),
    wreath: () => svg('0 0 200 200',
      branch([96, 184], [24, 172], [22, 100], { n: 6, size: 16, berries: 2 }) +
      branch([22, 100], [22, 30], [86, 16], { n: 6, size: 14, berries: 1 }) +
      branch([104, 184], [176, 172], [178, 100], { n: 6, size: 16, berries: 2, flip: -1 }) +
      branch([178, 100], [178, 30], [114, 16], { n: 6, size: 14, berries: 1, flip: -1 }) +
      `<path class="o-dot" d="M100 179l4.5 6-4.5 6-4.5-6z"/>`)
  };
})();

// divisor botânico abaixo de cada título
document.querySelectorAll('.section-title').forEach(h => {
  const d = document.createElement('div');
  d.className = 'orn title-orn';
  d.dataset.orn = 'divider';
  h.after(d);
});

document.querySelectorAll('[data-orn]').forEach(el => {
  el.innerHTML = Orn[el.dataset.orn]();
  el.querySelectorAll('path, circle').forEach((p, i) => {
    p.setAttribute('pathLength', '1');
    p.style.setProperty('--i', i);
  });
});

document.querySelectorAll('svg.draw').forEach(s =>
  s.querySelectorAll('path, rect, circle').forEach(p => p.setAttribute('pathLength', '1')));

// =========================================================
// TEXTO: palavras e letras animadas
// =========================================================
function splitWords(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.style.setProperty('--i', i++);
          s.textContent = part;
          frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
}
document.querySelectorAll('.split').forEach(splitWords);

let charIndex = 0;
document.querySelectorAll('[data-chars]').forEach(el => {
  const text = el.textContent.trim();
  el.textContent = '';
  [...text].forEach(c => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.style.setProperty('--i', charIndex++);
    s.textContent = c;
    el.appendChild(s);
  });
});

// =========================================================
// PÉTALAS E BRILHOS
// =========================================================
document.querySelectorAll('.petals').forEach(box => {
  const n = +box.dataset.count || 16;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'petal' + (Math.random() < .35 ? ' blush' : '');
    const size = rand(11, 22);
    p.style.left = rand(-5, 100) + '%';
    p.style.width = size + 'px';
    p.style.height = size * 1.3 + 'px';
    p.style.opacity = rand(.55, 1);
    p.style.animationDuration = rand(9, 17) + 's';
    p.style.animationDelay = -rand(0, 17) + 's';
    const inner = document.createElement('i');
    inner.style.animationDuration = rand(2.2, 5) + 's';
    inner.style.animationDelay = -rand(0, 5) + 's';
    p.appendChild(inner);
    box.appendChild(p);
  }
});

document.querySelectorAll('.sparkles').forEach(box => {
  const n = +box.dataset.count || 16;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.style.left = rand(2, 98) + '%';
    s.style.top = rand(10, 100) + '%';
    const t = rand(2, 4.5), r = rand(7, 12);
    s.style.animationDuration = `${t}s, ${r}s`;
    s.style.animationDelay = `${-rand(0, t)}s, ${-rand(0, r)}s`;
    s.style.transform = `scale(${rand(.5, 1.2)})`;
    box.appendChild(s);
  }
});

function burst(cx, cy) {
  if (reduced) return;
  const make = (cls, inner) => {
    const el = document.createElement('span');
    el.className = cls;
    if (inner) el.appendChild(document.createElement('i'));
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    document.body.appendChild(el);
    return el;
  };
  for (let i = 0; i < 40; i++) {
    const isPetal = i < 24;
    const el = make(isPetal ? 'burst-petal' : 'burst-dot', isPetal);
    const ang = rand(0, Math.PI * 2);
    const dist = rand(90, Math.min(innerWidth, 520) * .7);
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist * .8 - 40;
    const rot = rand(-260, 260);
    const s = isPetal ? rand(.6, 1.2) : rand(.6, 1.4);
    el.animate([
      { transform: `translate(-50%,-50%) scale(${s * .3}) rotate(0deg)`, opacity: 0 },
      { transform: `translate(calc(-50% + ${dx * .8}px), calc(-50% + ${dy * .8}px)) scale(${s}) rotate(${rot * .6}deg)`, opacity: 1, offset: .35 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 220}px)) scale(${s}) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: rand(1800, 2800), easing: 'cubic-bezier(.15,.7,.35,1)', delay: rand(0, 150) })
      .onfinish = () => el.remove();
  }
}

// =========================================================
// MÚSICA
// =========================================================
const audio = $('bgm');
const musicBtn = $('music-btn');
let audioOk = true, userPaused = false, pausedByHide = false;

audio.addEventListener('error', () => { audioOk = false; musicBtn.hidden = true; });

function setPlaying(on) {
  musicBtn.classList.toggle('playing', on);
  musicBtn.setAttribute('aria-label', on ? 'Pausar música' : 'Tocar música');
}
function fadeTo(target, ms) {
  const from = audio.volume, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / ms);
    try { audio.volume = from + (target - from) * k; } catch (e) { /* iOS não permite volume */ }
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function playMusic(fromStart) {
  if (!audioOk) return;
  try { if (fromStart && MUSIC_START) audio.currentTime = MUSIC_START; } catch (e) {}
  try { audio.volume = 0; } catch (e) {}
  const p = audio.play();
  if (p && p.then) {
    p.then(() => { setPlaying(true); fadeTo(MUSIC_VOLUME, 2500); }).catch(() => setPlaying(false));
  } else { setPlaying(true); }
}
musicBtn.addEventListener('click', () => {
  if (audio.paused) { userPaused = false; playMusic(false); }
  else { userPaused = true; audio.pause(); setPlaying(false); }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !audio.paused) { pausedByHide = true; audio.pause(); }
  else if (!document.hidden && pausedByHide && !userPaused) { pausedByHide = false; playMusic(false); }
});

// =========================================================
// ABRIR ENVELOPE
// =========================================================
const intro = $('intro');
const stage = $('stage');
let opened = false;

function openInvite() {
  if (opened) return;
  opened = true;
  playMusic(true); // precisa acontecer no toque para o celular liberar o som
  if (navigator.vibrate) navigator.vibrate(25);

  const T = reduced ? [0, 0, 0, 0, 300] : [0, 480, 1250, 2300, 3250];
  const at = (i, fn) => setTimeout(fn, T[i]);

  at(0, () => intro.classList.add('s1'));                 // selo se parte
  at(1, () => intro.classList.add('s2'));                 // aba abre
  at(2, () => {                                           // cartão sobe
    intro.classList.add('s3');
    intro.querySelectorAll('.orn').forEach(o => o.classList.add('drawn'));
  });
  at(3, () => {                                           // envelope desce, cartão cresce
    intro.classList.add('s4');
    const b = stage.getBoundingClientRect();
    burst(b.left + b.width / 2, b.top + b.height * .45);
  });
  at(4, () => {                                           // revela a capa
    window.scrollTo(0, 0);
    intro.classList.add('s5');
    document.body.classList.remove('locked');
    document.body.classList.add('ready');
    setTimeout(() => document.querySelectorAll('.hero .orn').forEach(o => o.classList.add('drawn')), 500);
    setTimeout(() => {
      intro.style.display = 'none';
      if (audioOk) { musicBtn.hidden = false; requestAnimationFrame(() => musicBtn.classList.add('show')); }
    }, 1200);
  });
}
intro.addEventListener('click', openInvite);

// =========================================================
// REVELAR AO ROLAR
// =========================================================
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add(el.classList.contains('orn') ? 'drawn' : 'visible');
    if (el.id === 'countdown') startCountUp();
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal, .split, .orn, #countdown').forEach(el => {
  if (!el.closest('.hero') && !el.closest('#intro')) io.observe(el);
});

// elementos com efeito "cortina" ficam com área zero enquanto fechados,
// então observamos o elemento pai e abrimos todos os filhos juntos (com atraso escalonado no CSS)
const clipGroups = new Map();
document.querySelectorAll('.clip-reveal').forEach(el => {
  const parent = el.parentElement;
  if (!clipGroups.has(parent)) clipGroups.set(parent, []);
  clipGroups.get(parent).push(el);
});
const clipIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    clipGroups.get(e.target).forEach(el => el.classList.add('visible'));
    clipIO.unobserve(e.target);
  });
}, { threshold: 0.12 });
clipGroups.forEach((_, parent) => clipIO.observe(parent));

// =========================================================
// CONTAGEM REGRESSIVA
// =========================================================
function remaining() {
  const diff = WEDDING - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
function setVal(id, v, animate) {
  const el = $(id);
  if (el.textContent === v) return;
  el.textContent = v;
  if (animate) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
}
function render(p, k, animate) {
  setVal('cd-days', String(Math.round(p.d * k)), animate);
  setVal('cd-hours', pad(Math.round(p.h * k)), animate);
  setVal('cd-min', pad(Math.round(p.m * k)), animate);
  setVal('cd-sec', pad(Math.round(p.s * k)), animate);
}
function tick() {
  const p = remaining();
  if (!p) {
    ['cd-days', 'cd-hours', 'cd-min', 'cd-sec'].forEach(id => setVal(id, '00'));
    $('countdown-msg').textContent = 'Chegou o grande dia! 🤍';
    return;
  }
  render(p, 1, true);
}
let countStarted = false;
function startCountUp() {
  if (countStarted) return;
  countStarted = true;
  if (!remaining() || reduced) { tick(); setInterval(tick, 1000); return; }
  const t0 = performance.now(), dur = 1800;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur);
    const p = remaining();
    if (p) render(p, 1 - Math.pow(1 - k, 3), false);
    if (k < 1) requestAnimationFrame(step);
    else { tick(); setInterval(tick, 1000); }
  };
  requestAnimationFrame(step);
}

// =========================================================
// PARALLAX, FAIXA EM MOVIMENTO E BARRA DE PROGRESSO
// =========================================================
const parallaxEls = [...document.querySelectorAll('.parallax')];
const mqRows = [...document.querySelectorAll('.mq-row')];
const bar = document.querySelector('.progress span');
let ticking = false;

function update() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  if (reduced) return;

  parallaxEls.forEach(el => {
    const box = el.parentElement.getBoundingClientRect();
    if (box.bottom < -50 || box.top > vh + 50) return;
    const c = box.top + box.height / 2 - vh / 2;
    el.style.transform = `translate3d(0, ${(-c * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
  });
  mqRows.forEach(row => {
    const box = row.parentElement.getBoundingClientRect();
    if (box.bottom < -50 || box.top > vh + 50) return;
    const x = (vh - box.top) * 0.5 * +row.dataset.dir;
    row.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
  });
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
update();

// =========================================================
// SALVAR NA AGENDA (Google Calendar)
// =========================================================
(function calendarLink() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Casamento Brenda & Luiz 💍',
    dates: '20270110T190000Z/20270111T030000Z', // 16h às 00h (Brasília)
    details: 'Confirme sua presença: https://assessoriavip.com.br/rsvpUnico/84057d800a8011f1b6b959c5c760da98',
    location: 'Av. Ver. Belarmino Pereira de Carvalho, 1313 - Bairro do Cardoso, Mairiporã - SP, 07618-830'
  });
  $('add-calendar').href = 'https://calendar.google.com/calendar/render?' + params.toString();
})();

// =========================================================
// GALERIA / LIGHTBOX
// =========================================================
const lb = $('lightbox');
const lbImg = lb.querySelector('img');
document.querySelectorAll('.g-item').forEach(btn => {
  btn.addEventListener('click', () => {
    lbImg.src = btn.dataset.src;
    lbImg.alt = btn.querySelector('img').alt;
    lb.classList.add('show');
    lb.setAttribute('aria-hidden', 'false');
  });
});
function closeLb() { lb.classList.remove('show'); lb.setAttribute('aria-hidden', 'true'); }
lb.addEventListener('click', closeLb);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
