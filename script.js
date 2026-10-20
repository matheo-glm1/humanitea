// ---------- HelloAsso ----------
// Formulaire de don (affiché dans le site). Si le lien est vide, le bouton ouvre la page HelloAsso.
// Le paiement du panier passe par la fonction Netlify netlify/functions/checkout.mjs.
const HELLOASSO = {
  page: "https://www.helloasso.com/associations/humanitea",
  don: "https://www.helloasso.com/associations/humanitea/formulaires/10"
};

// ---------- Produits ----------
// Les produits (noms, prix, tailles, photos…) sont dans products.json :
// c'est le seul endroit à modifier, le site ET le paiement HelloAsso le lisent.
const PRODUCTS = await (await fetch("products.json")).json();
const productIndex = id => PRODUCTS.findIndex(p => p.id === id);

// ---------- Illustrations SVG ----------
const SHAPES = {
  tshirt: {
    body: ["M62 42 L82 32 Q100 48 118 32 L138 42 L170 68 L152 90 L140 80 L140 172 L60 172 L60 80 L48 90 L30 68 Z"],
    lines: ["M82 32 Q100 48 118 32"], bands: [[96, 118], [126, 133]]
  },
  hoodie: {
    body: ["M64 50 L82 40 L118 40 L136 50 L164 128 L146 134 L136 98 L136 174 L64 174 L64 98 L54 134 L36 128 Z",
           "M80 44 Q76 14 100 14 Q124 14 120 44 Q100 58 80 44 Z"],
    lines: ["M94 52 L92 74", "M106 52 L108 74", "M78 140 L122 140 L128 168 L72 168 Z"], bands: [[100, 122]]
  },
  sweat: {
    body: ["M64 46 L84 38 Q100 50 116 38 L136 46 L164 128 L146 134 L136 98 L136 174 L64 174 L64 98 L54 134 L36 128 Z"],
    lines: ["M84 38 Q100 56 116 38", "M64 166 L136 166"], bands: [[72, 94], [118, 126]]
  },
  tote: {
    body: ["M52 74 L148 74 L156 176 L44 176 Z"],
    handle: "M72 76 Q72 28 100 28 Q128 28 128 76", lines: [], bands: [[112, 142]]
  },
  cap: {
    body: ["M48 124 Q48 62 100 62 Q152 62 152 124 Z", "M44 120 Q110 110 178 132 Q168 150 110 141 Q66 137 44 128 Z"],
    lines: ["M100 64 Q86 90 84 120", "M100 64 Q114 90 116 118"], dot: [100, 61], bands: [[90, 106]]
  },
  socks: {
    body: ["M58 34 L90 34 L90 126 Q90 158 64 162 L40 162 Q28 148 44 136 L58 124 Z",
           "M110 44 L142 44 L142 136 Q142 168 116 172 L92 172 Q80 158 96 146 L110 134 Z"],
    lines: ["M58 48 L90 48", "M110 58 L142 58"], bands: [[64, 88], [74, 98]]
  }
};

