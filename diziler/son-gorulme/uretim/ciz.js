// SON GÖRÜLME: 2D çizim motoru (karakterler, telefon arayüzü, efektler)
const W = 1080, H = 1920, FPS = 24;
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ss = (a, b, t) => { const k = clamp((t - a) / (b - a)); return k * k * (3 - 2 * k); };
const easeIO = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const wob = (t, s = 0) => Math.sin(t * 1.3 + s) * .5 + Math.sin(t * 2.7 + s * 2.1) * .3 + Math.sin(t * 4.1 + s * 3.7) * .2;

// ---------- dudak senkronu ----------
function mouth(kim, t) {
  let v = 0;
  for (const r of DATA.replik) {
    if (r.kim !== kim) continue;
    const l = t - r.t + (r.onde || 0);
    if (l < 0 || l > r.sure) continue;
    const i = Math.floor(l * FPS);
    const a = r.zarf[i] || 0, b = r.zarf[i + 1] || 0;
    v = Math.max(v, lerp(a, b, l * FPS - i));
  }
  return v;
}
function blink(t, seed = 0) {
  const per = 3.1 + (seed % 1.3), ph = (t + seed * 1.7) % per;
  return ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0;
}
function konusuyor(t) { for (const r of DATA.replik) if (t >= r.t && t <= r.t + r.sure + .15) return r; return null; }

// ---------- renkler ----------
const KISI = {
  ECE: { skin: '#e6b391', skinD: '#b97c5c', hair: '#4a2818', hairL: '#6b3d26', top: '#6e1f2b', topD: '#4c1219', shirt: '#7e848c', pants: '#262a36', feet: '#e6b391', iris: '#5a3a22' },
  NEVIN: { skin: '#e8c2a4', skinD: '#b88c70', hair: '#e7e4de', hairL: '#ffffff', top: '#3c6638', topD: '#27461f', shirt: '#1d2a52', pants: '#1d2a52', feet: '#d9b296', iris: '#3c4a5a' },
  REMZI: { skin: '#c48c6c', skinD: '#8e5d44', hair: '#dedad2', hairL: '#ffffff', top: '#1d2846', topD: '#121a30', shirt: '#e6e2da', pants: '#2a2a2e', feet: '#1a1a1a', iris: '#3a2a1e' },
};

// ---------- figür ----------
// P: x,y (ayak), s (kafa boyu px), kim, view front|side|back, dir, walk (faz|null), m (ağız), bl (göz kapağı),
// eye (açıklık), brow (endişe -1..1), smile, wide (taklit gülüş), look {x,y}, tear, taklit, arms {l,r} hedefler (kafa merkezine göre, kafa birimi)
function figur(g, P) {
  const c = KISI[P.kim], h = P.s, view = P.view || 'front', dir = P.dir || 1;
  const walk = P.walk;
  const bob = walk != null ? Math.abs(Math.sin(walk)) * .06 * h : 0;
  const breath = Math.sin((P.t || 0) * (P.breathRate || 1.6)) * .012 * h * (P.breathAmp || 1);
  const hipY = P.y - 2.3 * h - bob;
  const shY = hipY - 1.55 * h + breath;
  const cx = P.x + (P.lean || 0) * h;
  const headC = { x: cx + (P.headX || 0) * h, y: shY - .72 * h + (P.headY || 0) * h };
  g.save();
  const isDress = P.kim === 'NEVIN';
  // ---- bacaklar
  const legW = .2 * h;
  const legs = [];
  for (const sgn of [-1, 1]) {
    let ang = 0;
    if (walk != null) ang = Math.sin(walk + (sgn > 0 ? Math.PI : 0)) * .38;
    const hx = view === 'side' ? cx : cx + sgn * .17 * h;
    const knee = { x: hx + Math.sin(ang) * 1.15 * h * (view === 'side' ? dir : 0) + (view !== 'side' ? Math.sin(ang) * .05 * h : 0), y: hipY + Math.cos(ang) * 1.15 * h };
    const ang2 = ang - Math.max(0, -Math.sin(walk != null ? walk + (sgn > 0 ? Math.PI : 0) + 1.2 : 0)) * .5;
    const foot = { x: knee.x + Math.sin(ang2) * 1.1 * h * (view === 'side' ? dir : 0), y: knee.y + Math.cos(ang2) * 1.1 * h };
    if (view !== 'side' && walk != null) foot.y -= Math.max(0, Math.sin(walk + (sgn > 0 ? Math.PI : 0))) * .12 * h;
    legs.push({ hx, knee, foot, sgn });
  }
  if (!P.noLegs) {
    for (const L of legs) {
      g.strokeStyle = isDress ? c.feet : c.pants; g.lineWidth = legW; g.lineCap = 'round'; g.lineJoin = 'round';
      if (isDress) g.lineWidth = legW * .55;
      g.beginPath(); g.moveTo(L.hx, hipY); g.lineTo(L.knee.x, L.knee.y); g.lineTo(L.foot.x, L.foot.y); g.stroke();
      g.fillStyle = P.barefoot ? c.skin : (isDress ? c.feet : '#141414');
      g.beginPath(); g.ellipse(L.foot.x + (view === 'side' ? dir * .1 * h : 0), L.foot.y + .02 * h, view === 'side' ? .2 * h : .13 * h, .07 * h, 0, 0, TAU); g.fill();
    }
  }
  // ---- arka saç
  if (view !== 'back') arkaSac(g, P, headC, h, c, view, dir);
  // ---- gövde
  govde(g, P, cx, shY, hipY, h, c, view, dir);
  // ---- kollar
  const arms = kollar(P, cx, shY, headC, h, view, dir);
  const backArm = view === 'side' ? arms[dir > 0 ? 0 : 1] : null;
  for (const A of arms) if (A === backArm || A.behind) kolCiz(g, A, c, h, P);
  // ---- boyun & kafa
  g.fillStyle = c.skinD;
  g.fillRect(headC.x - .12 * h, headC.y + .3 * h, .24 * h, shY - headC.y - .25 * h);
  if (P.kim === 'ECE' && view !== 'back') kulaklik(g, headC, shY, h, view, dir);
  kafa(g, P, headC, h, c, view, dir);
  if (P.kim === 'NEVIN') sal(g, cx, shY, h, c, view);
  if (P.box) koliler(g, cx, shY, h, P);
  for (const A of arms) if (A !== backArm && !A.behind) kolCiz(g, A, c, h, P);
  g.restore();
  return { headC, shY, hipY, arms };
}

