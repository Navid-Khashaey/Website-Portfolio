// js/script.js
(function () {
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // 1) Footer year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Equalize contact buttons
  function equalizeContactButtons() {
    const btns = $$('#contact .contact-btns .btn');
    if (!btns.length) return;
    btns.forEach(b => (b.style.minWidth = '')); // reset
    const max = Math.max(...btns.map(b => Math.ceil(b.getBoundingClientRect().width)));
    btns.forEach(b => (b.style.minWidth = `${max}px`));
  }
  const debounce = (fn, wait = 120) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };
  window.addEventListener('load', equalizeContactButtons);
  window.addEventListener('resize', debounce(equalizeContactButtons, 120));

  // 3) Live local time
  const timeEl = $('#local-time');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', weekday: 'short' });
    const tick = () => timeEl.textContent = `Local time: ${fmt.format(new Date())}`;
    tick(); setInterval(tick, 30_000);
  }

  // 4) Copy email to clipboard (click or right-click)
  const mailBtn = $('#email-btn');
  if (mailBtn) {
    const address = mailBtn.getAttribute('href').replace('mailto:', '').split('?')[0];
    const copy = () => {
      if (!navigator.clipboard || !window.isSecureContext) return;
      navigator.clipboard.writeText(address).then(() => toast('Email copied to clipboard'));
    };
    mailBtn.addEventListener('click', copy);
    mailBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); copy(); });
  }

  // 5) Disable CV button if file missing
  const cvBtn = $('#cv-btn');
  if (cvBtn && window.fetch) {
    fetch(cvBtn.getAttribute('href'), { method: 'HEAD' })
      .then(r => { if (!r.ok) throw new Error('missing'); })
      .catch(() => {
        cvBtn.classList.add('disabled');
        cvBtn.setAttribute('aria-disabled', 'true');
        cvBtn.title = 'CV not available';
      });
  }

  // 6) Simple form handling (Formspree). Replace with your endpoint:
  //    https://formspree.io/f/<your-id>
  const form = $('#contactForm');
  const alertBox = $('#formAlert');
  const FORMSPREE = 'https://formspree.io/f/your-id-here';  // <-- replace

  function showAlert(type, text) {
    if (!alertBox) return;
    alertBox.className = `alert alert-${type} mt-4`;
    alertBox.textContent = text;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Bootstrap-style validation
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Send
      try {
        const payload = {
          name:    $('#name', form).value.trim(),
          email:   $('#email', form).value.trim(),
          message: $('#message', form).value.trim()
        };

        const res = await fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Network error');

        form.reset();
        form.classList.remove('was-validated');
        showAlert('success', 'Thanks — your message has been sent!');
      } catch (err) {
        showAlert('danger', 'Sorry, something went wrong. Please try again later or email me directly.');
      }
    });
  }

  // Utility toast
  function toast(text) {
    const el = document.createElement('div');
    el.className = 'copy-toast';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => { el.remove(); }, 1800);
  }
})();