let uid = 0;
function coverSVG(p, i, imageIndex = 0) {
  if (p.images?.length) {
    return `<img src="${p.images[imageIndex] || p.images[0]}" alt="${p.name}">`;
  }

  const id = "h" + (uid++);
  const shapeType = p.type.toLowerCase().replace(/-/g, "");
  const s = SHAPES[shapeType];
  const [c1, c2, c3] = p.pattern;
  const bodies = s.body.map(d => `<path d="${d}"/>`).join("");
  const bands = s.bands.map(([a, b]) =>
    `<rect x="0" y="${a}" width="200" height="${b - a}" fill="url(#${id}p)"/>` +
    `<rect x="0" y="${a - 3}" width="200" height="2.5" fill="${c3}"/><rect x="0" y="${b + .5}" width="200" height="2.5" fill="${c3}"/>`
  ).join("");
  const handle = s.handle
    ? `<path d="${s.handle}" fill="none" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
       <path d="${s.handle}" fill="none" stroke="${p.garment}" stroke-width="4.5" stroke-linecap="round"/>` : "";
  const dot = s.dot ? `<circle cx="${s.dot[0]}" cy="${s.dot[1]}" r="4.5" fill="${c1}" stroke="#141414" stroke-width="2.2"/>` : "";
  const num = String(i + 1).padStart(2, "0");

  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <pattern id="${id}p" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="${c2}"/>
      <path d="M0 8 L4 3 L8 8 L12 3 L16 8 L16 13 L12 8 L8 13 L4 8 L0 13 Z" fill="${c1}"/>
      <path d="M8 0 L10 2 L8 4 L6 2 Z M0 14 L2 16 L0 16 Z M16 14 L14 16 L16 16 Z" fill="${c3}"/>
    </pattern>
    <clipPath id="${id}c">${bodies}</clipPath>
    <path id="${id}r" d="M80 80 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0"/>
  </defs>
  <rect width="400" height="400" fill="${p.cover}"/>
  <circle cx="210" cy="215" r="150" fill="${p.circle}"/>
  <circle cx="210" cy="215" r="150" fill="none" stroke="#141414" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" opacity=".35"/>
  <g transform="translate(14 22) scale(1.9)">
    <g fill="#141414" opacity=".18" transform="translate(4 5)">${bodies}</g>
    ${handle}
    <g fill="${p.garment}">${bodies}</g>
    <g clip-path="url(#${id}c)">${bands}</g>
    <g fill="none" stroke="#141414" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      ${bodies}${s.lines.map(d => `<path d="${d}"/>`).join("")}
    </g>
    ${dot}
  </g>
  <g transform="rotate(-12 80 80)">
    <circle cx="80" cy="80" r="50" fill="${p.sticker}" stroke="#141414" stroke-width="3"/>
    <text font-family="DM Sans, sans-serif" font-weight="700" font-size="11" letter-spacing="2.6" fill="#fff8ec">
      <textPath href="#${id}r">HUMANITEA · VOL. I · HUMANITEA ·</textPath>
    </text>
    <text x="80" y="92" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="34" fill="#fff8ec">${num}</text>
  </g>
  <g transform="rotate(4 330 352)">
    <rect x="262" y="334" width="124" height="36" rx="6" fill="#fff8ec" stroke="#141414" stroke-width="2.5"/>
    <text x="324" y="350" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="11" fill="#141414">100% des bénéfices</text>
    <text x="324" y="363" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="10" fill="#141414">→ Guatemala</text>
  </g>
</svg>`;
}

// Tampon postal façon carnet de voyage, posé sur le coin de chaque couverture
function stampSVG(p) {
  const id = "s" + (uid++);
  const word = p.stamp || "GUATE";
  const size = word.length > 6 ? 17 : 21;
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <defs><path id="${id}" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0"/></defs>
    <circle cx="60" cy="60" r="56" fill="#fff8ec"/>
    <circle cx="60" cy="60" r="52" fill="none" stroke="${p.sticker}" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="60" cy="60" r="31" fill="none" stroke="${p.sticker}" stroke-width="2"/>
    <text font-family="DM Sans, sans-serif" font-weight="700" font-size="10.5" letter-spacing="3.2" fill="${p.sticker}">
      <textPath href="#${id}">GUATEMALA · CENTROAMÉRICA ·</textPath>
    </text>
    <text x="60" y="58" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="${size}" fill="#141414">${word}</text>
    <text x="60" y="75" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="9" letter-spacing="2" fill="#141414">GT · ${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}</text>
  </svg>`;
}