function arkaSac(g, P, hc, h, c, view, dir) {
  if (P.kim !== 'ECE') return;
  g.fillStyle = c.hair;
  g.beginPath();
  const off = view === 'side' ? -dir * .12 * h : 0;
  const x = hc.x + off, y = hc.y;
  g.moveTo(x - .44 * h, y - .1 * h);
  g.quadraticCurveTo(x - .58 * h, y + .45 * h, x - .5 * h, y + .82 * h);
  for (let i = 0; i <= 6; i++) { const k = i / 6; g.quadraticCurveTo(x - .5 * h + k * h - .08 * h, y + .95 * h, x - .5 * h + k * h, y + .82 * h + Math.sin(i * 2) * .04 * h); }
  g.quadraticCurveTo(x + .58 * h, y + .45 * h, x + .44 * h, y - .1 * h);
  g.closePath(); g.fill();
}

function govde(g, P, cx, shY, hipY, h, c, view, dir) {
  const k = P.kim, sw = view === 'side' ? .32 : .5, hw = view === 'side' ? .3 : .4;
  g.lineJoin = 'round';
  if (k === 'NEVIN') {
    g.fillStyle = c.shirt;
    g.beginPath(); g.moveTo(cx - sw * h, shY); g.lineTo(cx + sw * h, shY);
    g.lineTo(cx + .62 * h, P.y - .35 * h); g.quadraticCurveTo(cx, P.y - .25 * h, cx - .62 * h, P.y - .35 * h); g.closePath(); g.fill();
    // çiçek deseni
    const r = rng(7); g.fillStyle = 'rgba(200,190,230,.35)';
    for (let i = 0; i < 26; i++) { const px = cx + (r() - .5) * 1.1 * h, py = shY + .3 * h + r() * (P.y - shY - .8 * h); g.beginPath(); g.arc(px, py, .035 * h, 0, TAU); g.fill(); }
    return;
  }
  // gömlek
  g.fillStyle = c.shirt;
  g.beginPath(); g.moveTo(cx - sw * h, shY); g.lineTo(cx + sw * h, shY); g.lineTo(cx + hw * h, hipY + .05 * h); g.lineTo(cx - hw * h, hipY + .05 * h); g.closePath(); g.fill();
  if (k === 'ECE') {
    // bordo hırka (oversize, kalçanın altına iner)
    g.fillStyle = c.top;
    if (view === 'back') {
      g.beginPath(); g.moveTo(cx - (sw + .06) * h, shY); g.lineTo(cx + (sw + .06) * h, shY); g.lineTo(cx + (hw + .14) * h, hipY + .5 * h); g.lineTo(cx - (hw + .14) * h, hipY + .5 * h); g.closePath(); g.fill();
      return;
    }
    for (const s of [-1, 1]) {
      if (view === 'side' && s !== dir) continue;
      g.beginPath();
      g.moveTo(cx + s * (view === 'side' ? -.3 : .08) * h, shY + .05 * h);
      g.lineTo(cx + s * (sw + .06) * h, shY);
      g.lineTo(cx + s * (hw + .14) * h, hipY + .5 * h);
      g.lineTo(cx + s * (view === 'side' ? -.3 : .16) * h, hipY + .5 * h);
      g.closePath(); g.fill();
    }
    g.strokeStyle = c.topD; g.lineWidth = .025 * h;
    for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(cx - (sw + .1) * h, shY + i * .3 * h); g.lineTo(cx - .1 * h, shY + i * .3 * h + .02 * h); g.stroke(); g.beginPath(); g.moveTo(cx + .1 * h, shY + i * .3 * h); g.lineTo(cx + (sw + .1) * h, shY + i * .3 * h + .02 * h); g.stroke(); }
  }
  if (k === 'REMZI') {
    g.fillStyle = c.top;
    for (const s of [-1, 1]) {
      g.beginPath(); g.moveTo(cx + s * .04 * h, shY + .45 * h); g.lineTo(cx + s * .3 * h, shY); g.lineTo(cx + s * sw * h, shY + .1 * h);
      g.lineTo(cx + s * hw * h, hipY + .1 * h); g.lineTo(cx + s * .02 * h, hipY + .15 * h); g.closePath(); g.fill();
    }
    g.fillStyle = '#c9a44a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(cx + .07 * h, shY + .6 * h + i * .25 * h, .03 * h, 0, TAU); g.fill(); }
  }
}

