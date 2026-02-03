(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // Theme (Light/Dark) toggle with persistence
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');

  const systemPrefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initialTheme);

  const themeToggleBtn = document.getElementById('themeToggle');
  const setBtnText = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (themeToggleBtn) themeToggleBtn.textContent = isDark ? 'Light mode' : 'Dark mode';
  };
  setBtnText();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setBtnText();
    });
  }

  
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

 
  const nav = $('.navbar.fixed-top') || $('.fixed-top');
  const onScrollShadow = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScrollShadow);
  onScrollShadow();

  
  $$('.navbar a[href^="#"], a.scrollto[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; 
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', id);
    });
  });

 
  const parser = new DOMParser();

  async function include(el){
    const src = el.dataset.src;
    if (!src) return;
    const [url, hash] = src.split('#');
    try {
      const html = await fetch(url, { cache: 'no-cache' }).then(r => r.text());
      const doc  = parser.parseFromString(html, 'text/html');
      const node = hash ? doc.getElementById(hash) : doc.body;
      if (node) el.innerHTML = node.innerHTML;
      el.classList.add('section--loaded');
    } catch (err) {
      el.innerHTML = '<div class="text-danger py-5">Failed to load content.</div>';
      console.error('Include failed:', src, err);
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        include(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '300px 0px' });

  $$('.lazy-include').forEach(el => io.observe(el));

  
  const sections = $$('section[id]');
  const navLinks = $$('.navbar a[href^="#"]');
  const spy = () => {
    const offset = window.scrollY + 100;
    let current = sections[0]?.id;
    sections.forEach(sec => { if (sec.offsetTop <= offset) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', spy);
  window.addEventListener('load', spy);

  
  const toTop = document.createElement('button');
  toTop.className = 'back-to-top btn btn-primary';
  toTop.textContent = '↑';
  Object.assign(toTop.style, { position:'fixed', right:'16px', bottom:'16px', display:'none', zIndex:'1050' });
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toggleTop = () => { toTop.style.display = window.scrollY > 600 ? 'block' : 'none'; };
  window.addEventListener('scroll', toggleTop);
  toggleTop();
})();















// // js/script.js
// (function () {
//   const $  = (sel, ctx = document) => ctx.querySelector(sel);
//   const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

//   // 1) Footer year
//   const yearEl = $('#year');
//   if (yearEl) yearEl.textContent = new Date().getFullYear();

//   // 2) Equalize contact buttons
//   function equalizeContactButtons() {
//     const btns = $$('#contact .contact-btns .btn');
//     if (!btns.length) return;
//     btns.forEach(b => (b.style.minWidth = '')); // reset
//     const max = Math.max(...btns.map(b => Math.ceil(b.getBoundingClientRect().width)));
//     btns.forEach(b => (b.style.minWidth = `${max}px`));
//   }
//   const debounce = (fn, wait = 120) => {
//     let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
//   };
//   window.addEventListener('load', equalizeContactButtons);
//   window.addEventListener('resize', debounce(equalizeContactButtons, 120));

//   // 3) Live local time
//   const timeEl = $('#local-time');
//   if (timeEl) {
//     const fmt = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', weekday: 'short' });
//     const tick = () => timeEl.textContent = `Local time: ${fmt.format(new Date())}`;
//     tick(); setInterval(tick, 30_000);
//   }

//   // 4) Copy email to clipboard (click or right-click)
//   const mailBtn = $('#email-btn');
//   if (mailBtn) {
//     const address = mailBtn.getAttribute('href').replace('mailto:', '').split('?')[0];
//     const copy = () => {
//       if (!navigator.clipboard || !window.isSecureContext) return;
//       navigator.clipboard.writeText(address).then(() => toast('Email copied to clipboard'));
//     };
//     mailBtn.addEventListener('click', copy);
//     mailBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); copy(); });
//   }

//   // 5) Disable CV button if file missing
//   const cvBtn = $('#cv-btn');
//   if (cvBtn && window.fetch) {
//     fetch(cvBtn.getAttribute('href'), { method: 'HEAD' })
//       .then(r => { if (!r.ok) throw new Error('missing'); })
//       .catch(() => {
//         cvBtn.classList.add('disabled');
//         cvBtn.setAttribute('aria-disabled', 'true');
//         cvBtn.title = 'CV not available';
//       });
//   }

//   // 6) Simple form handling (Formspree). Replace with your endpoint:
//   //    https://formspree.io/f/<your-id>
//   const form = $('#contactForm');
//   const alertBox = $('#formAlert');
//   const FORMSPREE = 'https://formspree.io/f/your-id-here';  // <-- replace

//   function showAlert(type, text) {
//     if (!alertBox) return;
//     alertBox.className = `alert alert-${type} mt-4`;
//     alertBox.textContent = text;
//   }

//   if (form) {
//     form.addEventListener('submit', async (e) => {
//       e.preventDefault();

//       // Bootstrap-style validation
//       if (!form.checkValidity()) {
//         form.classList.add('was-validated');
//         return;
//       }

//       // Send
//       try {
//         const payload = {
//           name:    $('#name', form).value.trim(),
//           email:   $('#email', form).value.trim(),
//           message: $('#message', form).value.trim()
//         };

//         const res = await fetch(FORMSPREE, {
//           method: 'POST',
//           headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });

//         if (!res.ok) throw new Error('Network error');

//         form.reset();
//         form.classList.remove('was-validated');
//         showAlert('success', 'Thanks — your message has been sent!');
//       } catch (err) {
//         showAlert('danger', 'Sorry, something went wrong. Please try again later or email me directly.');
//       }
//     });
//   }

//   // Utility toast
//   function toast(text) {
//     const el = document.createElement('div');
//     el.className = 'copy-toast';
//     el.textContent = text;
//     document.body.appendChild(el);
//     setTimeout(() => { el.remove(); }, 1800);
//   }
// })();
