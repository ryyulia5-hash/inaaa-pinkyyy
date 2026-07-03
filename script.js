document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('is-hidden'), 700));
  setTimeout(() => preloader.classList.add('is-hidden'), 2800);

  const gate = document.getElementById('gate');
  const gateForm = document.getElementById('gateForm');
  const gateInput = document.getElementById('gateInput');
  const gateError = document.getElementById('gateError');
  const roseBurst = document.getElementById('roseBurst');
  const SECRET_CODE = '25052025';

  function normalizeCode(v){ return v.replace(/\D/g, ''); }

  setTimeout(() => gateInput?.focus(), 900);

  function spawnRosePetals(layer, count){
    layer.innerHTML = '';
    const glyphs = ['❀', '❁', '✿', '🌸', '💮'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'rose-burst__petal';
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.color = Math.random() > 0.5 ? 'var(--rose-deep)' : 'var(--rose)';
      const angle = Math.random() * Math.PI * 2;
      const dist = 55 + Math.random() * 55;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist * 0.75 + 18;
      el.style.setProperty('--tx', `${tx}vw`);
      el.style.setProperty('--ty', `${ty}vh`);
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 900}deg`);
      el.style.fontSize = `${16 + Math.random() * 26}px`;
      el.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
      el.style.animationDelay = `${Math.random() * 0.3}s`;
      frag.appendChild(el);
    }
    layer.appendChild(frag);
  }

  function unlockSite(){
    spawnRosePetals(roseBurst, 110);
    roseBurst.classList.add('is-active');
    setTimeout(() => gate.classList.add('is-hidden'), 450);
    setTimeout(() => document.body.classList.remove('is-locked'), 850);
    setTimeout(() => {
      roseBurst.classList.remove('is-active');
      roseBurst.innerHTML = '';
    }, 2800);
  }

  gateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = normalizeCode(gateInput.value);
    if (value === SECRET_CODE) {
      gateError.classList.remove('is-visible');
      unlockSite();
    } else {
      gateError.classList.add('is-visible');
      gateInput.classList.remove('is-shake');
      void gateInput.offsetWidth;
      gateInput.classList.add('is-shake');
      gateInput.value = '';
      gateInput.focus();
    }
  });

  const petalsWrap = document.getElementById('petals');
  const PETAL_COUNT = 16;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = Math.random() > 0.5 ? '❀' : '❁';
    p.style.left = `${Math.random() * 100}%`;
    p.style.fontSize = `${10 + Math.random() * 10}px`;
    p.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
    const dur = 14 + Math.random() * 14;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${-Math.random() * dur}s`;
    petalsWrap.appendChild(p);
  }

  document.getElementById('startBtn')?.addEventListener('click', () => {
    document.getElementById('note').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('replayBtn')?.addEventListener('click', () => {
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });

  const railFill = document.getElementById('railFill');
  function updateRail(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    railFill.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : '0%';
  }
  document.addEventListener('scroll', updateRail, { passive: true });
  updateRail();

  const revealTargets = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => io.observe(el));

  document.querySelectorAll('.scrapbook').forEach(grid => {
    [...grid.children].forEach((el, i) => { el.style.transitionDelay = `${i * 90}ms`; });
  });

  function typeInto(el, text, speed = 14, charsPerTick = 2){
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    function step(){
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i += charsPerTick;
        requestAnimationFrame(() => setTimeout(step, speed));
      } else {
        cursor.remove();
      }
    }
    step();
  }

  const noteText =
`Bukan nasihat panjang, bukan juga kata kata mutiara yang muluk. Cuma kumpulan momen kecil yang pernah kita lewati bersama, saat kamu masih jadi dirimu yang paling berapi api.

Silakan gulir, dan izinkan semua ini mengingatkanmu, siapa dirimu sebenarnya.`;

  const typedNote = document.getElementById('typedNote');
  let notedTyped = false;
  const noteIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !notedTyped) {
        notedTyped = true;
        typeInto(typedNote, noteText);
        noteIO.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (typedNote) noteIO.observe(document.getElementById('note'));

  const closingText =
`Inaaa,

Terima kasih sudah jadi orang yang selalu ada di setiap cerita di atas, dan di banyak cerita lain yang nggak sempat aku masukkan ke sini.

Aku tahu belakangan ini berat, dan kadang rasanya susah buat percaya lagi sama diri sendiri. Tapi coba lihat lagi semua cerita di atas, di situ ada kamu yang berani, yang ketawa lepas, yang nggak pernah takut jadi diri sendiri.

Dirimu yang dulu itu nggak hilang. Dia cuma lagi istirahat sebentar, dan sekarang saatnya dia bangkit lagi.

Besok adalah lembar baru. Jangan bawa capeknya hari ini ke sana, bawa cuma semangatnya saja.

Senyuman itu, senyuman yang paling aku suka, kali ini nggak boleh hilang lagi.

Aku percaya sama kamu, hari ini, esok, dan seterusnya. Ayo, kembali jadi dirimu yang membara itu.`;

  const typedClosing = document.getElementById('typedClosing');
  let closingTyped = false;
  const closingIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !closingTyped) {
        closingTyped = true;
        typeInto(typedClosing, closingText, 12, 2);
        closingIO.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (typedClosing) closingIO.observe(document.getElementById('closing'));

  const closingPandas = document.getElementById('closingPandas');
  if (closingPandas) {
    const pandaGlyphs = ['🐼', '🐾'];
    const frag = document.createDocumentFragment();
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = pandaGlyphs[Math.random() > 0.75 ? 1 : 0];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${18 + Math.random() * 22}px`;
      el.style.animationDuration = `${7 + Math.random() * 6}s`;
      el.style.animationDelay = `${Math.random() * 8}s`;
      frag.appendChild(el);
    }
    closingPandas.appendChild(frag);
  }

  function fmt(t){
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const players = document.querySelectorAll('[data-player]');
  const allVideoEls = [];

  players.forEach(player => {
    const video = player.querySelector('video');
    const playBtn = player.querySelector('.player__play');
    const track = player.querySelector('.player__track');
    const progress = player.querySelector('.player__progress');
    const timeNow = player.querySelector('.player__time--now');
    const timeDur = player.querySelector('.player__time--dur');

    allVideoEls.push(video);

    video.addEventListener('loadedmetadata', () => { timeDur.textContent = fmt(video.duration); });

    function pauseOthers(){
      allVideoEls.forEach(v => {
        if (v !== video && !v.paused) {
          v.pause();
          v.closest('[data-player]').classList.remove('is-playing');
        }
      });
    }

    function togglePlay(){
      if (video.paused) {
        pauseOthers();
        video.play();
        player.classList.add('is-playing');
      } else {
        video.pause();
        player.classList.remove('is-playing');
      }
    }

    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    video.addEventListener('timeupdate', () => {
      timeNow.textContent = fmt(video.currentTime);
      if (video.duration) progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    });

    video.addEventListener('ended', () => {
      player.classList.remove('is-playing');
      progress.style.width = '0%';
    });

    track.addEventListener('click', (e) => {
      const rect = track.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (video.duration) video.currentTime = ratio * video.duration;
    });

    const vIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          player.classList.remove('is-playing');
        }
      });
    }, { threshold: 0.15 });
    vIO.observe(player);
  });

  const musicToggle = document.getElementById('musicToggle');
  let musicPlaying = false;
  musicToggle?.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    musicToggle.classList.toggle('is-playing', musicPlaying);
  });

});