function kulaklik(g, hc, shY, h, view, dir) {
  g.strokeStyle = '#111'; g.lineWidth = .07 * h;
  g.beginPath(); g.arc(hc.x, shY - .05 * h, .36 * h, .15 * Math.PI, .85 * Math.PI); g.stroke();
  g.fillStyle = '#1a1a1a';
  for (const s of [-1, 1]) { if (view === 'side' && s === -dir) continue; g.beginPath(); g.ellipse(hc.x + s * .3 * h, shY + .12 * h, .13 * h, .16 * h, s * .4, 0, TAU); g.fill(); g.fillStyle = '#333'; g.beginPath(); g.ellipse(hc.x + s * .3 * h, shY + .12 * h, .07 * h, .09 * h, s * .4, 0, TAU); g.fill(); g.fillStyle = '#1a1a1a'; }
}

function sal(g, cx, shY, h, c, view) {
  g.fillStyle = c.top;
  g.beginPath(); g.moveTo(cx - .62 * h, shY + .05 * h); g.quadraticCurveTo(cx, shY - .2 * h, cx + .62 * h, shY + .05 * h);
  g.lineTo(cx + .5 * h, shY + .9 * h); g.lineTo(cx, shY + 1.25 * h); g.lineTo(cx - .5 * h, shY + .9 * h); g.closePath(); g.fill();
  g.strokeStyle = c.topD; g.lineWidth = .02 * h;
  for (let i = 0; i < 14; i++) { const k = i / 13; const x = lerp(cx - .5 * h, cx + .5 * h, k), y = shY + .9 * h + (1 - Math.abs(k - .5) * 2) * .35 * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + .1 * h); g.stroke(); }
}

function koliler(g, cx, shY, h, P) {
  const by = shY + .55 * h + (P.boxDrop || 0) * h;
  for (let i = 0; i < 2; i++) {
    const y = by + i * .62 * h, w = 1.25 * h - i * .08 * h;
    g.fillStyle = i ? '#a07a4f' : '#b48a5a'; g.fillRect(cx - w / 2, y, w, .62 * h);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(cx - w / 2, y + .5 * h, w, .12 * h);
    g.fillStyle = '#d8c79a'; g.fillRect(cx - .08 * h, y, .16 * h, .62 * h);
  }
}

function ik(sx, sy, tx, ty, l1, l2, bend) {
  const dx = tx - sx, dy = ty - sy; let d = Math.hypot(dx, dy); d = Math.min(d, (l1 + l2) * .999);
  const a = Math.atan2(dy, dx), cosA = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const e = a + bend * Math.acos(cosA);
  return { ex: sx + Math.cos(e) * l1, ey: sy + Math.sin(e) * l1, hx: sx + Math.cos(a) * d, hy: sy + Math.sin(a) * d };
}

function kollar(P, cx, shY, hc, h, view, dir) {
  const res = [], sw = view === 'side' ? .05 : .48;
  for (const side of ['l', 'r']) {
    const sgn = side === 'l' ? -1 : 1;
    const sx = cx + sgn * sw * h, sy = shY + .1 * h;
    let tgt = P.arms && P.arms[side];
    let tx, ty, bend = sgn > 0 ? -1 : 1;
    if (tgt) { tx = hc.x + tgt.x * h; ty = hc.y + tgt.y * h; if (tgt.bend) bend = tgt.bend; }
    else {
      let sway = 0;
      if (P.walk != null) sway = Math.sin(P.walk + (sgn > 0 ? 0 : Math.PI)) * .35;
      if (view === 'side') { tx = sx + Math.sin(sway) * 1.3 * h * dir; ty = sy + Math.cos(sway) * 1.35 * h; bend = dir > 0 ? 1 : -1; }
      else { tx = sx + sgn * .12 * h + Math.sin(sway) * .1 * h; ty = sy + 1.38 * h; }
    }
    const j = ik(sx, sy, tx, ty, .75 * h, .72 * h, bend);
    res.push({ side, sx, sy, ...j, phone: P.phone === side, beads: P.beads === side, behind: tgt && tgt.behind });
  }
  return res;
}

function kolCiz(g, A, c, h, P) {
  g.strokeStyle = P.kim === 'NEVIN' ? c.top : (P.kim === 'REMZI' ? c.shirt : c.top);
  g.lineWidth = .21 * h; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(A.sx, A.sy); g.lineTo(A.ex, A.ey); g.lineTo(A.hx, A.hy); g.stroke();
  g.fillStyle = c.skin; g.beginPath(); g.arc(A.hx, A.hy, .1 * h, 0, TAU); g.fill();
  if (A.phone) {
    g.save(); g.translate(A.hx, A.hy - .12 * h); g.rotate(P.phoneRot || 0);
    g.fillStyle = '#0d0d0f'; rr(g, -.13 * h, -.26 * h, .26 * h, .5 * h, .04 * h); g.fill();
    if (P.phoneGlow) { g.fillStyle = 'rgba(170,210,255,.85)'; rr(g, -.11 * h, -.23 * h, .22 * h, .44 * h, .03 * h); g.fill(); }
    g.restore();
    g.fillStyle = c.skin; g.beginPath(); g.arc(A.hx, A.hy, .085 * h, 0, TAU); g.fill();
  }
  if (A.beads) {
    g.fillStyle = '#d68a1c';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI + (P.t || 0) * 2 % 1 * .2; g.beginPath(); g.arc(A.hx + Math.cos(a + Math.PI / 2) * .08 * h * Math.sin(i), A.hy + .05 * h + i * .028 * h, .025 * h, 0, TAU); g.fill(); }
  }
}