// Le quetzal, oiseau national du Guatemala
const QUETZAL = `<svg viewBox="0 0 120 64" class="quetzal" aria-hidden="true">
  <g stroke="#141414" stroke-width="2" stroke-linejoin="round">
    <path d="M46 34 Q22 44 2 60 Q26 52 50 40 Z" fill="#1f9e6e"/>
    <path d="M48 37 Q30 52 16 62 Q36 54 52 41 Z" fill="#147a52"/>
    <ellipse cx="63" cy="31" rx="19" ry="12" fill="#22b77c"/>
    <ellipse cx="68" cy="37" rx="10" ry="6" fill="#e63946"/>
    <path d="M74 16 Q77 7 85 11 Q81 12 79 17 Z" fill="#22b77c"/>
    <circle cx="80" cy="22" r="9" fill="#22b77c"/>
    <path d="M88 20 L96 23 L88 26 Z" fill="#ffb703"/>
    <path class="aile" d="M54 27 Q63 6 79 18 Q68 23 58 31 Z" fill="#147a52"/>
  </g>
  <circle cx="82" cy="20" r="1.8" fill="#141414"/>
</svg>`;

function flyQuetzal(fromEl) {
  if (!fromEl || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = fromEl.getBoundingClientRect(), b = document.querySelector(".cart-count").getBoundingClientRect();
  const wrap = document.createElement("div");
  wrap.innerHTML = QUETZAL;
  const bird = wrap.firstElementChild;
  document.body.appendChild(bird);
  const x0 = a.left + a.width / 2 - 48, y0 = a.top + a.height / 2 - 26;
  const x1 = b.left + b.width / 2 - 48, y1 = b.top + b.height / 2 - 26;
  const flip = x1 < x0 ? " scaleX(-1)" : "";
  bird.animate([
    { transform: `translate(${x0}px, ${y0}px) scale(.6)${flip}`, opacity: 0 },
    { transform: `translate(${(x0 + x1) / 2}px, ${Math.max(70, Math.min(y0, y1) - 140)}px) scale(1.2)${flip}`, opacity: 1, offset: .5 },
    { transform: `translate(${x1}px, ${y1}px) scale(.3)${flip}`, opacity: .2 }
  ], { duration: 1100, easing: "cubic-bezier(.45,0,.4,1)" }).onfinish = () => bird.remove();
}

const $ = s => document.querySelector(s);
const euro = n => n.toLocaleString("fr-FR") + " €";
const label = (p, i) => String(i + 1).padStart(2, "0") + "." + p.name;

// ---------- Carrousel ----------
const track = $("#track"), stage = $("#stage"), halo = $("#halo"), player = $("#player");
const cards = PRODUCTS.map((p, i) => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `<div class="cover">${coverSVG(p, i)}</div><div class="stamp">${stampSVG(p)}</div>`;
  el.addEventListener("click", () => {
    if (moved) return;
    if (i === Math.round(pos)) openProduct(i); else goTo(i);
  });
  track.appendChild(el);
  return el;
});

let pos = 0, target = 0, current = -1, snapTimer;
const last = PRODUCTS.length - 1;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const spacing = () => Math.min(innerWidth * (innerWidth < 760 ? .62 : .36), 480);

function goTo(i) { target = clamp(i, 0, last); }
function snap() { target = clamp(Math.round(target), 0, last); }

let dirty = true;
addEventListener("resize", () => (dirty = true));

function frame() {
  requestAnimationFrame(frame);
  if (pos === target && !dirty) return; // rien ne bouge : on ne repeint pas
  dirty = false;
  pos += (target - pos) * 0.09;
  if (Math.abs(target - pos) < 0.0005) pos = target;
  const sp = spacing();

  cards.forEach((el, i) => {
    const d = i - pos, ad = Math.abs(d);
    const x = d * sp + Math.sign(d) * Math.min(ad, 1) * sp * 0.12;
    const scale = 1 - Math.min(ad, 2.5) * 0.2;
    const rot = clamp(-d * 18, -30, 30);
    const tilt = Math.sin(d * 1.3) * 4;
    el.style.transform = `translate(-50%,-50%) translateX(${x}px) translateZ(${-ad * 220}px) rotateY(${rot}deg) rotateZ(${tilt}deg) scale(${scale})`;
    el.style.zIndex = 100 - Math.round(ad * 10);
    el.style.opacity = ad > 2.7 ? 0 : 1 - Math.max(0, ad - 1.8);
    el.classList.toggle("is-center", ad < 0.3);
  });

  document.body.style.setProperty("--px", (pos * 14).toFixed(1)); // parallaxe des volcans

  const idx = Math.round(pos);
  player.classList.toggle("hidden", Math.abs(pos - idx) > 0.2 || dragging);
  if (idx !== current) { current = idx; updatePlayer(); }
}

