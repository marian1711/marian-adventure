/* Moraine Lake closure + early-booking signup popup
   Shown on every new visit to the site. While browsing pages in the same visit it is
   not shown again after being closed. Visitors who subscribed never see it again.
   Emails are collected by Netlify Forms (form name: "early-booking"). */
(function () {
  var SUB_KEY = 'mat_promo_subscribed';   // localStorage: subscribed, permanent
  var SEEN_KEY = 'mat_promo_closed';      // sessionStorage: closed during this visit

  function get(st, k) { try { return window[st].getItem(k); } catch (e) { return null; } }
  function set(st, k, v) { try { window[st].setItem(k, v); } catch (e) {} }

  if (get('localStorage', SUB_KEY)) return;
  if (get('sessionStorage', SEEN_KEY)) return;

  var css = '' +
    '#matPromo{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;' +
      'background:rgba(6,14,11,.55);-webkit-backdrop-filter:blur(14px) saturate(.9);backdrop-filter:blur(14px) saturate(.9);' +
      'opacity:0;transition:opacity .5s ease;overflow-y:auto}' +
    '#matPromo.show{opacity:1}' +
    '#matPromo .mp-inner{max-width:760px;width:100%;margin:auto;text-align:center;color:#f4efe6;font-family:"Jost",sans-serif;' +
      'transform:translateY(20px);transition:transform .6s cubic-bezier(.2,.7,.2,1)}' +
    '#matPromo.show .mp-inner{transform:translateY(0)}' +
    '#matPromo .mp-close{position:fixed;top:calc(18px + env(safe-area-inset-top));right:18px;width:44px;height:44px;border-radius:50%;' +
      'border:1px solid rgba(244,239,230,.3);background:rgba(6,14,11,.4);color:#f4efe6;font-size:1.1rem;cursor:pointer;transition:all .3s}' +
    '#matPromo .mp-close:hover{border-color:#c9a84c;color:#c9a84c}' +
    '#matPromo .mp-eyebrow{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#c9a84c;margin-bottom:.6rem}' +
    '#matPromo .mp-title{font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:300;line-height:1;' +
      'font-size:clamp(2.6rem,8vw,5.2rem);margin:0 0 .9rem;text-shadow:0 4px 30px rgba(0,0,0,.45)}' +
    '#matPromo .mp-sub{font-size:clamp(1.05rem,2.6vw,1.4rem);font-weight:500;margin:0 0 1.5rem;text-shadow:0 2px 16px rgba(0,0,0,.5)}' +
    '#matPromo .mp-offer{font-size:clamp(1.15rem,3vw,1.6rem);font-weight:500;margin:0 0 .4rem}' +
    '#matPromo .mp-offer b{color:#e8c96a;font-weight:500}' +
    '#matPromo .mp-note{font-size:.92rem;color:rgba(244,239,230,.75);margin:0 0 1.3rem}' +
    '#matPromo form{display:flex;gap:12px;max-width:600px;margin:0 auto}' +
    '#matPromo input[type=email]{flex:1;min-width:0;padding:1rem 1.2rem;border-radius:12px;border:2px solid rgba(244,239,230,.9);' +
      'background:rgba(6,14,11,.35);color:#f4efe6;font-size:1rem;font-family:"Jost",sans-serif;outline:none;transition:border-color .3s}' +
    '#matPromo input[type=email]::placeholder{color:rgba(244,239,230,.6)}' +
    '#matPromo input[type=email]:focus{border-color:#c9a84c}' +
    '#matPromo button[type=submit]{padding:1rem 1.8rem;border-radius:12px;border:none;background:#c9a84c;color:#060e0b;font-size:.9rem;' +
      'font-weight:600;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:"Jost",sans-serif;white-space:nowrap;' +
      'box-shadow:0 8px 32px rgba(201,168,76,.3);transition:all .3s}' +
    '#matPromo button[type=submit]:hover{background:#e8c96a}' +
    '#matPromo button[type=submit]:disabled{opacity:.6;cursor:wait}' +
    '#matPromo .mp-small{font-size:.75rem;color:rgba(244,239,230,.5);margin-top:1rem}' +
    '#matPromo .mp-msg{margin-top:1rem;font-size:.95rem;min-height:1.2em}' +
    '#matPromo .mp-err{color:#ffb4a2}' +
    '#matPromo .mp-skip{background:none;border:none;color:rgba(244,239,230,.6);font-family:"Jost",sans-serif;font-size:.8rem;' +
      'letter-spacing:.1em;text-transform:uppercase;margin-top:1.6rem;cursor:pointer;text-decoration:underline;text-underline-offset:4px}' +
    '#matPromo .mp-skip:hover{color:#c9a84c}' +
    '#matPromo .mp-done-title{font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:300;font-size:clamp(2.4rem,7vw,4.2rem);margin:0 0 .8rem}' +
    '@media (max-width:560px){#matPromo form{flex-direction:column}#matPromo button[type=submit]{width:100%}}' +
    '#matPromo .mp-winter{max-width:620px;margin:0 auto 1.8rem;padding:1.1rem 1.3rem;border:1px solid rgba(201,168,76,.35);border-radius:16px;background:rgba(6,14,11,.35)}' +
    '#matPromo .mp-winter-tag{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:#c9a84c;margin-bottom:.45rem}' +
    '#matPromo .mp-winter p{margin:0 0 .8rem;font-size:.98rem;line-height:1.5;color:rgba(244,239,230,.9)}' +
    '#matPromo .mp-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}' +
    '#matPromo .mp-chip{font-size:.78rem;padding:.35rem .8rem;border-radius:50px;border:1px solid rgba(244,239,230,.25);color:#f4efe6;white-space:nowrap}' +
    '#matPromo .mp-chip.hot{border-color:#c9a84c;color:#e8c96a}' +
    '#matPromo .mp-ig{display:inline-flex;align-items:center;gap:.6rem;margin-top:1.4rem;padding:.65rem 1.3rem;border-radius:50px;' +
      'border:1px solid rgba(225,48,108,.5);background:rgba(225,48,108,.12);color:#f8c6d6;font-size:.9rem;transition:all .3s}' +
    '#matPromo .mp-ig:hover{background:rgba(225,48,108,.25);color:#fff}' +
    '#matPromo .mp-ig svg{width:20px;height:20px;flex:none}' +
    '#matPromo .mp-ig b{font-weight:500}' +
    '#matPromo .mp-links{display:flex;flex-direction:column;align-items:center}' +
    '@media (max-width:560px){#matPromo{padding:64px 16px 24px}#matPromo .mp-close{top:calc(10px + env(safe-area-inset-top));right:10px;width:40px;height:40px}' +
      '#matPromo .mp-title{font-size:2.3rem;margin-bottom:.6rem}#matPromo .mp-sub{font-size:1rem;margin-bottom:1.1rem}' +
      '#matPromo .mp-winter{padding:.85rem .9rem;margin-bottom:1.2rem}#matPromo .mp-winter p{font-size:.86rem;margin-bottom:.6rem}' +
      '#matPromo .mp-chip{font-size:.72rem;padding:.3rem .65rem}#matPromo .mp-offer{font-size:1.1rem}#matPromo .mp-note{display:none}' +
      '#matPromo form{margin-top:.9rem;gap:10px}#matPromo input[type=email],#matPromo button[type=submit]{padding:.85rem 1rem}' +
      '#matPromo .mp-small{margin-top:.7rem}#matPromo .mp-msg{margin-top:.5rem}#matPromo .mp-ig{margin-top:.8rem;font-size:.8rem;padding:.55rem 1rem}' +
      '#matPromo .mp-ig b{display:none}#matPromo .mp-skip{margin-top:1rem}}' +
    'body.mp-lock{overflow:hidden}';

  var html = '' +
    '<button type="button" class="mp-close" aria-label="Close">✕</button>' +
    '<div class="mp-inner" role="dialog" aria-modal="true" aria-labelledby="mpTitle">' +
      '<div id="mpForm">' +
        '<div class="mp-eyebrow"><span class="en">Moraine Lake</span><span class="ua">Озеро Морейн</span></div>' +
        '<h2 class="mp-title" id="mpTitle"><span class="en">closed for the 2026 season.</span><span class="ua">закрито на сезон 2026.</span></h2>' +
        '<p class="mp-sub"><span class="en">Moraine Lake Road reopens June 1, 2027.</span><span class="ua">Дорога до Морейн відкриється 1 червня 2027 року.</span></p>' +
        '<div class="mp-winter">' +
          '<div class="mp-winter-tag"><span class="en">❄ Coming soon · Winter tours</span><span class="ua">❄ Незабаром · Зимові тури</span></div>' +
          '<p><span class="en">We\'re now developing winter tours to Abraham Lake with its famous ice bubbles, Peyto Lake, Emerald Lake and other destinations in the Canadian Rockies.</span>' +
            '<span class="ua">Зараз ми розробляємо зимові тури на озеро Абрахам зі знаменитими крижаними бульбашками, Пейто, Емеральд та інші напрямки в Канадських Скелястих горах.</span></p>' +
          '<div class="mp-chips">' +
            '<span class="mp-chip hot"><span class="en">Abraham Lake · Ice Bubbles</span><span class="ua">Абрахам · крижані бульбашки</span></span>' +
            '<span class="mp-chip"><span class="en">Peyto Lake</span><span class="ua">Пейто</span></span>' +
            '<span class="mp-chip"><span class="en">Emerald Lake</span><span class="ua">Емеральд</span></span>' +
            '<span class="mp-chip"><span class="en">+ more</span><span class="ua">+ інші</span></span>' +
          '</div>' +
        '</div>' +
        '<p class="mp-offer"><span class="en">Subscribe &amp; get <b>15% off</b> early booking</span><span class="ua">Підпишіться та отримайте <b>−15%</b> за раннє бронювання</span></p>' +
        '<p class="mp-note"><span class="en">Be the first to know when 2027 tours open.</span><span class="ua">Дізнайтеся першими, коли відкриється бронювання турів на 2027 рік.</span></p>' +
        '<form id="mpSignup" novalidate>' +
          '<input type="email" id="mpEmail" name="email" required autocomplete="email" placeholder="your@email.com" aria-label="Email">' +
          '<button type="submit"><span class="en">Get 15% off</span><span class="ua">Отримати −15%</span></button>' +
        '</form>' +
        '<div class="mp-msg" id="mpMsg" aria-live="polite"></div>' +
        '<div class="mp-small"><span class="en">No spam. Unsubscribe anytime.</span><span class="ua">Без спаму. Відписатися можна будь-коли.</span></div>' +
        '<div class="mp-links">' +
        '<a class="mp-ig" href="https://www.instagram.com/marianadventuretours/" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>' +
          '<span><span class="en">Follow us on Instagram</span><span class="ua">Слідкуйте в Instagram</span> <b>@marianadventuretours</b></span></a>' +
        '<button type="button" class="mp-skip"><span class="en">Continue to site</span><span class="ua">Перейти на сайт</span></button>' +
        '</div>' +
      '</div>' +
      '<div id="mpDone" style="display:none">' +
        '<h2 class="mp-done-title"><span class="en">thank you!</span><span class="ua">дякуємо!</span></h2>' +
        '<p class="mp-sub"><span class="en">You\'re on the list. We\'ll email you your 15% early-booking discount.</span>' +
          '<span class="ua">Ви в списку. Ми надішлемо вам знижку 15% на раннє бронювання на емейл.</span></p>' +
        '<div class="mp-links">' +
        '<a class="mp-ig" href="https://www.instagram.com/marianadventuretours/" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>' +
          '<span><span class="en">Follow us on Instagram</span><span class="ua">Слідкуйте в Instagram</span> <b>@marianadventuretours</b></span></a>' +
        '<button type="button" class="mp-skip"><span class="en">Continue to site</span><span class="ua">Перейти на сайт</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';

  function isUA() { return document.body.classList.contains('ua-mode'); }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.id = 'matPromo';
    wrap.innerHTML = html;

    function close(remember) {
      if (remember !== false) set('sessionStorage', SEEN_KEY, '1');
      wrap.classList.remove('show');
      document.body.classList.remove('mp-lock');
      setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 500);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    wrap.querySelector('.mp-close').addEventListener('click', function () { close(); });
    Array.prototype.forEach.call(wrap.querySelectorAll('.mp-skip'), function (b) {
      b.addEventListener('click', function () { close(); });
    });
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);

    var form = wrap.querySelector('#mpSignup');
    var input = wrap.querySelector('#mpEmail');
    var msg = wrap.querySelector('#mpMsg');
    var btn = form.querySelector('button[type=submit]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        msg.className = 'mp-msg mp-err';
        msg.textContent = isUA() ? 'Будь ласка, введіть правильний емейл.' : 'Please enter a valid email address.';
        input.focus();
        return;
      }
      btn.disabled = true;
      msg.className = 'mp-msg';
      msg.textContent = '';
      var body = 'form-name=early-booking' +
        '&email=' + encodeURIComponent(email) +
        '&lang=' + (isUA() ? 'ua' : 'en') +
        '&page=' + encodeURIComponent(location.pathname);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        set('localStorage', SUB_KEY, '1');
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'early_booking_popup' });
        wrap.querySelector('#mpForm').style.display = 'none';
        wrap.querySelector('#mpDone').style.display = 'block';
      }).catch(function () {
        btn.disabled = false;
        msg.className = 'mp-msg mp-err';
        msg.innerHTML = isUA()
          ? 'Не вдалося надіслати. Напишіть нам: <a href="mailto:marianadventuretours@gmail.com" style="text-decoration:underline">marianadventuretours@gmail.com</a>'
          : 'Something went wrong. Please email us: <a href="mailto:marianadventuretours@gmail.com" style="text-decoration:underline">marianadventuretours@gmail.com</a>';
      });
    });

    document.body.appendChild(wrap);
    document.body.classList.add('mp-lock');
    requestAnimationFrame(function () { wrap.classList.add('show'); });
  }

  function start() { setTimeout(init, 1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