function rr(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

function kafa(g, P, hc, h, c, view, dir) {
  const { x, y } = hc;
  g.save();
  if (P.tilt) { g.translate(x, y + .4 * h); g.rotate(P.tilt); g.translate(-x, -(y + .4 * h)); }
  // yüz
  const grd = g.createRadialGradient(x - .12 * h, y - .15 * h, .05 * h, x, y, .6 * h);
  grd.addColorStop(0, c.skin); grd.addColorStop(1, c.skinD);
  g.fillStyle = grd;
  g.beginPath();
  if (view === 'side') {
    g.ellipse(x, y, .36 * h, .48 * h, 0, 0, TAU); g.fill();
    // burun & çene
    g.beginPath(); g.moveTo(x + dir * .3 * h, y - .05 * h); g.lineTo(x + dir * .44 * h, y + .12 * h); g.lineTo(x + dir * .33 * h, y + .16 * h); g.fill();
  } else {
    g.moveTo(x - .38 * h, y - .05 * h);
    g.bezierCurveTo(x - .4 * h, y - .62 * h, x + .4 * h, y - .62 * h, x + .38 * h, y - .05 * h);
    g.bezierCurveTo(x + .36 * h, y + .35 * h, x + .16 * h, y + .5 * h, x, y + .5 * h);
    g.bezierCurveTo(x - .16 * h, y + .5 * h, x - .36 * h, y + .35 * h, x - .38 * h, y - .05 * h);
    g.fill();
  }
  if (view === 'back') { onSac(g, P, hc, h, c, view, dir); g.restore(); return; }
  // kulak
  g.fillStyle = c.skinD;
  if (view === 'side') { g.beginPath(); g.ellipse(x - dir * .05 * h, y + .02 * h, .07 * h, .11 * h, 0, 0, TAU); g.fill(); }
  else for (const s of [-1, 1]) { g.beginPath(); g.ellipse(x + s * .39 * h, y + .03 * h, .06 * h, .1 * h, 0, 0, TAU); g.fill(); }
  if (P.kim === 'NEVIN') { g.fillStyle = '#f4f1ea'; for (const s of view === 'side' ? [-dir] : [-1, 1]) { g.beginPath(); g.arc(x + s * (view === 'side' ? .05 : .39) * h, y + .14 * h, .035 * h, 0, TAU); g.fill(); } }
  // gözler
  const look = P.look || { x: 0, y: 0 };
  const eyes = view === 'side' ? [x + dir * .2 * h] : [x - .15 * h, x + .15 * h];
  const eo = P.eye == null ? 1 : P.eye;
  const bl = P.taklit ? 0 : (P.bl || 0);
  for (const ex of eyes) {
    const ey = y + .02 * h, rx = (view === 'side' ? .05 : .078) * h, ry = .047 * h * eo;
    g.fillStyle = P.taklit ? '#cfcac0' : '#f5efe6';
    g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, TAU); g.clip();
    const ir = (P.taklit ? .05 : .038) * h, px = ex + look.x * .03 * h + (view === 'side' ? dir * .02 * h : 0), py = ey + look.y * .02 * h;
    g.fillStyle = P.taklit ? '#050505' : c.iris; g.beginPath(); g.arc(px, py, ir, 0, TAU); g.fill();
    g.fillStyle = '#0a0a0a'; g.beginPath(); g.arc(px, py, ir * (P.pupil || .5), 0, TAU); g.fill();
    if (!P.taklit) { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(px - ir * .35, py - ir * .35, ir * .28, 0, TAU); g.fill(); }
    // göz kapağı
    if (bl > 0) { g.fillStyle = c.skin; g.fillRect(ex - rx, ey - ry, rx * 2, ry * 2 * bl); }
    g.restore();
    g.strokeStyle = '#1b120d'; g.lineWidth = .018 * h;
    g.beginPath(); g.ellipse(ex, ey - ry * 2 * bl + ry * bl, rx * 1.05, Math.max(ry * (1 - bl), .002 * h), 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
    if (P.tear) { g.fillStyle = 'rgba(200,230,255,.75)'; g.beginPath(); g.ellipse(ex - .02 * h, ey + .09 * h + P.tear * .1 * h, .014 * h, .022 * h, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(200,230,255,.35)'; g.beginPath(); g.ellipse(ex, ey + ry + .005 * h, rx * .8, .01 * h, 0, 0, TAU); g.fill(); }
    // kaş
    const side = view === 'side' ? 1 : (ex < x ? -1 : 1);
    const brow = P.brow || 0;
    g.strokeStyle = P.kim === 'ECE' ? '#3a2014' : '#cfcac2'; g.lineWidth = .028 * h; g.lineCap = 'round';
    g.beginPath(); g.moveTo(ex - side * .08 * h, ey - .085 * h - brow * .035 * h - (eo - 1) * .03 * h); g.quadraticCurveTo(ex, ey - .11 * h - (eo - 1) * .03 * h, ex + side * .08 * h, ey - .085 * h + brow * .01 * h); g.stroke();
  }
  if (P.kim === 'NEVIN' && view !== 'side') { g.strokeStyle = 'rgba(80,60,40,.8)'; g.lineWidth = .012 * h; for (const ex of eyes) { g.beginPath(); g.arc(ex, y + .02 * h, .1 * h, 0, TAU); g.stroke(); } g.beginPath(); g.moveTo(x - .05 * h, y + .02 * h); g.lineTo(x + .05 * h, y + .02 * h); g.stroke(); }
  // kırışıklık
  if (P.kim !== 'ECE') { g.strokeStyle = 'rgba(90,50,30,.35)'; g.lineWidth = .01 * h; for (const s of view === 'side' ? [dir] : [-1, 1]) { g.beginPath(); g.moveTo(x + s * .08 * h, y + .17 * h); g.quadraticCurveTo(x + s * .17 * h, y + .27 * h, x + s * .14 * h, y + .34 * h); g.stroke(); } }
  // burun
  if (view !== 'side') { g.strokeStyle = 'rgba(110,60,40,.55)'; g.lineWidth = .016 * h; g.beginPath(); g.moveTo(x + .01 * h, y + .06 * h); g.quadraticCurveTo(x + .04 * h, y + .15 * h, x - .02 * h, y + .17 * h); g.stroke(); }
  // ağız
  const m = clamp(P.m || 0), wide = P.wide || 0, sm = P.smile || 0;
  const mx = view === 'side' ? x + dir * .27 * h : x, my = y + .28 * h;
  const mw = (view === 'side' ? .05 : .1) * h * (1 + wide * 1.6) * (1 - m * .15);
  if (m > .06) {
    g.fillStyle = '#3a1210';
    g.beginPath(); g.ellipse(mx, my + m * .02 * h, mw, .015 * h + m * .065 * h, 0, 0, TAU); g.fill();
    g.fillStyle = '#efe7dc'; g.fillRect(mx - mw * .6, my - .01 * h, mw * 1.2, .016 * h);
  }
  g.strokeStyle = P.kim === 'ECE' ? '#9a4a44' : '#7a4a3a'; g.lineWidth = .02 * h;
  g.beginPath(); g.moveTo(mx - mw, my - sm * .03 * h - wide * .06 * h); g.quadraticCurveTo(mx, my + (sm + wide) * .04 * h - (P.sad || 0) * .03 * h, mx + mw, my - sm * .03 * h - wide * .06 * h); g.stroke();
  if (wide > .3) { g.fillStyle = '#efe7dc'; g.beginPath(); g.moveTo(mx - mw * .85, my - wide * .045 * h); g.quadraticCurveTo(mx, my + wide * .05 * h, mx + mw * .85, my - wide * .045 * h); g.quadraticCurveTo(mx, my + wide * .015 * h, mx - mw * .85, my - wide * .045 * h); g.fill(); }
  if (P.kim === 'REMZI') { // bıyık
    g.fillStyle = c.hair; g.beginPath(); g.moveTo(mx - .17 * h, my + .02 * h); g.quadraticCurveTo(mx - .1 * h, my - .12 * h, mx, my - .06 * h); g.quadraticCurveTo(mx + .1 * h, my - .12 * h, mx + .17 * h, my + .02 * h); g.quadraticCurveTo(mx, my - .02 * h, mx - .17 * h, my + .02 * h); g.fill();
  }
  onSac(g, P, hc, h, c, view, dir);
  g.restore();
}

function onSac(g, P, hc, h, c, view, dir) {
  const { x, y } = hc;
  if (P.kim === 'ECE') {
    g.fillStyle = c.hair;
    if (view === 'back') {
      g.beginPath(); g.ellipse(x, y - .05 * h, .45 * h, .5 * h, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(x - .46 * h, y); g.quadraticCurveTo(x - .55 * h, y + .6 * h, x - .45 * h, y + .9 * h); g.lineTo(x + .45 * h, y + .9 * h); g.quadraticCurveTo(x + .55 * h, y + .6 * h, x + .46 * h, y); g.fill();
      g.strokeStyle = c.hairL; g.lineWidth = .02 * h; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(x + i * .1 * h, y - .45 * h); g.quadraticCurveTo(x + i * .14 * h, y + .2 * h, x + i * .12 * h, y + .85 * h); g.stroke(); }
      return;
    }
    g.beginPath();
    if (view === 'side') {
      g.moveTo(x + dir * .3 * h, y - .2 * h); g.quadraticCurveTo(x + dir * .1 * h, y - .62 * h, x - dir * .35 * h, y - .4 * h);
      g.quadraticCurveTo(x - dir * .5 * h, y + .1 * h, x - dir * .3 * h, y + .3 * h); g.lineTo(x - dir * .05 * h, y - .1 * h); g.quadraticCurveTo(x + dir * .1 * h, y - .3 * h, x + dir * .3 * h, y - .2 * h);
    } else {
      g.moveTo(x - .44 * h, y + .15 * h); g.quadraticCurveTo(x - .5 * h, y - .6 * h, x, y - .58 * h); g.quadraticCurveTo(x + .5 * h, y - .6 * h, x + .44 * h, y + .15 * h);
      g.quadraticCurveTo(x + .38 * h, y - .2 * h, x + .12 * h, y - .3 * h); g.quadraticCurveTo(x - .05 * h, y - .18 * h, x - .25 * h, y - .27 * h); g.quadraticCurveTo(x - .4 * h, y - .2 * h, x - .44 * h, y + .15 * h);
    }
    g.fill();
    g.strokeStyle = c.hairL; g.lineWidth = .018 * h; g.beginPath(); g.moveTo(x - .2 * h, y - .5 * h); g.quadraticCurveTo(x + .1 * h, y - .45 * h, x + .3 * h, y - .3 * h); g.stroke();
  } else if (P.kim === 'NEVIN') {
    g.fillStyle = c.hair;
    g.beginPath(); g.ellipse(x, y - .3 * h, .41 * h, .28 * h, 0, Math.PI, TAU); g.fill();
    g.beginPath(); g.arc(view === 'side' ? x - dir * .25 * h : x, y - .55 * h, .17 * h, 0, TAU); g.fill();
    g.strokeStyle = '#cbc6bd'; g.lineWidth = .012 * h; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(x + i * .1 * h, y - .2 * h); g.quadraticCurveTo(x + i * .06 * h, y - .45 * h, x, y - .55 * h); g.stroke(); }
  } else if (P.kim === 'REMZI') {
    g.fillStyle = c.hair; for (const s of view === 'side' ? [-dir] : [-1, 1]) { g.beginPath(); g.ellipse(x + s * .36 * h, y - .08 * h, .06 * h, .14 * h, 0, 0, TAU); g.fill(); }
    g.fillStyle = '#5f6164';
    g.beginPath(); g.ellipse(x, y - .3 * h, .45 * h, .22 * h, 0, Math.PI, TAU); g.fill();
    g.beginPath(); g.ellipse(x + (view === 'side' ? dir * .25 * h : 0), y - .28 * h, view === 'side' ? .3 * h : .5 * h, .07 * h, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - .45 * h, y - .3 * h, .9 * h, .03 * h);
  }
}

// ---------- telefon arayüzü ----------
function cicek(g, x, y, r) { g.fillStyle = '#f39ac2'; for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55, r * .45, 0, TAU); g.fill(); } g.fillStyle = '#ffe17a'; g.beginPath(); g.arc(x, y, r * .3, 0, TAU); g.fill(); }
function tik(g, x, y, s, n, blue) { g.strokeStyle = blue ? '#53bdeb' : '#8696a0'; g.lineWidth = s * .14; g.lineCap = 'round'; for (let i = 0; i < n; i++) { const ox = i * s * .38; g.beginPath(); g.moveTo(x + ox, y); g.lineTo(x + ox + s * .25, y + s * .25); g.lineTo(x + ox + s * .7, y - s * .3); g.stroke(); } }
function dalga(g, x, y, w, hh, prog, seed, col, col2) { const r = rng(seed); const n = 34; for (let i = 0; i < n; i++) { const v = .2 + r() * .8; g.fillStyle = i / n < prog ? col2 : col; g.fillRect(x + i * w / n, y - v * hh / 2, w / n * .55, v * hh); } }