function updatePlayer() {
  const p = PRODUCTS[current];
  $("#playerTitle").textContent = label(p, current);
  $("#playerSub").textContent = "📍 " + (p.place || "Guatemala") + " · " + (p.sizes.length > 1 ? p.sizes.length + " tailles" : "taille unique");
  $("#playerPrice").textContent = euro(p.price);
  $("#playerAdd").classList.remove("done");
}

// Molette / trackpad
addEventListener("wheel", e => {
  if (document.querySelector(".open")) return;
  e.preventDefault();
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  target = clamp(target + delta * 0.0025, -0.3, last + 0.3);
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snap, 140);
}, { passive: false });

// Glisser
let dragging = false, moved = false, startX = 0, startTarget = 0;
stage.addEventListener("pointerdown", e => {
  dragging = true; dirty = true; moved = false; startX = e.clientX; startTarget = target;
  stage.classList.add("dragging");
});
addEventListener("pointermove", e => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 5) moved = true;
  target = clamp(startTarget - dx / spacing(), -0.3, last + 0.3);
});
addEventListener("pointerup", e => {
  if (!dragging) return;
  dragging = false; dirty = true; stage.classList.remove("dragging");
  const dx = e.clientX - startX;
  if (moved && Math.abs(dx) > 40 && Math.round(target) === Math.round(startTarget)) target = startTarget - Math.sign(dx);
  snap();
  setTimeout(() => (moved = false), 0);
});

// Clavier
addEventListener("keydown", e => {
  if (e.key === "Escape") return closeAll();
  if (document.querySelector(".open")) return;
  if (e.key === "ArrowRight") goTo(Math.round(target) + 1);
  if (e.key === "ArrowLeft") goTo(Math.round(target) - 1);
  if (e.key === "Enter") openProduct(Math.round(target));
});
$("#prev").onclick = () => goTo(Math.round(target) - 1);
$("#next").onclick = () => goTo(Math.round(target) + 1);

// ---------- Panier ----------
let cart = [];
try { cart = JSON.parse(localStorage.getItem("humanitea-cart")) || []; } catch (e) { cart = []; }
// On ne garde que les lignes dont le produit existe encore dans le catalogue
cart = cart.filter(l => l && productIndex(l.id) !== -1 && PRODUCTS[productIndex(l.id)].sizes.includes(l.size));
function saveCart() { try { localStorage.setItem("humanitea-cart", JSON.stringify(cart)); } catch (e) {} }

