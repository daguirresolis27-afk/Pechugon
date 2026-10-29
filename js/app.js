(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => (n == null ? "Consultar" : "S/ " + n.toFixed(2));
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const iconFor = (p) => ICONS[catById[p.cat].icon];
  const fromPrice = (p) => (p.sizes ? p.sizes[0] : p.price);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Productos que se muestran en "Promociones"
  const PROMO_IDS = ["br-dbarrio", "hb-super-grueso", "br-mostro", "pz-pepperoni-esp", "al-bbq", "sp-salchipollo-pobre", "hb-royal", "al-chaufa"];

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

  // Marca en el menú la sección visible
  const navLinks = $$("a", nav);
  const navTargets = [[".hero", "#inicio"], ["#promociones"], ["#carta"], ["#como-pedir"], ["#contacto"]];
  const navSpy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === e.target.dataset.nav));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navTargets.forEach(([sel, href = sel]) => {
    const el = $(sel);
    el.dataset.nav = href;
    navSpy.observe(el);
  });

  /* ================= BANNERS ================= */
  const slides = $$(".banner");
  const dots = $("#heroDots");
  let current = 0;
  let timer;
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Banner ${i + 1}`);
    b.addEventListener("click", () => go(i, true));
    dots.appendChild(b);
  });
  function go(i, user) {
    current = (i + slides.length) % slides.length;
    $("#heroTrack").style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, j) => s.setAttribute("aria-hidden", j !== current));
    $$("button", dots).forEach((d, j) => d.setAttribute("aria-selected", j === current));
    if (user) restart();
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(current + 1), 5000);
  }
  $("#heroPrev").addEventListener("click", () => go(current - 1, true));
  $("#heroNext").addEventListener("click", () => go(current + 1, true));
  let touchX = null;
  const viewport = $(".hero__viewport");
  viewport.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1), true);
    touchX = null;
  });
  go(0);
  restart();

  /* ================= CATEGORÍAS ================= */
  $("#catTiles").innerHTML = CATEGORIES.map((c) => `
    <a class="cat-tile" href="#cat-${c.id}">
      <span class="cat-tile__img">${ICONS[c.icon]}</span>
      <span class="cat-tile__name">${esc(c.name)}</span>
    </a>`).join("");

  $("#sideCats").innerHTML = CATEGORIES.map((c) => `
    <li><a href="#cat-${c.id}" data-cat="${c.id}">
      <span class="side-icon">${ICONS[c.icon]}</span>${esc(c.name)}
      <em>${PRODUCTS.filter((p) => p.cat === c.id).length}</em>
    </a></li>`).join("");

  $("#catChips").innerHTML = CATEGORIES.map((c) => `<a class="chip" href="#cat-${c.id}" data-cat="${c.id}">${esc(c.name)}</a>`).join("");
  $("#footerCats").innerHTML = CATEGORIES.map((c) => `<li><a href="#cat-${c.id}">${esc(c.name)}</a></li>`).join("");

  /* ================= TARJETAS ================= */
  function cardHTML(p, extraClass = "") {
    const price = fromPrice(p);
    return `
      <article class="card ${extraClass}" data-id="${p.id}" data-search="${esc(fold(p.name + " " + p.desc + " " + (p.tag || "")))}">
        <button class="card__img card__img--${p.cat}" data-open="${p.id}" aria-label="Ver ${esc(p.name)}">
          ${iconFor(p)}
          ${p.featured ? '<span class="badge">Lo más pedido</span>' : ""}
          ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
        </button>
        <div class="card__body">
          <h4>${p.sizes ? "Pizza " : ""}${esc(p.name)}</h4>
          <p>${esc(p.desc)}</p>
          <div class="card__foot">
            <div class="card__price ${price == null ? "is-ask" : ""}">
              ${p.sizes ? "<small>Desde</small>" : ""}${money(price)}
            </div>
            <button class="btn btn--red btn--sm" data-${p.sizes ? "open" : "add"}="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`;
  }

  $("#promoRow").innerHTML = PROMO_IDS.map((id) => cardHTML(byId[id], "card--promo")).join("");
  const promoRow = $("#promoRow");
  const promoStep = () => (promoRow.firstElementChild?.offsetWidth || 260) + 20;
  $("#promoPrev").addEventListener("click", () => promoRow.scrollBy({ left: -promoStep(), behavior: "smooth" }));
  $("#promoNext").addEventListener("click", () => promoRow.scrollBy({ left: promoStep(), behavior: "smooth" }));

  const sections = $("#menuSections");
  sections.innerHTML = CATEGORIES.map((c) => `
    <section class="cat" id="cat-${c.id}" data-cat="${c.id}">
      <header class="cat__head">
        <h3>${esc(c.name)}</h3>
        <span>${esc(c.note)}</span>
      </header>
      <div class="grid">${PRODUCTS.filter((p) => p.cat === c.id).map((p) => cardHTML(p)).join("")}</div>
    </section>`).join("");

  // Resalta la categoría visible
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.cat;
      $$("#sideCats a, #catChips a").forEach((a) => a.classList.toggle("is-active", a.dataset.cat === id));
      const chip = $(`#catChips a[data-cat="${id}"]`);
      chip.parentElement.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$(".cat", sections).forEach((s) => spy.observe(s));

  // Búsqueda
  $("#search").addEventListener("input", (e) => {
    const q = fold(e.target.value.trim());
    let any = false;
    $$(".cat", sections).forEach((sec) => {
      let visible = 0;
      $$(".card", sec).forEach((card) => {
        const show = !q || card.dataset.search.includes(q);
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
  cart = cart.filter((it) => byId[it.id]);
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* sin almacenamiento */ } };

  const priceOf = (it) => { const p = byId[it.id]; return p.sizes ? p.sizes[it.size] : p.price; };
  const cartTotal = () => cart.reduce((a, it) => a + (priceOf(it) || 0) * it.qty, 0);
  const labelOf = (it) => { const p = byId[it.id]; return (p.sizes ? "Pizza " : "") + p.name; };

  function addToCart(id, size = null, qty = 1) {
    const key = size == null ? id : `${id}#${size}`;
    const found = cart.find((it) => it.key === key);
    if (found) found.qty += qty;
    else cart.push({ key, id, size, qty });
    save();
    renderCart();
    bump();
    toast(`Agregaste ${qty} x ${labelOf({ id })}${size != null ? " " + SIZES[size] : ""}`);
  }

  function renderCart() {
    const count = cart.reduce((a, it) => a + it.qty, 0);
    const total = cartTotal();
    $("#cartCount").textContent = count;
    $("#cartTotalHdr").textContent = money(total);

    const empty = cart.length === 0;
    $("#cartEmpty").hidden = !empty;
    $("#checkout").hidden = empty;
    $("#drawerFoot").hidden = empty;

    $("#cartList").innerHTML = cart.map((it) => {
      const p = byId[it.id];
      const unit = priceOf(it);
      return `
        <li class="cart-item" data-key="${esc(it.key)}">
          <div class="cart-item__img card__img--${p.cat}">${iconFor(p)}</div>
          <div class="cart-item__info">
            <strong>${esc(labelOf(it))}</strong>
            ${it.size != null ? `<small>Tamaño: ${SIZES[it.size]}</small>` : ""}
            <div class="cart-item__row">
              <div class="qty">
                <button type="button" data-dec aria-label="Quitar uno">−</button>
                <span>${it.qty}</span>
                <button type="button" data-inc aria-label="Agregar uno">+</button>
              </div>
              <span class="cart-item__price">${unit == null ? "Por confirmar" : money(unit * it.qty)}</span>
            </div>
          </div>
          <button type="button" class="cart-item__del" data-del aria-label="Eliminar">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Z"/></svg>
          </button>
        </li>`;
    }).join("");

    $("#cartTotal").textContent = money(total);
    $("#totalNote").hidden = !cart.some((it) => priceOf(it) == null);
  }

  $("#cartList").addEventListener("click", (e) => {
    const li = e.target.closest(".cart-item");
    if (!li) return;
    const it = cart.find((x) => x.key === li.dataset.key);
    if (e.target.closest("[data-inc]")) it.qty++;
    else if (e.target.closest("[data-dec]")) it.qty--;
    else if (e.target.closest("[data-del]")) it.qty = 0;
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
  $("#goMenu").addEventListener("click", () => { closeCart(); location.hash = "#carta"; });

  function bump() {
    const b = $("#cartOpen");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }

  /* ================= DETALLE DE PRODUCTO ================= */
  const modal = $("#productModal");
  let pm = null;
  function openProduct(id) {
    const p = byId[id];
    pm = { id, size: p.sizes ? 1 : null, qty: 1 };
    $("#pmImg").className = `modal__img card__img--${p.cat}`;
    $("#pmImg").innerHTML = iconFor(p);
    $("#pmCat").textContent = catById[p.cat].name + (p.tag ? " · " + p.tag : "");
    $("#pmTitle").textContent = (p.sizes ? "Pizza " : "") + p.name;
    $("#pmDesc").textContent = p.desc + (catById[p.cat].note ? ". " + catById[p.cat].note + "." : "");
    $("#pmSizesWrap").hidden = !p.sizes;
    if (p.sizes) {
      $("#pmSizes").innerHTML = p.sizes.map((v, i) => `
        <label class="size-opt">
          <input type="radio" name="pmSize" value="${i}" ${i === pm.size ? "checked" : ""} />
          <span><b>${SIZES[i]}</b>${money(v)}</span>
        </label>`).join("");
    }
    updateProduct();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $("#pmAdd").focus();
  }
  function updateProduct() {
    const p = byId[pm.id];
    const unit = p.sizes ? p.sizes[pm.size] : p.price;
    $("#pmQty").textContent = pm.qty;
    $("#pmPrice").textContent = money(unit);
    $("#pmAdd").textContent = unit == null ? "Agregar" : `Agregar ${money(unit * pm.qty)}`;
  }
  function closeProduct() {
    modal.hidden = true;
    if (!drawer.classList.contains("is-open")) document.body.classList.remove("no-scroll");
  }
  $("#pmSizes").addEventListener("change", (e) => { pm.size = +e.target.value; updateProduct(); });
  $("#pmMinus").addEventListener("click", () => { pm.qty = Math.max(1, pm.qty - 1); updateProduct(); });
  $("#pmPlus").addEventListener("click", () => { pm.qty++; updateProduct(); });
  $("#pmAdd").addEventListener("click", () => { addToCart(pm.id, pm.size, pm.qty); closeProduct(); });
  $("#pmClose").addEventListener("click", closeProduct);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeProduct(); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeProduct();
    else if (drawer.classList.contains("is-open")) closeCart();
  });

  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) return openProduct(open.dataset.open);
    const add = e.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add);
  });

  /* ================= DELIVERY / RECOJO ================= */
  const form = $("#checkout");
  const f = form.elements;
  function setMode(mode) {
    $$('input[name="hdrMode"]').forEach((r) => (r.checked = r.value === mode));
    f.mode.value = mode;
    $("#hdrAddressWrap").hidden = mode !== "delivery";
    $("#hdrPickup").hidden = mode === "delivery";
    syncForm();
  }
  function syncForm() {
    $("#addressField").hidden = f.mode.value !== "delivery";
    const yape = f.pay.value === "Yape";
    $("#yapeBox").hidden = !yape;
    $("#cashField").hidden = yape;
  }
  $$('input[name="hdrMode"]').forEach((r) => r.addEventListener("change", () => setMode(r.value)));
  form.addEventListener("change", (e) => (e.target.name === "mode" ? setMode(f.mode.value) : syncForm()));
  // La dirección del encabezado y la del formulario se mantienen iguales
  $("#hdrAddress").addEventListener("input", (e) => (f.address.value = e.target.value));
  f.address.addEventListener("input", (e) => ($("#hdrAddress").value = e.target.value));
  setMode("delivery");

  $("#copyYape").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("923433817");
      toast("Número de Yape copiado");
    } catch {
      toast("Yape: 923 433 817");
    }
  });

  /* ================= ENVÍO POR WHATSAPP ================= */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#formError");
    const name = f.name.value.trim();
    const phone = f.phone.value.trim();
    const delivery = f.mode.value === "delivery";
    const address = f.address.value.trim();
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
      const unit = priceOf(it);
      return `• ${it.qty} x ${labelOf(it)}${it.size != null ? ` (${SIZES[it.size]})` : ""} — ${unit == null ? "por confirmar" : money(unit * it.qty)}`;
    });
    const pending = cart.some((it) => priceOf(it) == null);
    const cash = f.cash.value.trim();
    const notes = f.notes.value.trim();

    const msg = [
      `¡Hola ${BUSINESS.name}! Quiero hacer un pedido:`,
      "",
      ...lines,
      "",
      `*Total: ${money(cartTotal())}*${pending ? " (+ productos por confirmar)" : ""}`,
      "",
      `Nombre: ${name}`,
      `Celular: ${phone}`,
      delivery ? `Delivery a: ${address}` : "Recojo en tienda",
      `Pago: ${f.pay.value}${f.pay.value === "Efectivo" && cash ? ` (pago con S/ ${cash})` : ""}`,
      notes ? `Comentarios: ${notes}` : "",
    ].join("\n").trim();

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
