// SON GÖRÜLME · bölümlerin ortak sahne yardımcıları (dekor, kamera, ışık)
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


// ---------- ortak çekim tipleri ----------
function telefonInsert(t, a, b, S, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.05, shake: o.shake || 6 });
  g.fillStyle = o.bg || '#0a0d14'; g.fillRect(-200, -200, W + 400, H + 400);
  const w = 880; const hh = telefonEkrani(g, (W - w) / 2, (H - w * 2.05) / 2, w, S);
  isik(W / 2, H / 2, 1100, 'rgba(90,140,200,.18)');
}
function eceYakin(t, a, b, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.06, shake: o.shake || 3 });
  g.fillStyle = o.bg || '#0b0f1a'; g.fillRect(-200, -200, W + 400, H + 400);
  if (o.dekor) o.dekor(t);
  figur(g, Object.assign({ x: 540, y: 880 + 4.57 * 600, s: 600, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t) }, o.P));
  if (o.isik) isik(...o.isik);
  renk(o.grade || '#4a5a8a', 'multiply', o.gradeA || .5);
}

// bölüm sonu kartı: iki satır başlık, ekrana sığar (t0: kartın başladığı an, ad: sonraki bölüm, bild: çevrimiçi bildirimi anı)
function bitisKarti(t, t0, ad, bild) {
  g.fillStyle = '#000'; g.fillRect(-200, -200, W + 400, H + 400);
  if (t < t0 + .6) return;
  const a = ss(t0 + .6, t0 + 1, t), gl = Math.random() < .15 ? 8 : 0;
  for (const [dx, col] of [[-gl, 'rgba(255,40,40,.7)'], [gl * .5, '#ffffff']]) {
    yazi(g, 'SON', W / 2 + dx, H / 2 - 150, 130, { font: 'DejaVu Serif', color: col, stroke: false, alpha: a, spacing: 26 });
    yazi(g, 'GÖRÜLME', W / 2 + dx, H / 2 - 10, 130, { font: 'DejaVu Serif', color: col, stroke: false, alpha: a, spacing: 4 });
  }
  yazi(g, ad, W / 2, H / 2 + 120, 42, { weight: 400, stroke: false, alpha: ss(t0 + 1.2, t0 + 1.6, t), color: '#bbb' });
  const b = ss(bild, bild + .2, t);
  g.font = '400 34px DejaVu Sans'; const tw = g.measureText('çevrimiçi').width;
  g.fillStyle = `rgba(37,211,102,${b})`; g.beginPath(); g.arc(W / 2 - tw / 2 - 22, H / 2 + 200, 9, 0, TAU); g.fill();
  yazi(g, 'çevrimiçi', W / 2 + 4, H / 2 + 200, 34, { weight: 400, stroke: false, alpha: b, color: '#25d366' });
}

// ---------- çekim listesi altyapısı ----------
const C = [];
const cek = (a, b, f, subY) => C.push({ a, b, f, subY });

function render(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const s = C.find(c => t >= c.a && t < c.b) || C[C.length - 1];
  window.SUBY = s.subY; g.save(); s.f(t); g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (t < (window.SON_KART || 1e9)) sonIslem(g, t, { vig: .7, grain: .08 });
  // kesme geçişlerinde 2 karelik siyah flaş yerine yumuşak kararma
  const fade = C.reduce((m, c) => Math.min(m, Math.abs(t - c.a)), 9);
  if (fade < .04) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, H); }
  altyazi(g, t);
}
window.render = render;