function addToCart(i, size, fromEl) {
  flyQuetzal(fromEl);
  const id = PRODUCTS[i].id;
  const line = cart.find(l => l.id === id && l.size === size);
  if (line) line.qty++; else cart.push({ id, size, qty: 1 });
  saveCart(); renderCart();
  const c = $(".cart-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  toast(`¡Gracias ! ${PRODUCTS[i].name} (${size}) ajouté au panier`);
}

function renderCart() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const total = cart.reduce((s, l) => s + l.qty * PRODUCTS[productIndex(l.id)].price, 0);
  $(".cart-count").textContent = count;
  $("#cartTotal").textContent = euro(total);
  $("#impactLine").textContent = count ? "¡Muchas gracias ! Les bénéfices de cette commande partent à 100 % vers nos projets au Guatemala." : "";
  $("#checkout").disabled = !count;
  $("#checkout").style.opacity = count ? 1 : .4;
  const list = $("#cartList");
  if (!count) { list.innerHTML = `<p class="empty">Ton panier est vide.<br>¡Vamos ! Fais un tour dans la collection.</p>`; return; }
  list.innerHTML = cart.map((l, k) => {
    const i = productIndex(l.id), p = PRODUCTS[i];
    return `<div class="line">
      <div class="cover">${coverSVG(p, i)}</div>
      <div class="line-info"><p>${p.name}</p><small>${l.size} · ${euro(p.price)}</small></div>
      <div class="qty"><button data-q="${k}" data-d="-1" aria-label="Retirer un">−</button><span>${l.qty}</span><button data-q="${k}" data-d="1" aria-label="Ajouter un">+</button></div>
    </div>`;
  }).join("");
}
$("#cartList").addEventListener("click", e => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  const l = cart[+b.dataset.q]; l.qty += +b.dataset.d;
  if (l.qty <= 0) cart.splice(+b.dataset.q, 1);
  saveCart(); renderCart();
});
// Paiement : la fonction Netlify recalcule le montant à partir de products.json,
// crée le paiement chez HelloAsso et renvoie l'adresse de la page de paiement.
$("#checkout").onclick = async () => {
  const btn = $("#checkout");
  btn.disabled = true; btn.textContent = "Connexion à HelloAsso…";
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart.map(({ id, size, qty }) => ({ id, size, qty })) })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.redirectUrl) throw new Error(data.error || "Paiement indisponible");
    location.href = data.redirectUrl; // page de paiement HelloAsso
  } catch (err) {
    const local = ["localhost", "127.0.0.1"].includes(location.hostname);
    toast(local ? "Le paiement marche une fois le site en ligne sur Netlify 🙂" : "Oups, le paiement n'a pas pu démarrer. Réessaie dans un instant.");
    btn.disabled = false; btn.textContent = "Payer avec HelloAsso";
  }
};