// S: {clock, status, msgs:[{type:'voice'|'text', out, dur, text, prog, ticks, blue, seed}], rec: {t:sec} }
function telefonEkrani(g, x, y, w, S) {
  const hh = w * 2.05, u = w / 100;
  g.save(); g.translate(x, y);
  g.fillStyle = '#050506'; rr(g, -4 * u, -4 * u, w + 8 * u, hh + 8 * u, 9 * u); g.fill();
  g.save(); rr(g, 0, 0, w, hh, 7 * u); g.clip();
  g.fillStyle = '#0b141a'; g.fillRect(0, 0, w, hh);
  // desen
  g.strokeStyle = 'rgba(255,255,255,.025)'; g.lineWidth = u * .4; for (let i = 0; i < 40; i++) { const r = rng(i + 3); g.beginPath(); g.arc(r() * w, 20 * u + r() * hh, 2 * u + r() * 3 * u, 0, TAU); g.stroke(); }
  // durum çubuğu
  g.fillStyle = '#e9edef'; g.font = `600 ${4 * u}px DejaVu Sans`; g.textAlign = 'left'; g.fillText(S.clock || '03:16', 6 * u, 6 * u);
  g.textAlign = 'right'; g.fillText('▮▮▮ 34%', w - 6 * u, 6 * u);
  // başlık
  g.fillStyle = '#1f2c34'; g.fillRect(0, 9 * u, w, 15 * u);
  g.fillStyle = '#e9edef'; g.font = `${6 * u}px DejaVu Sans`; g.textAlign = 'left'; g.fillText('‹', 3 * u, 19 * u);
  g.save(); g.beginPath(); g.arc(16 * u, 16.5 * u, 5.2 * u, 0, TAU); g.clip(); g.fillStyle = '#c9a36a'; g.fillRect(10 * u, 11 * u, 12 * u, 12 * u);
  figur(g, { x: 16 * u, y: 16.5 * u + 4.57 * 6.5 * u + .8 * u, s: 6.5 * u, kim: 'NEVIN', smile: .6, noLegs: true }); g.restore();
  g.fillStyle = '#e9edef'; g.font = `600 ${5 * u}px DejaVu Sans`; g.fillText('Ninem', 24 * u, 15.5 * u);
  cicek(g, 24 * u + g.measureText('Ninem').width + 3.5 * u, 13.8 * u, 2 * u);
  if (S.status) { g.fillStyle = S.statusCol || '#8696a0'; g.font = `${3.4 * u}px DejaVu Sans`; g.fillText(S.status, 24 * u, 20.5 * u); }
  // mesajlar (alttan yukarı)
  let by = hh - 18 * u;
  const msgs = (S.msgs || []).slice().reverse();
  for (const M of msgs) {
    let lines = null;
    if (M.type !== 'voice') {
      g.font = `${M.big ? 700 : 400} ${(M.big ? 5.4 : 3.8) * u}px DejaVu Sans`;
      lines = []; let cur = '';
      for (const wd of M.text.split(' ')) { const n = cur ? cur + ' ' + wd : wd; if (g.measureText(n).width > 58 * u && cur) { lines.push(cur); cur = wd; } else cur = n; }
      lines.push(cur); M._lines = lines;
    }
    const tw = lines ? Math.max(...lines.map(l => g.measureText(l).width)) : 0;
    const bw = M.type === 'voice' ? 66 * u : Math.max(22 * u, tw + 7 * u + (M.out ? 10 * u : 8 * u));
    const lh = (M.big ? 6.6 : 5) * u;
    const bh = M.type === 'voice' ? 15 * u : lines.length * lh + 6.5 * u;
    by -= bh + 3 * u;
    const bx = M.out ? w - bw - 4 * u : 4 * u;
    g.globalAlpha = M.alpha == null ? 1 : M.alpha;
    g.fillStyle = M.out ? '#005c4b' : '#202c33'; rr(g, bx, by, bw, bh, 2.5 * u); g.fill();
    if (M.type === 'voice') {
      g.fillStyle = '#e9edef'; g.beginPath();
      if ((M.prog || 0) > 0 && M.prog < 1) { g.fillRect(bx + 5 * u, by + 4.5 * u, 1.6 * u, 5 * u); g.fillRect(bx + 8 * u, by + 4.5 * u, 1.6 * u, 5 * u); }
      else { g.moveTo(bx + 5 * u, by + 4 * u); g.lineTo(bx + 10 * u, by + 7 * u); g.lineTo(bx + 5 * u, by + 10 * u); g.fill(); }
      dalga(g, bx + 13 * u, by + 7 * u, 40 * u, 6 * u, M.prog || 0, M.seed || 1, 'rgba(233,237,239,.45)', '#53bdeb');
      g.fillStyle = 'rgba(233,237,239,.7)'; g.font = `${3 * u}px DejaVu Sans`; g.textAlign = 'left'; g.fillText(M.dur, bx + 13 * u, by + 13.4 * u);
      if (!M.out) { g.save(); g.beginPath(); g.arc(bx + bw - 7 * u, by + 7.5 * u, 4.5 * u, 0, TAU); g.clip(); g.fillStyle = '#c9a36a'; g.fillRect(bx + bw - 12 * u, by + 2 * u, 10 * u, 11 * u); figur(g, { x: bx + bw - 7 * u, y: by + 7.5 * u + 4.57 * 5.6 * u + .7 * u, s: 5.6 * u, kim: 'NEVIN', smile: .5, noLegs: true }); g.restore(); }
    } else {
      g.fillStyle = '#e9edef'; g.font = `${M.big ? 700 : 400} ${(M.big ? 5.4 : 3.8) * u}px DejaVu Sans`; g.textAlign = 'left';
      M._lines.forEach((l, i) => g.fillText(l, bx + 3.5 * u, by + 5.2 * u + i * lh + (M.big ? 1.2 * u : 0)));
    }
    g.fillStyle = 'rgba(233,237,239,.6)'; g.font = `${2.6 * u}px DejaVu Sans`; g.textAlign = 'right';
    g.fillText(M.time || '', bx + bw - (M.out ? 9 * u : 2.5 * u), by + bh - 1.6 * u);
    if (M.out) tik(g, bx + bw - 8 * u, by + bh - 3 * u, 3.2 * u, M.ticks || 1, M.blue);
    g.globalAlpha = 1;
  }
  // alt çubuk
  g.fillStyle = '#1f2c34'; g.fillRect(0, hh - 13 * u, w, 13 * u);
  if (S.rec != null) {
    g.fillStyle = '#f15c6d'; g.beginPath(); g.arc(9 * u, hh - 6.5 * u, 2 * u * (0.8 + .2 * Math.sin(S.rec * 8)), 0, TAU); g.fill();
    g.fillStyle = '#e9edef'; g.font = `${3.8 * u}px DejaVu Sans`; g.textAlign = 'left'; g.fillText('0:0' + Math.floor(S.rec), 14 * u, hh - 5.2 * u);
    dalga(g, 28 * u, hh - 6.5 * u, 50 * u, 5 * u * (0.4 + S.lev), 1, Math.floor(S.rec * 6), '#e9edef', '#e9edef');
  } else { g.fillStyle = '#2a3942'; rr(g, 4 * u, hh - 10.5 * u, w - 22 * u, 8 * u, 4 * u); g.fill(); g.fillStyle = S.input ? '#e9edef' : '#8696a0'; g.font = `${3.4 * u}px DejaVu Sans`; g.textAlign = 'left'; g.fillText(S.input || 'Mesaj', 9 * u, hh - 5.5 * u);
    if (S.input != null && S.caret) { g.fillStyle = '#00a884'; g.fillRect(9 * u + g.measureText(S.input).width + .5 * u, hh - 9 * u, .5 * u, 4.5 * u); } }
  g.fillStyle = '#00a884'; g.beginPath(); g.arc(w - 9 * u, hh - 6.5 * u, 5 * u, 0, TAU); g.fill();
  g.fillStyle = '#fff'; rr(g, w - 10.2 * u, hh - 10 * u, 2.4 * u, 4.5 * u, 1.2 * u); g.fill(); g.fillRect(w - 9.3 * u, hh - 5 * u, .6 * u, 1.6 * u);
  g.restore();
  g.restore();
  return hh;
}

