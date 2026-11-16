// SON GÖRÜLME · Bölüm 1 "Çevrimiçi" · çekim listesi
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const g = cv.getContext('2d');
grainHazirla();
const OFF = Object.assign(document.createElement('canvas'), { width: 900, height: 900 });
const og = OFF.getContext('2d', { willReadFrequently: true });

// ---------- yardımcılar ----------
function kamera(t, a, b, o = {}) {
  const k = clamp((t - a) / (b - a));
  const z = lerp(o.z0 || 1, o.z1 || o.z0 || 1, easeIO(k));
  const sh = o.shake || 4;
  g.translate(W / 2 + wob(t * 1.3, a) * sh + (o.x || 0), H / 2 + wob(t * 1.1, a + 5) * sh + lerp(o.y0 || 0, o.y1 || o.y0 || 0, easeIO(k)));
  g.scale(z, z); g.translate(-W / 2, -H / 2);
}
function renk(col, mode = 'multiply', a = 1) { g.save(); g.globalCompositeOperation = mode; g.globalAlpha = a; g.fillStyle = col; g.fillRect(-W, -H, W * 3, H * 3); g.restore(); }
function isik(x, y, r, col, a = 1, mode = 'screen') { g.save(); g.globalCompositeOperation = mode; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = a; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
const ECEb = t => blink(t, .3), REMb = t => blink(t, 1.1);

// ---------- dekorlar ----------
function duvar(c1, c2) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400); }
function koridorPeephole(x, s, t) {
  // kapı deliğinden görülen sahanlık (900x900)
  const gr = x.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, '#2b2a22'); gr.addColorStop(1, '#141310');
  x.fillStyle = gr; x.fillRect(0, 0, 900, 900);
  x.fillStyle = '#3b382c'; x.fillRect(0, 600, 900, 300);
  x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 3; for (let i = -10; i < 20; i++) { x.beginPath(); x.moveTo(450 + i * 30, 600); x.lineTo(450 + i * 110, 900); x.stroke(); }
  x.fillStyle = '#4a4535'; x.fillRect(0, 590, 900, 14);
  // merdiven korkuluğu
  x.strokeStyle = '#1b1a14'; x.lineWidth = 10; x.beginPath(); x.moveTo(-50, 420); x.lineTo(260, 560); x.stroke();
  x.lineWidth = 5; for (let i = 0; i < 9; i++) { const px = -30 + i * 36, py = 430 + i * 16; x.beginPath(); x.moveTo(px, py); x.lineTo(px, py + 190); x.stroke(); }
  // kapı (karşı daire)
  x.fillStyle = '#2a1d14'; x.fillRect(640, 220, 200, 390); x.strokeStyle = '#1a120c'; x.lineWidth = 6; x.strokeRect(660, 240, 160, 160); x.strokeRect(660, 420, 160, 170);
  // tavan lambası
  const fl = t != null ? .85 + .15 * Math.sin(t * 50) * (Math.sin(t * 3.1) > .7 ? 1 : 0) : 1;
  const lg = x.createRadialGradient(450, 60, 0, 450, 60, 520); lg.addColorStop(0, `rgba(255,220,140,${.45 * fl})`); lg.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = lg; x.fillRect(0, 0, 900, 900);
  x.fillStyle = `rgba(255,230,170,${fl})`; x.beginPath(); x.arc(450, 40, 22, 0, TAU); x.fill();
}
function peepholeCiz(t, P, zoom = 1) {
  og.save(); og.setTransform(1, 0, 0, 1, 0, 0);
  koridorPeephole(og, 900, t);
  og.translate(450, 450); og.scale(zoom, zoom); og.translate(-450, -450);
  figur(og, P);
  og.restore();
  og.save(); og.globalCompositeOperation = 'multiply'; og.fillStyle = '#c8c890'; og.fillRect(0, 0, 900, 900); og.restore();
  const f = balikgozu(OFF, 900);
  g.fillStyle = '#020202'; g.fillRect(-200, -200, W + 400, H + 400);
  g.save(); g.translate(90, 510); g.drawImage(f, 0, 0);
  const rg = g.createRadialGradient(450, 450, 300, 450, 450, 452); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(.8, 'rgba(0,0,0,.45)'); rg.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = rg; g.beginPath(); g.arc(450, 450, 452, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(160,140,90,.25)'; g.lineWidth = 6; g.beginPath(); g.arc(450, 450, 448, 0, TAU); g.stroke();
  g.restore();
}
function merdivenBasamak(x0, y0, x1, y1, n) {
  const dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  g.fillStyle = '#1e1a17'; g.beginPath(); g.moveTo(x0, y0); for (let i = 0; i < n; i++) { g.lineTo(x0 + i * dx, y0 + (i + 1) * dy); g.lineTo(x0 + (i + 1) * dx, y0 + (i + 1) * dy); }
  g.lineTo(x1, y1 + 120); g.lineTo(x0, y0 + 120); g.closePath(); g.fill();
  for (let i = 0; i < n; i++) { g.fillStyle = '#8d867c'; g.fillRect(x0 + i * dx - (dx < 0 ? -dx : 0), y0 + (i + 1) * dy, Math.abs(dx), 12); g.fillStyle = '#6d675f'; g.fillRect(x0 + i * dx - (dx < 0 ? -dx : 0), y0 + (i + 1) * dy + 12, Math.abs(dx), -dy - 12); }
  // korkuluk
  g.strokeStyle = '#151210'; g.lineWidth = 9; g.beginPath(); g.moveTo(x0, y0 - 150); g.lineTo(x1, y1 - 150); g.stroke();
  g.lineWidth = 4; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(x0 + i * dx, y0 + i * dy - 150); g.lineTo(x0 + i * dx, y0 + i * dy); g.stroke(); }
}
function salon(t, o = {}) {
  duvar('#5a4636', '#3b2d22');
  // duvar kağıdı
  g.fillStyle = 'rgba(255,230,190,.05)'; for (let i = 0; i < 30; i++) g.fillRect(i * 44, 0, 18, 1500);
  g.fillStyle = '#2b1f17'; g.fillRect(-200, 1500, W + 400, 600);
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(-200, 1500 + i * 32); g.lineTo(W + 200, 1500 + i * 32); g.stroke(); }
  // pencere (gün batımı)
  const wx = 640, wy = 330;
  const sg = g.createLinearGradient(0, wy, 0, wy + 700); sg.addColorStop(0, '#f2a25c'); sg.addColorStop(.6, '#d9673a'); sg.addColorStop(1, '#7a3a3a');
  g.fillStyle = '#21170f'; g.fillRect(wx - 24, wy - 24, 388, 748); g.fillStyle = sg; g.fillRect(wx, wy, 340, 700);
  g.fillStyle = '#3a2230'; // silüet: kubbe, minare, binalar
  g.beginPath(); g.moveTo(wx, wy + 560);
  const r = rng(4); let px = wx; while (px < wx + 340) { const bw = 30 + r() * 40, bh = 40 + r() * 90; g.lineTo(px, wy + 700 - bh); g.lineTo(px + bw, wy + 700 - bh); px += bw; }
  g.lineTo(wx + 340, wy + 700); g.lineTo(wx, wy + 700); g.fill();
  g.beginPath(); g.arc(wx + 120, wy + 560, 55, Math.PI, TAU); g.fill(); g.fillRect(wx + 195, wy + 430, 10, 200); g.beginPath(); g.moveTo(wx + 193, wy + 432); g.lineTo(wx + 200, wy + 400); g.lineTo(wx + 207, wy + 432); g.fill();
  g.fillStyle = '#21170f'; g.fillRect(wx + 165, wy, 10, 700); g.fillRect(wx, wy + 330, 340, 10);
  g.fillStyle = 'rgba(240,225,200,.25)'; g.fillRect(wx - 40, wy - 30, 90, 770); g.fillRect(wx + 290, wy - 30, 90, 770);
  // ışık huzmesi
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .18 + .03 * Math.sin(t); g.fillStyle = '#ff9d5c';
  g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + 340, wy); g.lineTo(wx - 100, 1900); g.lineTo(wx - 700, 1900); g.fill(); g.restore();
  // örtülü koltuk
  g.fillStyle = '#d9d2c4'; g.beginPath(); g.moveTo(40, 1520); g.quadraticCurveTo(60, 1180, 200, 1200); g.quadraticCurveTo(330, 1100, 470, 1200); g.quadraticCurveTo(560, 1260, 540, 1520); g.fill();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.moveTo(120, 1520); g.quadraticCurveTo(200, 1350, 260, 1520); g.fill();
  // konsol + fotoğraf
  if (!o.noKonsol) {
    g.fillStyle = '#2a1a10'; g.fillRect(70, 1050, 360, 30); g.fillRect(90, 1080, 20, 420); g.fillRect(390, 1080, 20, 420);
    cerceve(250, 920, 1);
    g.fillStyle = '#6b8f9a'; g.beginPath(); g.ellipse(120, 1010, 28, 42, 0, 0, TAU); g.fill();
  }
  // sandalye + şal
  g.fillStyle = '#2b1a10'; g.fillRect(860, 1250, 20, 280); g.fillRect(1000, 1250, 20, 280); g.fillRect(850, 1240, 190, 26); g.fillRect(860, 1000, 18, 250); g.fillRect(1000, 1000, 18, 250);
  g.fillStyle = '#3c6638'; g.beginPath(); g.moveTo(850, 1010); g.quadraticCurveTo(940, 980, 1030, 1010); g.lineTo(1010, 1300); g.lineTo(870, 1290); g.fill();
}
function cerceve(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#6a4a20'; g.fillRect(-75, -95, 150, 190); g.fillStyle = '#c9a36a'; g.fillRect(-62, -82, 124, 164);
  g.save(); g.beginPath(); g.rect(-62, -82, 124, 164); g.clip();
  figur(g, { x: 0, y: 310, s: 70, kim: 'NEVIN', smile: .7, noLegs: true, t: 0 }); g.restore();
  g.fillStyle = '#0a0a0a'; g.beginPath(); g.moveTo(30, -95); g.lineTo(75, -95); g.lineTo(75, -50); g.fill(); // siyah kurdele
  g.beginPath(); g.moveTo(75, -50); g.lineTo(65, -30); g.lineTo(60, -55); g.fill();
  g.restore();
}
function zeminKat() {
  duvar('#4a5048', '#262a26');
  g.fillStyle = '#6f6a5a'; g.fillRect(-200, 1450, W + 400, 700);
  for (let i = 0; i < 18; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#5a5548' : '#7a7362'; g.fillRect(i * 64 - 50, 1450 + j * 64, 64, 64); }
  g.fillStyle = '#7d7466'; g.fillRect(-200, 1040, W + 400, 30);
  // posta kutuları
  for (let i = 0; i < 5; i++) { g.fillStyle = '#5c4a2a'; g.fillRect(80 + i * 64, 800, 56, 70); g.fillStyle = '#2a2015'; g.fillRect(90 + i * 64, 815, 36, 6); }
}
function kapiciKapi(x, open = 1) {
  g.fillStyle = '#1b1510'; g.fillRect(x - 10, 880, 280, 590);
  const gr = g.createLinearGradient(x, 0, x + 260, 0); gr.addColorStop(0, '#f2b45c'); gr.addColorStop(1, '#a8642c');
  g.fillStyle = gr; g.fillRect(x, 890, 260, 580);
  g.fillStyle = '#4a3020'; g.fillRect(x, 890, 260 * (1 - open), 580);
  g.fillStyle = '#5b3a24'; if (open < 1) { g.fillRect(x + 260 * (1 - open) - 14, 890, 14, 580); }
  isik(x + 130, 1200, 420 * open, 'rgba(255,170,90,.6)', open);
}
function asansorKafes(x) {
  g.fillStyle = '#121212'; g.fillRect(x, 700, 300, 770);
  g.strokeStyle = '#3a3a3a'; g.lineWidth = 5;
  for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(x + i * 26, 700); g.lineTo(x + i * 26 + 120, 1470); g.stroke(); g.beginPath(); g.moveTo(x + i * 26 + 120, 700); g.lineTo(x + i * 26, 1470); g.stroke(); }
  g.fillStyle = '#6a5a3a'; g.fillRect(x + 310, 1000, 50, 160); g.fillStyle = '#c33'; g.beginPath(); g.arc(x + 335, 1130, 8, 0, TAU); g.fill();
}
function yatakOdasi(t) {
  duvar('#1a2236', '#0b0f1a');
  // pencere ve ay ışığı
  g.fillStyle = '#0a1020'; g.fillRect(620, 300, 320, 520); g.fillStyle = '#26365a'; g.fillRect(640, 320, 280, 480);
  g.fillStyle = '#d8e2ff'; g.beginPath(); g.arc(840, 410, 34, 0, TAU); g.fill();
  const r = rng(9); for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(255,220,150,${.3 + r() * .5})`; g.fillRect(640 + r() * 280, 650 + r() * 140, 4, 6); }
  g.fillStyle = '#0a1020'; g.fillRect(775, 320, 10, 480); g.fillRect(640, 555, 280, 10);
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .12; g.fillStyle = '#8fb0ff'; g.beginPath(); g.moveTo(640, 320); g.lineTo(920, 320); g.lineTo(700, 1900); g.lineTo(100, 1900); g.fill(); g.restore();
}
function komodin(x, y, saat, t, ph) {
  g.fillStyle = '#20160f'; g.fillRect(x - 200, y, 400, 420); g.fillStyle = '#2d2016'; g.fillRect(x - 220, y - 24, 440, 30);
  g.fillStyle = '#120c08'; g.fillRect(x - 180, y + 60, 360, 6); g.fillStyle = '#6a5030'; g.beginPath(); g.arc(x, y + 150, 10, 0, TAU); g.fill();
  // saat
  g.fillStyle = '#0c0c0c'; rr(g, x - 170, y - 150, 220, 126, 14); g.fill();
  g.save(); g.shadowColor = '#ff3030'; g.shadowBlur = 24; g.fillStyle = '#ff4a3a'; g.font = '700 74px DejaVu Sans Mono'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(saat, x - 60, y - 86); g.restore();
  isik(x - 60, y - 86, 260, 'rgba(255,60,40,.35)');
  // telefon
  const jx = ph && ph.vib ? Math.sin(t * 90) * 5 : 0;
  g.save(); g.translate(x + 120 + jx, y - 8); g.scale(1, .38);
  g.fillStyle = '#060606'; rr(g, -50, -100, 100, 200, 14); g.fill();
  if (ph && ph.on) { g.fillStyle = '#9fc7ff'; rr(g, -44, -94, 88, 188, 10); g.fill(); }
  g.restore();
  if (ph && ph.on) { isik(x + 120, y - 30, 700, 'rgba(120,170,255,.55)'); }
}
function koridor(t, z, o = {}) {
  // perspektif koridor; z: 0 uzak, 1 kapıya yakın
  const vx = W / 2, vy = 820;
  const dw = lerp(170, 560, z), dh = dw * 2.1;
  duvar('#2a2620', '#15120e');
  const fx0 = vx - dw / 2, fx1 = vx + dw / 2, fy0 = vy - dh * .45, fy1 = vy + dh * .55;
  // zemin parke
  g.fillStyle = '#3a2618'; g.beginPath(); g.moveTo(fx0, fy1); g.lineTo(fx1, fy1); g.lineTo(W + 300, H + 200); g.lineTo(-300, H + 200); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3;
  for (let i = -8; i <= 8; i++) { g.beginPath(); g.moveTo(vx + i * dw / 16, fy1); g.lineTo(vx + i * 260, H + 200); g.stroke(); }
  // duvarlar
  g.fillStyle = '#4a3f33'; g.beginPath(); g.moveTo(fx0, fy0); g.lineTo(fx0, fy1); g.lineTo(-300, H + 200); g.lineTo(-300, -300); g.fill();
  g.fillStyle = '#433829'; g.beginPath(); g.moveTo(fx1, fy0); g.lineTo(fx1, fy1); g.lineTo(W + 300, H + 200); g.lineTo(W + 300, -300); g.fill();
  g.fillStyle = '#2e261d'; g.beginPath(); g.moveTo(fx0, fy0); g.lineTo(fx1, fy0); g.lineTo(W + 300, -300); g.lineTo(-300, -300); g.fill();
  // çerçeveli resimler (sol duvar)
  for (let i = 0; i < 3; i++) { const k = .25 + i * .25; const x = lerp(fx0, -300, k * .9), y = lerp(fy0 + dh * .25, 500, k * .9), s = lerp(.4, 1.8, k * .9) * (1 + z * .4);
    g.fillStyle = '#20160d'; g.fillRect(x - 30 * s, y - 40 * s, 60 * s, 80 * s); g.fillStyle = '#5a4a3a'; g.fillRect(x - 24 * s, y - 34 * s, 48 * s, 68 * s); }
  // dış kapı
  g.fillStyle = '#3a2416'; g.fillRect(fx0, fy0, dw, dh);
  g.strokeStyle = '#24160c'; g.lineWidth = dw * .03; g.strokeRect(fx0 + dw * .12, fy0 + dh * .08, dw * .76, dh * .36); g.strokeRect(fx0 + dw * .12, fy0 + dh * .5, dw * .76, dh * .42);
  g.fillStyle = '#b08a3a'; g.beginPath(); g.arc(vx, fy0 + dh * .3, dw * .03, 0, TAU); g.fill(); // kapı deliği
  g.fillRect(fx0 + dw * .8, fy0 + dh * .52, dw * .1, dw * .04); // kol
  g.fillStyle = '#8a6a2a'; g.fillRect(fx0 + dw * .08, fy0 + dh * .86, dw * .22, dw * .06); // mektup aralığı
  if (o.kapiSars) { g.fillStyle = `rgba(255,255,255,${o.kapiSars * .08})`; g.fillRect(fx0, fy0, dw, dh); }
  return { fx0, fy0, dw, dh, vx };
}
function kapiYakin(x, w) {
  g.fillStyle = '#3a2416'; g.fillRect(x, -100, w, H + 200);
  g.strokeStyle = '#24160c'; g.lineWidth = 16; g.strokeRect(x + 60, 200, w - 120, 600); g.strokeRect(x + 60, 900, w - 120, 900);
  const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, 'rgba(0,0,0,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x, -100, w, H + 200);
}

// ---------- çekimler ----------
const C = [];
const cek = (a, b, f, subY) => C.push({ a, b, f, subY });

// SAHNE 1 · KANCA
cek(0, 0.95, t => {
  kamera(t, 0, .95, { z0: 1.05, z1: 1.15, shake: 3 });
  g.fillStyle = '#05070c'; g.fillRect(-200, -200, W + 400, H + 400);
  figur(g, { x: 150, y: 908 + 4.57 * 2600, s: 2600, kim: 'ECE', t, eye: 1.35, pupil: lerp(.4, .75, t / .95), brow: .6, bl: 0, look: { x: .3, y: -.2 } });
  isik(250, 1300, 900, 'rgba(110,160,255,.45)');
  renk('#3a4a70', 'multiply', .6);
});
cek(0.95, 6, t => {
  const z = lerp(1, 1.08, ss(.95, 6, t));
  peepholeCiz(t, { x: 450, y: 820, s: 118, kim: 'NEVIN', t, m: mouth('NEVIN_T', t), smile: .55, bl: 0, eye: 1.05, look: { x: 0, y: .1 }, barefoot: 1 }, z);
  if (t > 3.9) { g.fillStyle = `rgba(0,0,0,${ss(3.9, 4.3, t)})`; g.fillRect(-200, -200, W + 400, H + 400); }
  if (t > 4.3) { const n = Math.floor(ss(4.3, 5.1, t) * 12); yazi(g, '6 SAAT ÖNCE'.slice(0, n), W / 2, H / 2, 72, { font: 'DejaVu Sans Mono', spacing: 8, stroke: false, alpha: 1 - ss(5.7, 6, t) }); }
});

// SAHNE 2 · MERDİVEN
cek(6, 10, t => {
  kamera(t, 6, 10, { z0: 1, z1: 1.04, y0: 60, y1: -40, shake: 3 });
  duvar('#5a4e42', '#2a231d');
  g.fillStyle = 'rgba(255,230,180,.06)'; for (let i = 0; i < 6; i++) g.fillRect(100 + i * 160, 0, 6, H);
  merdivenBasamak(950, 1000, 120, 560, 10);
  merdivenBasamak(100, 1560, 900, 1040, 11);
  g.fillStyle = '#7d766c'; g.fillRect(-200, 1560, 330, 30); g.fillStyle = '#18140f'; g.fillRect(-200, 1590, 330, 400);
  isik(540, 200, 900, 'rgba(255,220,160,.35)');
  const k = clamp((t - 6) / 4.4), x = lerp(170, 760, k), y = 1560 - (x - 100) * (520 / 800);
  figur(g, { x, y: y + 6, s: 82, kim: 'ECE', view: 'side', dir: 1, walk: t * 5.2, t, box: 1, arms: { l: { x: .55, y: 1.9 }, r: { x: .6, y: 1.95 } }, bl: ECEb(t) });
  renk('#c9a27a', 'multiply', .55);
});
function remziPlan(t, a, b, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.05, shake: 3 });
  zeminKat(); kapiciKapi(700, 1); asansorKafes(-140);
  figur(g, { x: 460, y: 760 + 4.57 * 270, s: 270, kim: 'REMZI', t, m: mouth('REMZI', t), bl: REMb(t), look: o.look || { x: .2, y: -1 }, brow: o.brow || .1, beads: 'r', arms: { r: { x: .45, y: 1.55 } }, tilt: o.tilt || -.04 });
  isik(800, 1200, 700, 'rgba(255,170,90,.25)');
  renk('#b8a888', 'multiply', .5);
}
cek(10, 12.9, t => remziPlan(t, 10, 12.9));
cek(12.9, 17.6, t => {
  kamera(t, 12.9, 17.6, { z0: 1, z1: 1.06, shake: 4 });
  duvar('#6a5c4c', '#3a3026');
  g.fillStyle = '#26201a'; g.fillRect(700, 420, 300, 700); g.fillStyle = '#e8c890'; g.fillRect(720, 440, 260, 660);
  g.fillStyle = '#26201a'; g.fillRect(845, 440, 10, 660); g.fillRect(720, 760, 260, 10);
  g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(150 + i * 70, 400 + (i % 3) * 130, 30 + i * 3, 0, TAU); g.fill(); }
  isik(850, 700, 800, 'rgba(255,210,150,.35)');
  const laugh = ss(14.0, 14.4, t) * (1 - ss(15.4, 16, t));
  figur(g, { x: 480, y: 720 + 4.57 * 250, s: 250, kim: 'ECE', t, box: 1, arms: { l: { x: -.62, y: 1.95 }, r: { x: .62, y: 1.95 } }, m: mouth('ECE', t), smile: .3 + laugh * .6, bl: ECEb(t), breathAmp: 4, breathRate: 6, lean: -.05, tilt: .05 + laugh * .06, look: { x: 0, y: .6 }, brow: -.1 });
  renk('#c9a27a', 'multiply', .45);
});
cek(17.6, 20.2, t => remziPlan(t, 17.6, 20.2, { z0: 1.05, z1: 1.1, brow: .4 }));
cek(20.2, 21.6, t => {
  kamera(t, 20.2, 21.6, { z0: 1.1, z1: 1.15, shake: 3 });
  duvar('#4a3e33', '#221c16');
  figur(g, { x: 540, y: 820 + 4.57 * 320, s: 320, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), look: { x: 0, y: 1 }, tilt: .14, brow: .5, eye: 1.1, arms: { l: { x: -.7, y: 1.5 }, r: { x: .7, y: 1.5 } } });
  g.fillStyle = '#15110d'; g.fillRect(-200, 1340, W + 400, 34); for (let i = 0; i < 12; i++) g.fillRect(i * 100, 1370, 14, 700);
  renk('#c9a27a', 'multiply', .45);
});
cek(21.6, 23.7, t => remziPlan(t, 21.6, 23.7, { z0: 1.1, z1: 1.18, look: { x: lerp(.2, -1, ss(22.8, 23.3, t)), y: lerp(-1, 0, ss(22.8, 23.3, t)) }, brow: .5 }));
cek(23.7, 28.2, t => {
  kamera(t, 23.7, 28.2, { z0: 1, z1: 1.25, shake: 2 });
  duvar('#2a1d14', '#120c08');
  g.fillStyle = '#8a6a2a'; rr(g, 330, 260, 420, 1400, 40); g.fill();
  g.fillStyle = '#b08a3a'; rr(g, 350, 280, 380, 1360, 30); g.fill();
  const lab = ['5', '4', '3', '2', '1', '0', '-1'];
  lab.forEach((l, i) => {
    const y = 420 + i * 175, on = l === '-1' && (Math.floor((t - 23.7) * 2.2) % 2 === 0 || t > 26.5);
    g.fillStyle = '#4a3a1a'; g.beginPath(); g.arc(540, y, 62, 0, TAU); g.fill();
    g.fillStyle = on ? '#ff2a1a' : '#d8cfb8'; g.beginPath(); g.arc(540, y, 50, 0, TAU); g.fill();
    if (on) isik(540, y, 300, 'rgba(255,40,20,.8)');
    g.fillStyle = on ? '#fff' : '#3a2a10'; g.font = '700 46px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(l, 540, y + 2);
  });
  renk('#9a8a70', 'multiply', .55);
});
cek(28.2, 32, t => {
  kamera(t, 28.2, 32, { z0: 1, z1: 1.03, shake: 3 });
  const open = 1 - ss(30.5, 31, t);
  zeminKat(); asansorKafes(-140);
  kapiciKapi(700, 1);
  const k = ss(28.4, 30.4, t), x = lerp(430, 830, k);
  if (t < 30.6) figur(g, { x, y: 1640, s: 180, kim: 'REMZI', view: 'side', dir: 1, walk: k < 1 ? t * 4.4 : null, t, beads: 'r', bl: REMb(t) });
  g.fillStyle = '#4a3020'; g.fillRect(700, 890, 260 * (1 - open), 580);
  g.fillStyle = '#1b1510'; g.fillRect(680, 880, 20, 600);
  if (open < 1) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(700, 890, 260, 580); g.fillStyle = '#4a3020'; g.fillRect(700, 890, 260, 580); g.fillStyle = '#2a1a10'; g.fillRect(920, 1150, 20, 40); }
  renk('#b8a888', 'multiply', .5);
});

// SAHNE 3 · SALON
cek(32, 37.6, t => {
  kamera(t, 32, 37.6, { z0: 1, z1: 1.04, shake: 3 });
  salon(t);
  const k = ss(32.2, 34.5, t), x = lerp(1060, 650, k);
  const drop = ss(34.5, 35.3, t);
  if (drop < 1) figur(g, { x, y: 1660 + drop * 40, s: 150, kim: 'ECE', view: t < 34.6 ? 'side' : 'front', dir: -1, walk: k < 1 ? t * 5 : null, t, box: 1, boxDrop: drop * 1.3, arms: t < 34.6 ? { l: { x: -.55, y: 1.9 }, r: { x: -.6, y: 1.95 } } : { l: { x: -.62, y: 1.95 + drop * 1.3 }, r: { x: .62, y: 1.95 + drop * 1.3 } }, bl: ECEb(t), lean: drop * .1 });
  else {
    g.save(); g.translate(650, 1660); for (let i = 0; i < 2; i++) { g.fillStyle = i ? '#a07a4f' : '#b48a5a'; g.fillRect(-90 + i * 12, -93 * (i + 1), 180 - i * 24, 93); g.fillStyle = '#d8c79a'; g.fillRect(-12, -93 * (i + 1), 24, 93); } g.restore();
    figur(g, { x: 820, y: 1690, s: 150, kim: 'ECE', t, bl: ECEb(t), look: { x: lerp(1, -1, ss(35.8, 37, t)), y: -.3 }, breathAmp: 2, breathRate: 3 });
  }
  renk('#ffb27a', 'soft-light', .5);
});
cek(37.6, 42, t => {
  kamera(t, 37.6, 42, { z0: 1.05, z1: 1.12, shake: 3 });
  salon(t);
  const k = ss(37.7, 40.3, t), x = lerp(820, 470, k);
  figur(g, { x, y: 1690, s: 150, kim: 'ECE', view: k < 1 ? 'side' : 'front', dir: -1, walk: k < 1 ? t * 4.4 : null, t, bl: ECEb(t), look: { x: -1, y: .1 }, sad: .6, brow: .3 });
  renk('#ffb27a', 'soft-light', .5);
});
cek(42, 44.3, t => {
  kamera(t, 42, 44.3, { z0: 1, z1: 1.08, shake: 2 });
  duvar('#4a3828', '#2a1d14');
  g.fillStyle = '#2a1a10'; g.fillRect(-200, 1450, W + 400, 80);
  cerceve(540, 960, 4.2);
  const hk = ss(42.4, 43.4, t);
  g.save(); g.translate(lerp(1200, 900, hk), lerp(800, 600, hk)); g.rotate(-.5);
  g.fillStyle = '#6e1f2b'; g.fillRect(40, -60, 400, 140);
  g.fillStyle = '#e6b391'; g.beginPath(); g.ellipse(0, 0, 70, 56, 0, 0, TAU); g.fill();
  g.beginPath(); rr(g, -150, -20, 160, 36, 18); g.fill();
  g.restore();
  isik(700, 500, 900, 'rgba(255,170,100,.4)');
  renk('#ffb27a', 'soft-light', .45);
});
cek(44.3, 46.5, t => {
  kamera(t, 44.3, 46.5, { z0: 1, z1: 1.06, shake: 2 });
  duvar('#5a4434', '#2a1d14');
  isik(900, 400, 900, 'rgba(255,160,90,.5)');
  figur(g, { x: 540, y: 860 + 4.57 * 620, s: 620, kim: 'ECE', t, bl: ECEb(t), look: { x: -.3, y: .9 }, smile: .25, sad: .4, brow: .55, tear: ss(44.6, 46.4, t), tilt: -.06 });
  g.fillStyle = '#3c6638'; g.beginPath(); g.moveTo(-100, 1500); g.quadraticCurveTo(300, 1280, 560, 1330); g.quadraticCurveTo(800, 1360, 1200, 1500); g.lineTo(1200, 2100); g.lineTo(-100, 2100); g.fill();
  g.strokeStyle = '#27461f'; g.lineWidth = 6; for (let i = 0; i < 10; i++) { g.beginPath(); g.moveTo(i * 120, 1420); g.quadraticCurveTo(i * 120 + 40, 1700, i * 120 - 20, 2000); g.stroke(); }
  renk('#ffb27a', 'soft-light', .4);
});
cek(46.5, 50.3, t => {
  kamera(t, 46.5, 50.3, { z0: 1, z1: 1.1, shake: 3 });
  salon(t, { noKonsol: true });
  figur(g, { x: 540, y: 700 + 4.57 * 330, s: 330, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), look: { x: 0, y: .5 }, sad: .5, smile: .1, brow: .5, tear: 1, phone: 'r', arms: { r: { x: .22, y: .78, bend: 1 } }, phoneRot: -.2, phoneGlow: 1 });
  renk('#ffb27a', 'soft-light', .45);
});
function sohbet(t, o) {
  const msgs = [];
  if (o.ece) msgs.push({ type: 'voice', out: 1, dur: '0:07', seed: 3, ticks: o.ticks || 1, blue: o.blue, time: o.eceTime || '18:47', alpha: o.eceAlpha });
  if (o.nine) msgs.push({ type: 'voice', out: 0, dur: '0:07', seed: 8, prog: o.prog || 0, time: '03:16', alpha: o.nineAlpha });
  if (o.txt) msgs.push({ type: 'text', out: 0, text: 'O BEN DEĞİLİM.', big: 1, time: '03:17', alpha: o.txtAlpha });
  return { clock: o.clock, status: o.status, statusCol: o.statusCol, msgs, rec: o.rec, lev: o.lev };
}
function telefonInsert(t, a, b, S, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.05, shake: o.shake || 6 });
  g.fillStyle = o.bg || '#0a0d14'; g.fillRect(-200, -200, W + 400, H + 400);
  const w = 880; const hh = telefonEkrani(g, (W - w) / 2, (H - w * 2.05) / 2, w, S);
  isik(W / 2, H / 2, 1100, 'rgba(90,140,200,.18)');
}
cek(50.3, 55.1, t => {
  const rec = t < 54.3 ? (t - 46.5) : null;
  telefonInsert(t, 50.3, 55.1, sohbet(t, { clock: '18:47', status: 'son görülme 5 Ekim 03:17', ece: t >= 54.3, ticks: 1, rec: rec, lev: mouth('ECE', t) }), { bg: '#2a1a12', skin: '#e6b391' });
  renk('#ffb27a', 'soft-light', .2);
}, 640);
cek(55.1, 58, t => {
  // odak kayması: önde telefon, arkada uzaklaşan Ece
  kamera(t, 55.1, 58, { z0: 1, z1: 1.1, shake: 2 });
  const blurBg = lerp(2, 14, ss(55.3, 56.2, t));
  g.save(); g.filter = `blur(${blurBg}px)`; salon(t);
  const k = ss(55.2, 57.8, t);
  figur(g, { x: lerp(420, 980, k), y: 1690, s: 150, kim: 'ECE', view: 'side', dir: 1, walk: t * 4.4, t, bl: ECEb(t) });
  g.restore();
  g.save(); g.translate(330, 1080); g.rotate(-.06);
  telefonEkrani(g, -230, -470, 460, sohbet(t, { clock: '18:47', status: t > 56.4 ? 'çevrimiçi' : 'son görülme 5 Ekim 03:17', statusCol: t > 56.4 ? '#25d366' : null, ece: 1, ticks: t > 56.4 ? 2 : 1, blue: t > 56.4 }));
  g.restore();
  if (t > 56.4) isik(330, 1080, 500, 'rgba(80,190,255,.25)');
  renk('#ffb27a', 'soft-light', .35);
});

// SAHNE 4 · YATAK ODASI 03:16
cek(58, 62.6, t => {
  kamera(t, 58, 62.6, { z0: 1, z1: 1.12, shake: 2 });
  yatakOdasi(t);
  komodin(540, 1150, '03:16', t, { vib: t > 61 && t < 62.6, on: t > 61 });
  renk('#4a5a8a', 'multiply', .6);
});
cek(62.6, 65.7, t => {
  kamera(t, 62.6, 65.7, { z0: 1.05, z1: 1, shake: 3 });
  yatakOdasi(t);
  // yatak (yandan)
  g.fillStyle = '#2a1a10'; g.fillRect(60, 1000, 70, 700); g.fillStyle = '#d0d4e0'; rr(g, 120, 1180, 900, 140, 30); g.fill();
  g.fillStyle = '#e8ebf2'; rr(g, 140, 1110, 240, 110, 50); g.fill();
  const up = easeIO(ss(62.8, 64.6, t));
  const hip = { x: 470, y: 1250 };
  g.save(); g.translate(hip.x, hip.y); g.rotate(lerp(-1.42, 0, up)); g.translate(-hip.x, -hip.y);
  figur(g, { x: hip.x, y: hip.y + 2.3 * 140, s: 140, kim: 'ECE', t, view: up > .6 ? 'front' : 'side', dir: 1, bl: up < .3 ? 1 : ECEb(t), noLegs: true, look: { x: up > .6 ? 1 : 0, y: .3 }, brow: .4, arms: up > .7 ? { l: { x: -.2, y: .3 + (1 - ss(64.6, 65.3, t)) * 1.2 } } : null });
  g.restore();
  g.fillStyle = '#5a6a9a'; g.beginPath(); g.moveTo(330, 1290); g.quadraticCurveTo(600, 1200, 1030, 1240); g.lineTo(1030, 1500); g.lineTo(330, 1500); g.fill();
  g.fillStyle = '#20160f'; g.fillRect(1030, 1180, 200, 400);
  isik(1060, 1170, 800, 'rgba(120,170,255,.55)');
  renk('#4a5a8a', 'multiply', .55);
});
cek(65.7, 73, t => {
  const st = t < 67 ? 'çevrimiçi' : 'ses kaydediyor...';
  const prog = clamp((t - 70.2) / 5.96);
  telefonInsert(t, 65.7, 73, sohbet(t, { clock: '03:16', status: st, statusCol: '#25d366', ece: 1, ticks: 2, blue: 1, eceTime: '18:47', nine: t > 69, prog, nineAlpha: ss(69, 69.25, t) }), { z0: 1, z1: 1.12, skin: '#e6b391' });
  renk('#5a6a9a', 'multiply', .25);
}, 640);
function eceYakin(t, a, b, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.06, shake: o.shake || 3 });
  g.fillStyle = o.bg || '#0b0f1a'; g.fillRect(-200, -200, W + 400, H + 400);
  if (o.dekor) o.dekor(t);
  figur(g, Object.assign({ x: 540, y: 880 + 4.57 * 600, s: 600, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t) }, o.P));
  if (o.isik) isik(...o.isik);
  renk(o.grade || '#4a5a8a', 'multiply', o.gradeA || .5);
}
cek(73, 76.4, t => eceYakin(t, 73, 76.4, { P: { eye: 1.2, brow: .8, look: { x: .2, y: .6 }, phone: 'r', phoneGlow: 1, arms: { r: { x: .3, y: 1.3 }, l: { x: lerp(-.6, -.05, ss(74.2, 75.4, t)), y: lerp(1.7, .32, ss(74.2, 75.4, t)) } } }, isik: [700, 1500, 1200, 'rgba(120,170,255,.6)'], dekor: yatakOdasi }));
cek(76.4, 82.2, t => eceYakin(t, 76.4, 82.2, { z0: 1.05, z1: 1.18, P: { eye: 1.3, brow: 1, look: { x: .4, y: -.1 }, pupil: .35, tear: .5, phone: 'r', phoneGlow: 1, arms: { r: { x: .3, y: 1.3 } } }, isik: [700, 1500, 1200, 'rgba(120,170,255,.6)'], dekor: yatakOdasi }));
cek(82.2, 83.3, t => {
  kamera(t, 82.2, 83.3, { z0: 1.5, z1: 1.6, x: 90, y0: -156, y1: -170, shake: 8 });
  yatakOdasi(t); komodin(540, 1150, t < 82.35 ? '03:16' : '03:17', t, { on: 1 });
  renk('#4a5a8a', 'multiply', .55);
  if (t > 82.35 && t < 82.5) { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(-200, -200, W + 400, H + 400); }
});

// SAHNE 5 · KORİDOR 03:17
cek(83.3, 94, t => {
  const dur = 88.0, dur2 = 89.4;
  const mv = t < dur ? (t - 83.3) : t < dur2 ? (dur - 83.3) : (dur - 83.3) + (t - dur2);
  const z = clamp(mv / 9.3);
  kamera(t, 83.3, 94, { z0: 1, z1: 1.04, shake: 5 });
  const K = koridor(t, z);
  const walking = !(t > dur && t < dur2);
  const fx = 540, fy = 1980;
  figur(g, { x: fx, y: fy, s: 300, kim: 'ECE', view: 'back', walk: walking ? mv * 4 : null, t, phone: 'r', arms: { r: { x: .42, y: 1.25 } }, barefoot: 1, breathAmp: walking ? 1 : 3 });
  const hx = fx + 170, hy = fy - 4.57 * 300 + 1.0 * 300;
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .12; g.fillStyle = '#cfe0ff';
  g.beginPath(); g.moveTo(hx, hy); g.lineTo(K.vx - K.dw * .9, K.fy0 + K.dh * .2); g.lineTo(K.vx + K.dw * .9, K.fy0 + K.dh * .9); g.fill(); g.restore();
  const tx = K.vx + wob(t * 2, 3) * 60, ty = K.fy0 + K.dh * .45;
  karanlik(g, [{ x: tx, y: ty, r: K.dw * 1.7, a: .9 }, { x: K.vx, y: K.fy0 + K.dh * 1.05, r: K.dw * 1.4, sy: .45, a: .8 }, { x: fx, y: fy - 4.57 * 300 + 1.3 * 300, r: 520, a: .55 }], .9);
  renk('#4a5a8a', 'multiply', .35);
});
cek(94, 95.4, t => {
  kamera(t, 94, 95.4, { z0: 1, z1: 1.12, shake: 3 });
  g.fillStyle = '#05070c'; g.fillRect(-200, -200, W + 400, H + 400);
  kapiYakin(700, 600);
  g.fillStyle = '#b08a3a'; g.beginPath(); g.arc(712, 860, 26, 0, TAU); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(712, 860, 12, 0, TAU); g.fill();
  const k = ss(94, 95.2, t);
  figur(g, { x: lerp(260, 420, k), y: 880 + 4.57 * 560, s: 560, kim: 'ECE', view: 'side', dir: 1, t, bl: 0, eye: 1.15, brow: .6, headY: -.02 });
  karanlik(g, [{ x: 600, y: 860, r: 700, a: .9 }], .82);
  renk('#4a5a8a', 'multiply', .45);
});
cek(95.4, 99.8, t => {
  peepholeCiz(t, { x: 450, y: 820, s: 118, kim: 'NEVIN', t, m: mouth('NEVIN_T', t), smile: .6, bl: 0, eye: 1.05, look: { x: 0, y: .1 }, barefoot: 1 }, lerp(1, 1.12, ss(95.4, 99.8, t)));
});
cek(99.8, 103.4, t => eceYakin(t, 99.8, 103.4, { z0: 1.05, z1: 1.15, bg: '#05070c', P: { eye: 1.1, brow: .9, look: { x: 1, y: -.1 }, tear: ss(100, 102.5, t), sad: .8, view: 'front' }, isik: [1000, 900, 700, 'rgba(255,220,150,.35)'], grade: '#4a5a8a', gradeA: .55 }));
cek(103.4, 105.1, t => {
  kamera(t, 103.4, 105.1, { z0: 1, z1: 1.1, shake: 3 });
  kapiYakin(-100, 1300);
  g.fillStyle = '#9a7a30'; rr(g, 380, 700, 240, 520, 30); g.fill(); g.fillStyle = '#c9a44a'; rr(g, 400, 720, 200, 480, 24); g.fill();
  g.fillStyle = '#111'; g.beginPath(); g.arc(500, 900, 26, 0, TAU); g.fill();
  const rot = ss(104.3, 104.9, t) * .5;
  g.save(); g.translate(500, 900); g.rotate(rot); g.fillStyle = '#c0c0b8'; g.fillRect(-8, -140, 16, 140); g.beginPath(); g.arc(0, -170, 40, 0, TAU); g.fill(); g.fillStyle = '#3a2416'; g.beginPath(); g.arc(0, -170, 14, 0, TAU); g.fill(); g.restore();
  const k = ss(103.5, 104.3, t);
  g.save(); g.translate(lerp(1250, 620, k), lerp(1300, 820, k)); g.rotate(-.7);
  g.fillStyle = '#6e1f2b'; g.fillRect(60, -80, 500, 170);
  g.fillStyle = '#e6b391'; g.beginPath(); g.ellipse(0, 0, 95, 75, 0, 0, TAU); g.fill();
  for (let i = 0; i < 4; i++) { rr(g, -190 + i * 6, -60 + i * 34, 140, 30, 15); g.fill(); }
  g.restore();
  karanlik(g, [{ x: 540, y: 900, r: 700 }], .85);
  renk('#4a5a8a', 'multiply', .45);
});

// SAHNE 6
cek(105.1, 108.5, t => {
  telefonInsert(t, 105.1, 108.5, sohbet(t, { clock: '03:17', status: 'çevrimiçi', statusCol: '#25d366', ece: 1, ticks: 2, blue: 1, nine: 1, prog: 1, txt: t > 105.25, txtAlpha: ss(105.25, 105.4, t) }), { z0: 1, z1: 1.2, shake: 7, skin: '#e6b391' });
  renk('#5a6a9a', 'multiply', .25);
}, 640);
cek(108.5, 110.2, t => eceYakin(t, 108.5, 110.2, { z0: 1.1, z1: 1.2, bg: '#05070c', P: { eye: 1.35, brow: 1, pupil: .3, look: { x: lerp(0, 1, ss(109.2, 110, t)), y: 0 }, bl: 0 }, isik: [800, 1500, 900, 'rgba(120,170,255,.5)'], grade: '#4a5a8a', gradeA: .55 }));
cek(110.2, 114, t => {
  const wide = ss(110.4, 113.6, t);
  peepholeCiz(t, { x: 450, y: 430 + 4.57 * 300, s: 300, kim: 'NEVIN', t, m: mouth('NEVIN_T', t), smile: .6, wide, bl: 0, eye: 1.05 + wide * .15, taklit: t > 111.6, look: { x: 0, y: 0 }, barefoot: 1 }, lerp(1, 1.25, ss(110.2, 114, t)));
  if (t > 111.6) { g.fillStyle = `rgba(80,0,0,${.15 * ss(111.6, 113, t)})`; g.fillRect(-200, -200, W + 400, H + 400); }
});
cek(114, 116.4, t => {
  let kick = 0; for (const k of DATA.knock) { const d = t - k; if (d >= 0 && d < .35) kick = Math.max(kick, 1 - d / .35); }
  g.save(); g.translate((Math.random() - .5) * 30 * kick, (Math.random() - .5) * 30 * kick);
  kamera(t, 114, 116.4, { z0: 1.15, z1: 1.3, shake: 4 });
  const K = koridor(t, .8, { kapiSars: kick });
  const back = ss(114, 116.4, t);
  figur(g, { x: 540, y: 1980 + back * 120, s: 300 + back * 30, kim: 'ECE', view: 'back', t, phone: 'r', arms: { r: { x: .42, y: 1.25 } }, barefoot: 1, breathAmp: 4, breathRate: 9 });
  karanlik(g, [{ x: 540, y: K.fy0 + K.dh * .45, r: K.dw * 1.2 + kick * 200 }], .9 - kick * .2);
  renk('#4a5a8a', 'multiply', .35);
  g.restore();
});
cek(116.4, 120.01, t => {
  g.fillStyle = '#000'; g.fillRect(-200, -200, W + 400, H + 400);
  if (t > 117.2) {
    const a = ss(117.2, 117.6, t), gl = Math.random() < .15 ? 8 : 0;
    yazi(g, 'SON GÖRÜLME', W / 2 - gl, H / 2 - 40, 112, { font: 'DejaVu Serif', color: 'rgba(255,40,40,.7)', stroke: false, alpha: a, spacing: 10 });
    yazi(g, 'SON GÖRÜLME', W / 2 + gl * .5, H / 2 - 40, 112, { font: 'DejaVu Serif', stroke: false, alpha: a, spacing: 10 });
    yazi(g, 'Bölüm 2: Islak İzler', W / 2, H / 2 + 70, 40, { weight: 400, stroke: false, alpha: ss(118, 118.4, t), color: '#bbb' });
    g.fillStyle = `rgba(37,211,102,${ss(119, 119.2, t)})`; g.beginPath(); g.arc(W / 2 - 115, H / 2 + 150, 9, 0, TAU); g.fill();
    yazi(g, 'çevrimiçi', W / 2 + 10, H / 2 + 150, 34, { weight: 400, stroke: false, alpha: ss(119, 119.2, t), color: '#25d366' });
  }
});

function render(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const s = C.find(c => t >= c.a && t < c.b) || C[C.length - 1];
  window.SUBY = s.subY; g.save(); s.f(t); g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 116.4) sonIslem(g, t, { vig: .7, grain: .08 });
  // kesme geçişlerinde 2 karelik siyah flaş yerine yumuşak kararma
  const fade = C.reduce((m, c) => Math.min(m, Math.abs(t - c.a)), 9);
  if (fade < .04) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, H); }
  altyazi(g, t);
}
window.render = render;
