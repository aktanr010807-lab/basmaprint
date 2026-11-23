/* ВРЕМЕННЫЙ ПРИКОЛ: убегающая кнопка «Распечатать бесплатно».
   Чтобы убрать: удалить этот файл и строку <script src="prank.js"> в index.html. */
(() => {
  const TEXT = { ru: "Распечатать бесплатно", ky: "Акысыз басып чыгаруу", en: "Print for free" };
  const NOPE = { ru: "Не-а 😄", ky: "Жок 😄", en: "Nope 😄" };
  const lang = () => TEXT[document.documentElement.lang] ? document.documentElement.lang : "ru";

  const css = document.createElement("style");
  css.textContent = `
    #prank{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9999;
      font:800 16px/1 Manrope,system-ui,sans-serif;color:#111;background:#ffc83d;
      border:2.5px solid #111;border-radius:999px;padding:16px 24px;box-shadow:0 5px 0 #111;
      cursor:pointer;white-space:nowrap;transition:left .25s ease-out,top .25s ease-out;
      animation:prankIn .4s ease-out}
    @keyframes prankIn{from{transform:translate(-50%,-50%) scale(.3);opacity:0}}
    #prankToast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;
      background:#111;color:#fff;font:700 14px Manrope,system-ui,sans-serif;padding:10px 16px;
      border-radius:999px;opacity:0;transition:opacity .2s;pointer-events:none}`;
  document.head.appendChild(css);

  const btn = document.createElement("button");
  btn.id = "prank"; btn.type = "button";
  const toast = document.createElement("div"); toast.id = "prankToast";
  document.body.append(btn, toast);

  const setText = () => { btn.textContent = TEXT[lang()]; toast.textContent = NOPE[lang()]; };
  setText();
  new MutationObserver(setText).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // Отпрыгнуть в случайное место экрана подальше от курсора/пальца
  function flee(x, y) {
    const r = btn.getBoundingClientRect(), pad = 12;
    const W = innerWidth, H = innerHeight;
    let nx, ny, tries = 0;
    do {
      nx = pad + r.width / 2 + Math.random() * (W - r.width - pad * 2);
      ny = pad + r.height / 2 + Math.random() * (H - r.height - pad * 2);
    } while (Math.hypot(nx - x, ny - y) < Math.min(W, H) * 0.4 && ++tries < 30);
    btn.style.left = nx + "px";
    btn.style.top = ny + "px";
  }

  // Мышь: убегает, когда курсор подходит ближе 90px
  document.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) < 90) flee(e.clientX, e.clientY);
  });

  // Телефон: убегает от пальца при касании
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    const t = e.touches[0]; flee(t.clientX, t.clientY);
  }, { passive: false });

  // Если всё-таки нажали (клавиатурой и т.п.) — «Не-а»
  btn.addEventListener("click", e => {
    e.preventDefault();
    toast.style.opacity = 1; setTimeout(() => toast.style.opacity = 0, 1200);
    const r = btn.getBoundingClientRect(); flee(r.left, r.top);
  });
})();
