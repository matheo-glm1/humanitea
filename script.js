// ---------- Produits ----------
// Remplace les textes, prix et tailles par les vrais produits de l'asso.
const PRODUCTS = [
  {
    name: "T-shirt Quetzal", type: "tshirt", price: 25, sizes: ["XS", "S", "M", "L", "XL"],
    bg: "#2bb07f", halo: "#8be6c0", cover: "#ffd3dc", circle: "#ff8fab",
    garment: "#fff3dc", pattern: ["#e63946", "#ffb703", "#1d3557"], sticker: "#e63946",
    desc: "Le basique en coton bio, brodé d'une bande inspirée des huipiles, les blouses tissées traditionnelles du Guatemala.",
    impact: "Chaque t-shirt aide à financer des fournitures scolaires."
  },
  {
    name: "Hoodie Atitlán", type: "hoodie", price: 45, sizes: ["S", "M", "L", "XL"],
    bg: "#3d7bff", halo: "#a9c6ff", cover: "#c9f2e2", circle: "#5fd3a5",
    garment: "#ffb703", pattern: ["#1d3557", "#e63946", "#fff3dc"], sticker: "#1d3557",
    desc: "Molleton épais et capuche doublée, aux couleurs du lac Atitlán et de ses volcans.",
    impact: "Chaque hoodie contribue à nos projets d'accès à l'eau potable."
  },
  {
    name: "Tote bag Mercado", type: "tote", price: 15, sizes: ["unique"],
    bg: "#ff7a1a", halo: "#ffc799", cover: "#fff0a8", circle: "#ffd23f",
    garment: "#fff3dc", pattern: ["#7b2cbf", "#2bb07f", "#e63946"], sticker: "#7b2cbf",
    desc: "Le sac des marchés colorés de Chichicastenango, en toile solide pour tous les jours.",
    impact: "Chaque tote soutient l'artisanat textile local."
  },
  {
    name: "Casquette Volcán", type: "cap", price: 20, sizes: ["unique"],
    bg: "#e63946", halo: "#ff9ea6", cover: "#d7ccff", circle: "#9d85ff",
    garment: "#1d3557", pattern: ["#ffb703", "#fff3dc", "#2bb07f"], sticker: "#ffb703",
    desc: "Casquette réglable en coton, avec un galon tissé sur le devant.",
    impact: "Chaque casquette aide à équiper les écoles des villages."
  },
  {
    name: "Sweat Huipil", type: "sweat", price: 40, sizes: ["XS", "S", "M", "L", "XL"],
    bg: "#8f5cff", halo: "#cdb8ff", cover: "#ffe1b8", circle: "#ffab5e",
    garment: "#ff6fb5", pattern: ["#ffb703", "#1d3557", "#2bb07f"], sticker: "#2bb07f",
    desc: "Col rond, coupe ample, double bande de motifs géométriques sur la poitrine et les poignets.",
    impact: "Chaque sweat contribue à l'accès aux soins de base."
  },
  {
    name: "Chaussettes Tikal", type: "socks", price: 10, sizes: ["36-40", "41-45"],
    bg: "#ffc21a", halo: "#ffe68f", cover: "#bfe3ff", circle: "#6fb8ff",
    garment: "#2bb07f", pattern: ["#e63946", "#fff3dc", "#3d7bff"], sticker: "#e63946",
    desc: "Une paire bien chaude, motifs inspirés des pyramides mayas de Tikal.",
    impact: "Le petit geste qui compte : 100 % des bénéfices partent au Guatemala."
  }
];

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
function coverSVG(p, i) {
  const id = "h" + (uid++);
  const s = SHAPES[p.type];
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

const $ = s => document.querySelector(s);
const euro = n => n.toLocaleString("fr-FR") + " €";
const label = (p, i) => String(i + 1).padStart(2, "0") + "." + p.name;

// ---------- Carrousel ----------
const track = $("#track"), stage = $("#stage"), halo = $("#halo"), player = $("#player");
const cards = PRODUCTS.map((p, i) => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `<div class="cover">${coverSVG(p, i)}</div>`;
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

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${A.map((v, k) => Math.round(v + (B[k] - v) * t)).join(",")})`;
}

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

  const lo = Math.floor(clamp(pos, 0, last)), hi = Math.min(lo + 1, last), t = pos - lo;
  const bg = mix(PRODUCTS[lo].bg, PRODUCTS[hi].bg, t);
  document.body.style.setProperty("--bg", bg);
  document.body.style.setProperty("--halo", mix(PRODUCTS[lo].halo, PRODUCTS[hi].halo, t));

  const idx = Math.round(pos);
  player.classList.toggle("hidden", Math.abs(pos - idx) > 0.2 || dragging);
  if (idx !== current) { current = idx; updatePlayer(); }
}

function updatePlayer() {
  const p = PRODUCTS[current];
  $("#playerTitle").textContent = label(p, current);
  $("#playerSub").textContent = "Humanitea Vol. I · " + (p.sizes.length > 1 ? p.sizes.length + " tailles" : "taille unique");
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
function saveCart() { try { localStorage.setItem("humanitea-cart", JSON.stringify(cart)); } catch (e) {} }

function addToCart(i, size) {
  const line = cart.find(l => l.i === i && l.size === size);
  if (line) line.qty++; else cart.push({ i, size, qty: 1 });
  saveCart(); renderCart();
  const c = $(".cart-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  toast(`${PRODUCTS[i].name} (${size}) ajouté au panier 🌋`);
}

function renderCart() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const total = cart.reduce((s, l) => s + l.qty * PRODUCTS[l.i].price, 0);
  $(".cart-count").textContent = count;
  $("#cartTotal").textContent = euro(total);
  $("#impactLine").textContent = count ? "Les bénéfices de cette commande partent à 100 % vers nos projets au Guatemala." : "";
  $("#checkout").disabled = !count;
  $("#checkout").style.opacity = count ? 1 : .4;
  const list = $("#cartList");
  if (!count) { list.innerHTML = `<p class="empty">Ton panier est vide.<br>Fais un tour dans la collection !</p>`; return; }
  list.innerHTML = cart.map((l, k) => {
    const p = PRODUCTS[l.i];
    return `<div class="line">
      <div class="cover">${coverSVG(p, l.i)}</div>
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
$("#checkout").onclick = () => toast("Paiement à brancher (HelloAsso, Stripe…) 💳");

$("#playerAdd").onclick = () => {
  const p = PRODUCTS[current];
  if (p.sizes.length > 1) return openProduct(current);
  addToCart(current, p.sizes[0]);
  $("#playerAdd").classList.add("done");
};

// ---------- Fiche produit ----------
let pvIndex = 0, pvSize = null;
function openProduct(i) {
  const p = PRODUCTS[i]; pvIndex = i; pvSize = p.sizes.length === 1 ? p.sizes[0] : null;
  $("#pvCover").innerHTML = `<div class="cover">${coverSVG(p, i)}</div>`;
  $("#pvNum").textContent = String(i + 1).padStart(2, "0") + " / Humanitea Vol. I";
  $("#pvName").textContent = p.name;
  $("#pvDesc").textContent = p.desc;
  $("#pvImpact").textContent = "🌎 " + p.impact;
  $("#pvPrice").textContent = euro(p.price);
  $("#pvSizes").innerHTML = p.sizes.map(s => `<button class="${s === pvSize ? "sel" : ""}">${s}</button>`).join("");
  open("product");
}
$("#pvSizes").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  pvSize = b.textContent;
  [...$("#pvSizes").children].forEach(x => x.classList.toggle("sel", x === b));
});
$("#pvAdd").onclick = () => {
  if (!pvSize) return toast("Choisis d'abord une taille 👕");
  addToCart(pvIndex, pvSize);
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
function open(id) {
  closeAll();
  $("#" + id).classList.add("open");
  $("#" + id).setAttribute("aria-hidden", "false");
  if (id === "cart") $("#scrim").classList.add("open");
}
function closeAll() {
  document.querySelectorAll(".open").forEach(el => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); });
}
document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(b.dataset.open); }));
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeAll));

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

renderCart();
requestAnimationFrame(frame);