// Retour depuis HelloAsso : on vérifie la commande côté serveur (les paramètres d'URL ne suffisent pas)
async function handlePaymentReturn() {
  const q = new URLSearchParams(location.search);
  const state = q.get("paiement");
  if (!state) return;
  history.replaceState(null, "", location.pathname);
  if (state === "annule") { openPanel("cart"); return toast("Paiement annulé, ton panier t'attend 🙂"); }
  if (state === "erreur") { openPanel("cart"); return toast("Le paiement n'a pas abouti. Tu peux réessayer."); }
  const id = q.get("checkoutIntentId");
  if (!id) return;
  try {
    const res = await fetch(`/api/verify?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (data.paid) {
      cart = []; saveCart(); renderCart();
      $("#thanksOrder").textContent = data.orderId ? `Commande n° ${data.orderId}` : "";
      openPanel("thanks");
    } else {
      toast("Paiement en cours de validation… tu recevras un e-mail de HelloAsso.");
    }
  } catch (e) {
    toast("Impossible de vérifier le paiement pour l'instant. Regarde tes e-mails HelloAsso.");
  }
}

// Don : formulaire HelloAsso intégré dans le site (ou page HelloAsso si pas encore de formulaire)
function openDon(e) {
  e.preventDefault();
  if (!HELLOASSO.don) return window.open(HELLOASSO.page, "_blank", "noopener");
  if (!$("#donFrame iframe")) {
    $("#donFrame").innerHTML = `<iframe src="${HELLOASSO.don.replace(/\/$/, "")}/widget" title="Formulaire de don HelloAsso" allowtransparency="true"></iframe>`;
  }
  openPanel("don");
}
document.querySelectorAll("[data-don]").forEach(b => b.addEventListener("click", openDon));

$("#playerAdd").onclick = () => {
  const p = PRODUCTS[current];
  if (p.sizes.length > 1) return openProduct(current);
  addToCart(current, p.sizes[0], $("#playerAdd"));
  $("#playerAdd").classList.add("done");
};

// ---------- Fiche produit ----------
let pvIndex = 0, pvSize = null, pvImageIndex = 0;
function openProduct(i) {
  const p = PRODUCTS[i]; pvIndex = i; pvImageIndex = 0; pvSize = p.sizes.length === 1 ? p.sizes[0] : null;
  const images = p.images || [];
  $("#pvCover").innerHTML = images.length
    ? `<div class="product-gallery">
        <div class="cover"><img id="pvMainImage" src="${images[0]}" alt="${p.name}"></div>
        ${images.length > 1 ? `<div class="product-thumbnails" role="group" aria-label="Images de ${p.name}">
          ${images.map((image, index) => `<button type="button" class="product-thumbnail${index === 0 ? " is-active" : ""}" data-image-index="${index}" aria-label="Afficher l’image ${index + 1}" aria-pressed="${index === 0}">
            <img src="${image}" alt="">
          </button>`).join("")}
        </div>` : ""}
      </div>`
    : `<div class="cover">${coverSVG(p, i)}</div>`;
  $("#pvCover").insertAdjacentHTML("beforeend", `<div class="stamp">${stampSVG(p)}</div>`);
  $("#pvNum").textContent = String(i + 1).padStart(2, "0") + " / 📍 " + (p.place || "Guatemala");
  $("#pvName").textContent = p.name;
  $("#pvDesc").textContent = p.desc;
  $("#pvImpact").textContent = "🌎 " + p.impact;
  $("#pvPrice").textContent = euro(p.price);
  $("#pvSizes").innerHTML = p.sizes.map(s => `<button class="${s === pvSize ? "sel" : ""}">${s}</button>`).join("");
  openPanel("product");
}
$("#pvCover").addEventListener("click", e => {
  const button = e.target.closest("[data-image-index]");
  if (!button) return;
  pvImageIndex = Number(button.dataset.imageIndex);
  const p = PRODUCTS[pvIndex];
  $("#pvMainImage").src = p.images[pvImageIndex];
  $("#pvMainImage").alt = `${p.name} — image ${pvImageIndex + 1} sur ${p.images.length}`;
  $("#pvCover").querySelectorAll("[data-image-index]").forEach((thumbnail, index) => {
    const selected = index === pvImageIndex;
    thumbnail.classList.toggle("is-active", selected);
    thumbnail.setAttribute("aria-pressed", String(selected));
  });
});
$("#pvSizes").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  pvSize = b.textContent;
  [...$("#pvSizes").children].forEach(x => x.classList.toggle("sel", x === b));
});
$("#pvAdd").onclick = () => {
  if (!pvSize) return toast("Choisis d'abord une taille 👕");
  addToCart(pvIndex, pvSize, $("#pvAdd"));
  closeAll();
};

// ---------- Grille ----------
$("#gridList").innerHTML = PRODUCTS.map((p, i) =>
  `<button class="grid-item" data-i="${i}"><div class="cover">${coverSVG(p, i)}</div><p>${label(p, i)}</p><small>${euro(p.price)}</small></button>`
).join("");
$("#gridList").addEventListener("click", e => {
  const b = e.target.closest("[data-i]"); if (!b) return;
  closeAll(); goTo(+b.dataset.i);
});

// ---------- Overlays ----------
function openPanel(id) {
  closeAll();
  $("#" + id).classList.add("open");
  $("#" + id).setAttribute("aria-hidden", "false");
  if (id === "cart") $("#scrim").classList.add("open");
}
function closeAll() {
  document.querySelectorAll(".open").forEach(el => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); });
}
document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openPanel(b.dataset.open); }));
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeAll));

document.querySelectorAll(".about-tab").forEach(tab => tab.addEventListener("click", () => {
  const showBoard = tab.id === "boardTab";
  $("#aboutPanel").hidden = showBoard;
  $("#boardPanel").hidden = !showBoard;
  $("#aboutTab").setAttribute("aria-selected", String(!showBoard));
  $("#boardTab").setAttribute("aria-selected", String(showBoard));
  $("#aboutTab").classList.toggle("is-active", !showBoard);
  $("#boardTab").classList.toggle("is-active", showBoard);
}));

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

renderCart();
handlePaymentReturn();
requestAnimationFrame(frame);
