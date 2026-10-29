(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => (n == null ? "Consultar" : "S/ " + n.toFixed(2));
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const iconFor = (p) => ICONS[catById[p.cat].icon];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Pinta los ilustraciones declaradas con data-icon en el HTML.
  $$("[data-icon]").forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ""));
  $("#year").textContent = new Date().getFullYear();

  /* ================= MENÚ MÓVIL ================= */
  const nav = $("#nav");
  const toggle = $("#menuToggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ================= HERO SLIDER ================= */
  const slides = $$(".slide");
  const dots = $("#heroDots");
  let current = 0;
  let timer;
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Promoción ${i + 1}`);
    b.addEventListener("click", () => go(i, true));
    dots.appendChild(b);
  });
  function go(i, user) {
    current = (i + slides.length) % slides.length;
    $("#heroTrack").style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, j) => {
      s.classList.toggle("is-active", j === current);
      s.setAttribute("aria-hidden", j !== current);
    });
    $$("button", dots).forEach((d, j) => d.setAttribute("aria-selected", j === current));
    if (user) restart();
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(current + 1), 6000);
  }
  $("#heroPrev").addEventListener("click", () => go(current - 1, true));
  $("#heroNext").addEventListener("click", () => go(current + 1, true));
  let touchX = null;
  $(".hero").addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  $(".hero").addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1), true);
    touchX = null;
  });
  go(0);
  restart();

  /* ================= CARTA ================= */
  const chips = $("#catChips");
  const sections = $("#menuSections");

  chips.innerHTML = CATEGORIES.map((c) => `
    <a class="chip" href="#cat-${c.id}" data-cat="${c.id}" role="tab">
      <span class="chip__icon">${ICONS[c.icon]}</span>${esc(c.name)}
    </a>`).join("");

  function cardHTML(p) {
    const isPizza = !!p.sizes;
    const priceHTML = isPizza
      ? `<div class="card__sizes">${p.sizes.map((v, i) => `<span><small>${SIZES[i]}</small>${v.toFixed(2)}</span>`).join("")}</div>`
      : `<div class="card__price ${p.price == null ? "is-ask" : ""}">${money(p.price)}</div>`;
    return `
      <article class="card ${p.featured ? "card--featured" : ""}" data-id="${p.id}" data-search="${esc((p.name + " " + p.desc + " " + (p.tag || "")).toLowerCase())}">
        <div class="card__art card__art--${p.cat}">
          ${iconFor(p)}
          ${p.featured ? '<span class="badge">⭐ Favorito</span>' : ""}
          ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
        </div>
        <div class="card__body">
          <h4>${esc(p.name)}</h4>
          <p>${esc(p.desc)}</p>
          ${priceHTML}
          <button class="btn btn--red btn--block" data-add="${p.id}">
            ${isPizza ? "Elegir tamaño" : "Agregar"}
          </button>
        </div>
      </article>`;
  }

  sections.innerHTML = CATEGORIES.map((c) => `
    <section class="cat" id="cat-${c.id}" data-cat="${c.id}">
      <header class="cat__head">
        <h3><span class="cat__icon">${ICONS[c.icon]}</span>${esc(c.name)}</h3>
        <span class="pill pill--green">${esc(c.note)}</span>
      </header>
      <div class="grid">${PRODUCTS.filter((p) => p.cat === c.id).map(cardHTML).join("")}</div>
    </section>`).join("");

  // Resalta la categoría visible (scroll spy)
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.cat;
      $$(".chip", chips).forEach((ch) => {
        const on = ch.dataset.cat === id;
        ch.classList.toggle("is-active", on);
        ch.setAttribute("aria-selected", on);
        if (on) ch.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$(".cat", sections).forEach((s) => spy.observe(s));

  // Búsqueda
  $("#search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    let any = false;
    $$(".cat", sections).forEach((sec) => {
      let visible = 0;
      $$(".card", sec).forEach((card) => {
        const hay = card.dataset.search.normalize("NFD").replace(/[̀-ͯ]/g, "");
        const show = !q || hay.includes(q);
        card.hidden = !show;
        if (show) visible++;
      });
      sec.hidden = visible === 0;
      if (visible) any = true;
    });
    $("#menuEmpty").hidden = any;
  });

  /* ================= CARRITO ================= */
  const STORAGE_KEY = "dbarrio-cart-v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { cart = []; }
  // Descarta productos que ya no existan en la carta
  cart = cart.filter((it) => byId[it.id]);

  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* sin almacenamiento */ } };

  function priceOf(it) {
    const p = byId[it.id];
    return p.sizes ? p.sizes[it.size] : p.price;
  }

  function addToCart(id, size = null, qty = 1) {
    const key = size == null ? id : `${id}#${size}`;
    const found = cart.find((it) => it.key === key);
    if (found) found.qty += qty;
    else cart.push({ key, id, size, qty });
    save();
    renderCart();
    bump();
    const p = byId[id];
    toast(`${p.name}${size != null ? " " + SIZES[size] : ""} agregado ✔`);
  }

  function renderCart() {
    const count = cart.reduce((a, it) => a + it.qty, 0);
    $("#cartCount").textContent = count;
    $("#cartCount").classList.toggle("is-zero", count === 0);

    const empty = cart.length === 0;
    $("#cartEmpty").hidden = !empty;
    $("#checkout").hidden = empty;
    $("#drawerFoot").hidden = empty;

    $("#cartList").innerHTML = cart.map((it) => {
      const p = byId[it.id];
      const unit = priceOf(it);
      return `
        <li class="cart-item" data-key="${esc(it.key)}">
          <div class="cart-item__art">${iconFor(p)}</div>
          <div class="cart-item__info">
            <strong>${esc(p.name)}</strong>
            ${it.size != null ? `<small>${SIZES[it.size]}</small>` : ""}
            <span class="cart-item__price">${unit == null ? "Precio por confirmar" : money(unit * it.qty)}</span>
          </div>
          <div class="qty">
            <button type="button" data-dec aria-label="Quitar uno">−</button>
            <span>${it.qty}</span>
            <button type="button" data-inc aria-label="Agregar uno">+</button>
          </div>
        </li>`;
    }).join("");

    const total = cart.reduce((a, it) => a + (priceOf(it) || 0) * it.qty, 0);
    $("#cartTotal").textContent = money(total);
    $("#totalNote").hidden = !cart.some((it) => priceOf(it) == null);
  }

  $("#cartList").addEventListener("click", (e) => {
    const li = e.target.closest(".cart-item");
    if (!li) return;
    const it = cart.find((x) => x.key === li.dataset.key);
    if (e.target.closest("[data-inc]")) it.qty++;
    else if (e.target.closest("[data-dec]")) it.qty--;
    else return;
    cart = cart.filter((x) => x.qty > 0);
    save();
    renderCart();
  });

  $("#clearCart").addEventListener("click", () => {
    if (!confirm("¿Vaciar el carrito?")) return;
    cart = [];
    save();
    renderCart();
  });

  // Drawer
  const drawer = $("#drawer");
  const overlay = $("#overlay");
  function openCart() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    $("#cartClose").focus();
  }
  function closeCart() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
  }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  function bump() {
    const b = $("#cartOpen");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }

  /* ================= MODAL TAMAÑO (PIZZAS) ================= */
  const modal = $("#sizeModal");
  let modalState = null;
  function openSizeModal(id) {
    const p = byId[id];
    modalState = { id, size: 1, qty: 1 };
    $("#sizeTitle").textContent = "Pizza " + p.name;
    $("#sizeDesc").textContent = p.desc + " · Incluye café";
    $("#sizeOptions").innerHTML = p.sizes.map((v, i) => `
      <label class="size-opt">
        <input type="radio" name="size" value="${i}" ${i === 1 ? "checked" : ""} />
        <span><b>${SIZES[i]}</b>${money(v)}</span>
      </label>`).join("");
    updateModal();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $("#sizeAdd").focus();
  }
  function updateModal() {
    const p = byId[modalState.id];
    $("#sizeQty").textContent = modalState.qty;
    $("#sizeAdd").textContent = `Agregar · ${money(p.sizes[modalState.size] * modalState.qty)}`;
  }
  function closeModal() {
    modal.hidden = true;
    if (!drawer.classList.contains("is-open")) document.body.classList.remove("no-scroll");
  }
  $("#sizeOptions").addEventListener("change", (e) => { modalState.size = +e.target.value; updateModal(); });
  $("#sizeMinus").addEventListener("click", () => { modalState.qty = Math.max(1, modalState.qty - 1); updateModal(); });
  $("#sizePlus").addEventListener("click", () => { modalState.qty++; updateModal(); });
  $("#sizeAdd").addEventListener("click", () => { addToCart(modalState.id, modalState.size, modalState.qty); closeModal(); });
  $("#sizeClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeModal();
    else if (drawer.classList.contains("is-open")) closeCart();
  });

  // Botones "Agregar" de la carta y del slider
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add], [data-quick-add]");
    if (!btn) return;
    const id = btn.dataset.add || btn.dataset.quickAdd;
    if (byId[id].sizes) openSizeModal(id);
    else addToCart(id);
  });

  /* ================= CHECKOUT POR WHATSAPP ================= */
  const form = $("#checkout");
  function syncForm() {
    const delivery = form.elements.mode.value === "delivery";
    $("#addressField").hidden = !delivery;
    const yape = form.elements.pay.value === "Yape";
    $("#yapeBox").hidden = !yape;
    $("#cashField").hidden = yape;
  }
  form.addEventListener("change", syncForm);
  syncForm();

  $("#copyYape").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("923433817");
      toast("Número de Yape copiado 📋");
    } catch {
      toast("Yape: 923 433 817");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#formError");
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const delivery = form.elements.mode.value === "delivery";
    const address = form.elements.address.value.trim();
    const missing = [];
    if (!name) missing.push("nombre");
    if (!/^\+?[\d\s]{9,15}$/.test(phone)) missing.push("celular válido");
    if (delivery && !address) missing.push("dirección");
    if (missing.length) {
      err.textContent = "Completa: " + missing.join(", ") + ".";
      err.hidden = false;
      return;
    }
    err.hidden = true;

    const lines = cart.map((it) => {
      const p = byId[it.id];
      const unit = priceOf(it);
      const label = (p.sizes ? "Pizza " : "") + p.name + (it.size != null ? ` (${SIZES[it.size]})` : "");
      return `• ${it.qty} x ${label} — ${unit == null ? "por confirmar" : money(unit * it.qty)}`;
    });
    const total = cart.reduce((a, it) => a + (priceOf(it) || 0) * it.qty, 0);
    const pending = cart.some((it) => priceOf(it) == null);

    const msg = [
      `¡Hola ${BUSINESS.name}! 🍕 Quiero hacer un pedido:`,
      "",
      ...lines,
      "",
      `*Total: ${money(total)}*${pending ? " (+ productos por confirmar)" : ""}`,
      "",
      `👤 ${name}`,
      `📱 ${phone}`,
      delivery ? `🛵 Delivery a: ${address}` : "🏃 Recojo en tienda",
      `💳 Pago: ${form.elements.pay.value}${form.elements.pay.value === "Efectivo" && form.elements.cash.value.trim() ? ` (pago con S/ ${form.elements.cash.value.trim()})` : ""}`,
      form.elements.notes.value.trim() ? `📝 Notas: ${form.elements.notes.value.trim()}` : "",
    ].filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n").trim();

    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  /* ================= TOAST ================= */
  let toastTimer;
  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-show"), 2200);
  }

  renderCart();
})();
