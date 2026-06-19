/* ============================================================
   CASA DO DECORADOR – Scripts
   ============================================================ */

// Placeholder para imagens ausentes
function handleImgError(img) {
  const parent = img.parentElement;
  const name = img.alt || 'Foto em breve';
  const ph = document.createElement('div');
  ph.className = 'img-ph-wrap';
  ph.innerHTML = `<span class="ph-icon">🎈</span><span class="ph-txt">${name}</span>`;
  img.style.display = 'none';
  parent.insertBefore(ph, img);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[src^="imagens/"]').forEach(img => {
    img.addEventListener('error', function() {
      handleImgError(this);
    });
    // Testa se a imagem já falhou antes do DOMContentLoaded
    if (img.complete && img.naturalWidth === 0) {
      handleImgError(img);
    }
  });
});

// Navbar scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Hamburger
const hbg = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hbg.addEventListener('click', () => {
  navLinks.classList.toggle('aberto');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('aberto'));
});
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) navLinks.classList.remove('aberto');
});

// AOS
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('animado'), delay);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
aosEls.forEach(el => aosObs.observe(el));

// Filtro galeria
const filtros = document.querySelectorAll('.filtro');
const itens   = document.querySelectorAll('.galeria-item');
filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    const cat = btn.dataset.filtro;
    itens.forEach(item => {
      const show = cat === 'todos' || item.dataset.cat === cat;
      item.classList.toggle('escondido', !show);
    });
  });
});

// Lightbox
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lb-img');
const lbTit   = document.getElementById('lb-titulo');
const lbSub   = document.getElementById('lb-sub');
const lbClose = document.getElementById('lb-close');
const lbPrev  = document.getElementById('lb-prev');
const lbNext  = document.getElementById('lb-next');
let lbIdx = 0;
let visiveis = [];

function abrirLb(idx) {
  visiveis = [...document.querySelectorAll('.galeria-item:not(.escondido)')];
  lbIdx = idx;
  mostrarLb();
  lb.classList.add('aberto');
  document.body.style.overflow = 'hidden';
}
function mostrarLb() {
  const item = visiveis[lbIdx];
  if (!item) return;
  lbImg.src = item.querySelector('img').src;
  lbImg.alt = item.querySelector('img').alt;
  lbTit.textContent = item.dataset.legenda || '';
  lbSub.textContent = item.dataset.sub || '';
}
function fecharLb() {
  lb.classList.remove('aberto');
  document.body.style.overflow = '';
}

itens.forEach(item => {
  item.addEventListener('click', () => {
    const vis = [...document.querySelectorAll('.galeria-item:not(.escondido)')];
    abrirLb(vis.indexOf(item));
  });
});
lbClose.addEventListener('click', fecharLb);
lb.addEventListener('click', e => { if (e.target === lb) fecharLb(); });
lbNext.addEventListener('click', e => { e.stopPropagation(); lbIdx = (lbIdx+1) % visiveis.length; mostrarLb(); });
lbPrev.addEventListener('click', e => { e.stopPropagation(); lbIdx = (lbIdx-1+visiveis.length) % visiveis.length; mostrarLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('aberto')) return;
  if (e.key === 'Escape') fecharLb();
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx+1) % visiveis.length; mostrarLb(); }
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx-1+visiveis.length) % visiveis.length; mostrarLb(); }
});

// Lightbox nas fotos pequenas do salão
document.querySelectorAll('.salao-fotos-pequenas img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTit.textContent = img.alt;
    lbSub.textContent = '';
    lb.classList.add('aberto');
    document.body.style.overflow = 'hidden';
  });
});

// Formulário
const form   = document.getElementById('form');
const formOk = document.getElementById('form-ok');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando... 💕';
  btn.disabled = true;
  // Monta mensagem para WhatsApp como fallback
  const nome    = form.nome.value;
  const wp      = form.whatsapp.value;
  const evento  = form.evento.value;
  const servico = form.servico.value;
  const data    = form.data.value;
  const msg     = form.mensagem.value;
  const texto   = encodeURIComponent(
    `Oi Betânia! 🎉 Vim pelo site!\n\n` +
    `👤 Nome: ${nome}\n` +
    `📱 WhatsApp: ${wp}\n` +
    `🎂 Evento: ${evento}\n` +
    `🎀 Serviço: ${servico}\n` +
    `📅 Data: ${data}\n` +
    `💬 Mensagem: ${msg}`
  );
  setTimeout(() => {
    window.open(`https://wa.me/5511967840120?text=${texto}`, '_blank');
    form.reset();
    btn.textContent = 'Enviar mensagem 💕';
    btn.disabled = false;
    formOk.classList.add('show');
    setTimeout(() => formOk.classList.remove('show'), 5000);
  }, 800);
});

// Máscara telefone
const tel = document.getElementById('tel');
if (tel) {
  tel.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length)     v = `(${v}`;
    e.target.value = v;
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' }); }
  });
});