// ---------- efektler ----------
let GRAIN = [];
function grainHazirla() {
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = 540; c.height = 960; const x = c.getContext('2d');
    const d = x.createImageData(540, 960), r = rng(k * 99 + 1);
    for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); GRAIN.push(c);
  }
}
function sonIslem(g, t, o = {}) {
  // vinyet
  const v = g.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .72);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${o.vig == null ? .75 : o.vig})`);
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  // grain
  g.save(); g.globalAlpha = o.grain || .07; g.globalCompositeOperation = 'overlay';
  g.drawImage(GRAIN[Math.floor(t * FPS) % GRAIN.length], 0, 0, W, H); g.restore();
  if (o.flicker) { g.fillStyle = `rgba(0,0,0,${(Math.sin(t * 37) * .5 + .5) * o.flicker})`; g.fillRect(0, 0, W, H); }
}
function karanlik(g, holes, alpha = .93) {
  const c = karanlik.c || (karanlik.c = Object.assign(document.createElement('canvas'), { width: W, height: H }));
  const x = c.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);
  x.fillStyle = `rgba(2,4,10,${alpha})`; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'destination-out';
  for (const hl of holes) {
    const gr = x.createRadialGradient(hl.x, hl.y, 0, hl.x, hl.y, hl.r);
    gr.addColorStop(0, `rgba(0,0,0,${hl.a || 1})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.save(); x.translate(hl.x, hl.y); x.scale(hl.sx || 1, hl.sy || 1); x.translate(-hl.x, -hl.y);
    x.beginPath(); x.arc(hl.x, hl.y, hl.r, 0, TAU); x.fill(); x.restore();
  }
  g.drawImage(c, 0, 0);
}
function yazi(g, txt, x, y, size, o = {}) {
  g.save(); g.font = `${o.weight || 700} ${size}px ${o.font || 'DejaVu Sans'}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (o.spacing) g.letterSpacing = o.spacing + 'px';
  g.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.stroke !== false) { g.lineWidth = size * .16; g.strokeStyle = 'rgba(0,0,0,.85)'; g.lineJoin = 'round'; g.strokeText(txt, x, y); }
  g.fillStyle = o.color || '#fff'; g.fillText(txt, x, y); g.restore();
}
function altyazi(g, t) {
  if (window.NOSUB) return;
  const r = konusuyor(t); if (!r || r.noSub) return;
  const words = r.metin.split(' '); const lines = []; let cur = '';
  g.font = '700 50px DejaVu Sans';
  for (const w of words) { const n = cur ? cur + ' ' + w : w; if (g.measureText(n).width > 900) { lines.push(cur); cur = w; } else cur = n; }
  lines.push(cur);
  const a = ss(r.t - .05, r.t + .12, t) * (1 - ss(r.t + r.sure + .05, r.t + r.sure + .15, t));
  lines.forEach((l, i) => yazi(g, l, W / 2, (window.SUBY || 1380) + i * 66 - (lines.length - 1) * 33, 50, { alpha: a, color: r.kim.startsWith('NEVIN') ? '#fff3c4' : '#ffffff' }));
}

// balıkgözü
let FISH = null;
function balikgozu(src, size) {
  if (!FISH || FISH.size !== size) {
    const map = new Int32Array(size * size); const c = size / 2;
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const dx = (i - c) / c, dy = (j - c) / c, r = Math.hypot(dx, dy);
      if (r > 1) { map[j * size + i] = -1; continue; }
      const sr = r * (.5 + .5 * r * r), k = r > 0 ? sr / r : 0;
      const sx = Math.round(c + dx * k * c), sy = Math.round(c + dy * k * c);
      map[j * size + i] = (clamp(sy, 0, size - 1) * size + clamp(sx, 0, size - 1));
    }
    const out = document.createElement('canvas'); out.width = out.height = size;
    FISH = { size, map, out, ctx: out.getContext('2d'), dst: out.getContext('2d').createImageData(size, size) };
  }
  const sd = src.getContext('2d').getImageData(0, 0, size, size).data, dd = FISH.dst.data, map = FISH.map;
  for (let p = 0; p < map.length; p++) {
    const m = map[p], o = p * 4;
    if (m < 0) { dd[o + 3] = 0; continue; }
    const s = m * 4; dd[o] = sd[s]; dd[o + 1] = sd[s + 1]; dd[o + 2] = sd[s + 2]; dd[o + 3] = 255;
  }
  FISH.ctx.putImageData(FISH.dst, 0, 0);
  return FISH.out;
}
