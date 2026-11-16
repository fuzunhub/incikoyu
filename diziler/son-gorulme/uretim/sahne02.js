// SON GÖRÜLME · Bölüm 2 "Islak İzler" · çekim listesi
window.SON_KART = 86;

// ---------- bölüme özel yardımcılar ----------
function vurusKick(t) { let k = 0; for (const x of DATA.knock) { const d = t - x; if (d >= 0 && d < .3) k = Math.max(k, 1 - d / .3); } return k; }
function oturan(P, sit) {
  // sit: 0 ayakta, 1 yere çökmüş (dizler yukarıda)
  const h = P.s, floor = P.floor;
  const hipStand = floor - 2.3 * h, hipSit = floor - .25 * h;
  const hip = lerp(hipStand, hipSit, sit);
  const r = figur(g, Object.assign({}, P, { y: hip + 2.3 * h, noLegs: sit > .05 }));
  if (sit > .05) {
    const c = KISI[P.kim]; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const s of [-1, 1]) {
      const kx = P.x + s * .27 * h, ky = hip - .95 * h * sit, fx = P.x + s * .4 * h, fy = floor;
      g.strokeStyle = '#1a1d26'; g.lineWidth = .36 * h; g.beginPath(); g.moveTo(kx, ky); g.lineTo(fx, fy - .05 * h); g.stroke();
      g.fillStyle = c.skin; g.beginPath(); g.ellipse(fx, fy, .15 * h, .08 * h, 0, 0, TAU); g.fill();
      g.strokeStyle = c.pants; g.lineWidth = .38 * h; g.beginPath(); g.moveTo(P.x + s * .18 * h, hip); g.lineTo(kx, ky); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.ellipse(kx - s * .03 * h, ky - .04 * h, .12 * h, .09 * h, 0, 0, TAU); g.fill();
    }
  }
  return r;
}
function ayakIzi(x, y, s, rot = 0, a = 1, yarim = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a;
  g.fillStyle = 'rgba(30,40,50,.55)';
  g.beginPath(); g.ellipse(0, 0, 11 * s, 26 * s, 0, 0, TAU); g.fill();
  if (!yarim) for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-9 * s + i * 4.6 * s, -31 * s + Math.abs(i - 1) * 2 * s, (4 - i * .5) * s, 0, TAU); g.fill(); }
  g.fillStyle = 'rgba(220,235,255,.35)'; g.beginPath(); g.ellipse(-3 * s, -6 * s, 3 * s, 9 * s, -.2, 0, TAU); g.fill();
  g.restore();
}
function dugmeYakin(t, a, on) {
  kamera(t, a, a + 1.6, { z0: 1.05, z1: 1.15, shake: 6 });
  duvar(on ? '#c9b08a' : '#2a2620', on ? '#8a7454' : '#15120e');
  g.fillStyle = on ? '#efe6d2' : '#6a6458'; rr(g, 380, 700, 320, 480, 26); g.fill();
  g.fillStyle = on ? '#d8ccb2' : '#4a4438'; rr(g, 490, 800 + (on ? 0 : 140), 100, 140, 14); g.fill();
  const k = ss(a + .4, a + .9, t);
  g.save(); g.translate(lerp(1000, 600, k), lerp(1500, on ? 1000 : 1080, k)); g.rotate(-.9);
  g.fillStyle = '#6e1f2b'; g.fillRect(60, -80, 500, 170);
  g.fillStyle = '#e6b391'; g.beginPath(); g.ellipse(0, 0, 90, 70, 0, 0, TAU); g.fill();
  rr(g, -180, -20, 150, 40, 20); g.fill(); g.restore();
  if (!on) karanlik(g, [{ x: 540, y: 950, r: 600, a: .7 }], .8);
}
function mutfak(t) {
  duvar('#3c4446', '#20262a');
  for (let i = 0; i < 18; i++) for (let j = 0; j < 10; j++) { g.fillStyle = (i + j) % 2 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; g.fillRect(i * 64, 700 + j * 64, 62, 62); }
  g.fillStyle = '#5a4030'; g.fillRect(-200, 1340, W + 400, 60); g.fillStyle = '#3a2a1e'; g.fillRect(-200, 1400, W + 400, 700);
  g.fillStyle = '#d8d8d0'; rr(g, 760, 600, 260, 760, 20); g.fill(); g.fillStyle = '#b8b8b0'; g.fillRect(760, 900, 260, 8); g.fillStyle = '#888'; g.fillRect(990, 700, 10, 150);
  g.fillStyle = '#20262a'; g.fillRect(140, 420, 300, 34); g.fillStyle = '#f0f4ff'; g.fillRect(150, 454, 280, 16);
}
function sahanlik(t, o = {}) {
  // 5. kat sahanlığı (sabah, tepe pencereden ışık)
  duvar('#8a8072', '#5a5246');
  g.fillStyle = 'rgba(255,250,235,.12)'; g.fillRect(-200, -200, W + 400, H + 400);
  g.fillStyle = '#b9b2a6'; g.fillRect(-200, 1520, W + 400, 600);
  g.strokeStyle = 'rgba(90,80,70,.25)'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(-200, 1560 + i * 60); g.quadraticCurveTo(540, 1530 + i * 70, 1280, 1580 + i * 55); g.stroke(); }
  isik(540, 0, 1100, 'rgba(255,245,220,.5)');
}

// ---------- SAHNE 1 · KAPI ÖNÜ 03:18 ----------
cek(0, 4.2, t => {
  const k = vurusKick(t);
  kamera(t, 0, 4.2, { z0: 1, z1: 1.05, shake: 4 + k * 20 });
  kapiYakin(-100, 1300);
  g.fillStyle = '#b08a3a'; g.beginPath(); g.arc(540, 560, 22, 0, TAU); g.fill();
  const sit = easeIO(ss(.1, 2.0, t));
  oturan({ x: 540, floor: 1880, s: 300, kim: 'ECE', t, bl: ECEb(t), eye: 1.2, brow: .9, look: { x: 0, y: .2 }, barefoot: 1, arms: { l: { x: -.08, y: .3 }, r: { x: .1, y: .33 } }, tilt: .05 }, sit);
  karanlik(g, [{ x: 540, y: 900, r: 650 }], .86 - k * .2);
  renk('#4a5a8a', 'multiply', .4);
});
cek(4.2, 8.2, t => {
  kamera(t, 4.2, 8.2, { z0: 1.05, z1: 1.14, shake: 3 });
  kapiYakin(-100, 1300);
  oturan({ x: 540, floor: 2300, s: 520, kim: 'ECE', t, bl: t < 7 ? 1 : ECEb(t), brow: 1, tear: ss(5, 8, t), arms: { l: { x: -.08, y: .3 }, r: { x: .1, y: .33 } }, barefoot: 1 }, 1);
  karanlik(g, [{ x: 540, y: 800, r: 700 }], .8);
  renk('#4a5a8a', 'multiply', .45);
});
cek(8.2, 11.2, t => {
  // kapının altındaki aralıktan sızan ışık ve kıpırdayan ayak gölgeleri
  kamera(t, 8.2, 11.2, { z0: 1, z1: 1.1, shake: 2 });
  g.fillStyle = '#060504'; g.fillRect(-200, -200, W + 400, H + 400);
  g.fillStyle = '#2a1a10'; g.fillRect(-200, 300, W + 400, 980);
  g.fillStyle = '#1a0f08'; g.fillRect(-200, 1280, W + 400, 30);
  const gr = g.createLinearGradient(0, 1310, 0, 1340); gr.addColorStop(0, 'rgba(255,220,150,.95)'); gr.addColorStop(1, 'rgba(255,200,120,.2)');
  g.fillStyle = gr; g.fillRect(-200, 1310, W + 400, 28);
  isik(540, 1330, 700, 'rgba(255,200,120,.35)');
  const sx = 540 + Math.sin(t * 1.3) * 60;
  g.fillStyle = 'rgba(0,0,0,.92)'; for (const d of [-90, 90]) { g.beginPath(); g.ellipse(sx + d, 1324, 70, 16, 0, 0, TAU); g.fill(); }
  g.fillStyle = '#2b1f17'; g.fillRect(-200, 1340, W + 400, 700);
  g.fillStyle = 'rgba(160,190,220,.35)'; g.beginPath(); g.ellipse(sx, 1400, 240, 26, 0, 0, TAU); g.fill(); // sızan ıslaklık
  renk('#6a6a8a', 'multiply', .3);
});
cek(11.2, 14.4, t => {
  kamera(t, 11.2, 14.4, { z0: 1.05, z1: 1.15, shake: 3 });
  g.fillStyle = '#05070c'; g.fillRect(-200, -200, W + 400, H + 400);
  kapiYakin(-100, 1300);
  const turn = ss(12.6, 13.6, t);
  figur(g, { x: 540, y: 880 + 4.57 * 600, s: 600, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), eye: 1.25, brow: .9, pupil: .35, look: { x: lerp(0, -1, turn), y: 0 }, tear: 1, tilt: lerp(0, -.12, turn) });
  karanlik(g, [{ x: 540, y: 900, r: 800 }], .7);
  renk('#4a5a8a', 'multiply', .5);
});
cek(14.4, 16.3, t => {
  kamera(t, 14.4, 16.3, { z0: 1.15, z1: 1.3, shake: 3 });
  g.fillStyle = '#05070c'; g.fillRect(-200, -200, W + 400, H + 400);
  kapiYakin(560, 700);
  figur(g, { x: 300, y: 860 + 4.57 * 820, s: 820, kim: 'ECE', view: 'side', dir: 1, t, bl: 0, eye: lerp(1, 1.4, ss(14.8, 15.4, t)), brow: 1, headX: .05 });
  karanlik(g, [{ x: 560, y: 900, r: 650 }], .78);
  renk('#4a5a8a', 'multiply', .5);
});
cek(16.3, 22, t => {
  kamera(t, 16.3, 22, { z0: 1, z1: 1.05, shake: 6 });
  const K = koridor(t, .55);
  const k = easeIO(ss(16.4, 19, t));
  oturan({ x: 540 + Math.sin(t * 7) * 10 * (1 - k), floor: lerp(1500, 2000, k), s: lerp(170, 300, k), kim: 'ECE', t, bl: ECEb(t), eye: 1.3, brow: 1, look: { x: 0, y: -.4 }, tilt: -.12, barefoot: 1, arms: { l: { x: -.9, y: 1.7 }, r: { x: .9, y: 1.7 } } }, 1);
  karanlik(g, [{ x: K.vx, y: K.fy0 + K.dh * .5, r: K.dw * 1.4, a: .9 }, { x: 540, y: 1500, r: 500, a: .5 }], .9);
  renk('#4a5a8a', 'multiply', .35);
});

// ---------- SAHNE 2 · IŞIKLAR ----------
function sohbet2(t, o) {
  const msgs = [
    { type: 'voice', out: 1, dur: '0:07', seed: 3, ticks: 2, blue: 1, time: '18:47' },
    { type: 'voice', out: 0, dur: '0:07', seed: 8, prog: 1, time: '03:16' },
    { type: 'text', out: 0, text: 'O BEN DEĞİLİM.', big: 1, time: '03:17' },
  ];
  if (o.sent) msgs.push({ type: 'text', out: 1, text: 'kimsin', time: '03:18', ticks: 2, blue: 1 });
  if (o.reply) msgs.push({ type: 'text', out: 0, text: 'ışıkları yak. hepsini. sabaha kadar kapatma.', time: '03:18', alpha: o.replyA });
  return { clock: '03:18', status: o.status, statusCol: '#25d366', msgs, input: o.input, caret: o.caret };
}
cek(22, 27.2, t => {
  const word = 'kimsin', n = Math.floor(ss(22.4, 23.7, t) * word.length + .001);
  const sent = t > 24.0;
  telefonInsert(t, 22, 27.2, sohbet2(t, { input: sent ? '' : word.slice(0, n), caret: !sent && Math.floor(t * 3) % 2 === 0, sent, status: t > 24.3 && t < 25.6 ? 'yazıyor...' : 'çevrimiçi', reply: t > 25.6, replyA: ss(25.6, 25.75, t) }), { z0: 1, z1: 1.12, shake: 8 });
  renk('#5a6a9a', 'multiply', .25);
}, 640);
function kosuPlan(t, a, b, sw, bg, o = {}) {
  const on = t >= sw;
  kamera(t, a, b, { z0: 1, z1: 1.04, shake: 7 });
  bg(t);
  const k = ss(a, b, t);
  figur(g, { x: lerp(o.x0 || -100, o.x1 || 1180, k), y: o.y || 1690, s: o.s || 160, kim: 'ECE', view: 'side', dir: (o.x1 || 1180) > (o.x0 || -100) ? 1 : -1, walk: t * 9, t, bl: ECEb(t), eye: 1.2, brow: .9, barefoot: 1, lean: .08 });
  const fl = on && t < sw + .25 ? (Math.sin(t * 90) > 0 ? .5 : 0) : 0;
  if (!on || fl) karanlik(g, [{ x: 540, y: 1300, r: 500, a: .5 }], on ? .5 : .9);
  if (on && t < sw + .12) { g.fillStyle = 'rgba(255,240,210,.35)'; g.fillRect(-200, -200, W + 400, H + 400); }
  renk(on ? '#ffd9a0' : '#4a5a8a', on ? 'soft-light' : 'multiply', on ? .3 : .5);
}
cek(27.2, 28.7, t => kosuPlan(t, 27.2, 28.7, DATA.switch[0], tt => koridor(tt, .25), { x0: 1150, x1: -80, y: 1900, s: 230 }));
cek(28.7, 30.3, t => kosuPlan(t, 28.7, 30.3, DATA.switch[1], tt => salon(tt), { x0: -100, x1: 1150 }));
cek(30.3, 31.9, t => kosuPlan(t, 30.3, 31.9, DATA.switch[2], mutfak, { x0: 1150, x1: -100, y: 1700 }));
cek(31.9, 33.5, t => kosuPlan(t, 31.9, 33.5, DATA.switch[3], yatakOdasi, { x0: -100, x1: 1150, y: 1750 }));
cek(33.5, 35.1, t => dugmeYakin(t, 33.5, t >= DATA.switch[4]));
cek(35.1, 36.8, t => {
  kamera(t, 35.1, 36.8, { z0: 1.5, z1: 1.55, x: 90, y0: -156, shake: 2 });
  duvar('#8a7a64', '#5a4c3c'); komodin(540, 1150, '03:33', t, {});
  renk('#ffd9a0', 'soft-light', .3);
});
cek(36.8, 42.2, t => {
  kamera(t, 36.8, 42.2, { z0: 1, z1: 1.08, shake: 3 });
  koridor(t, .2);
  g.fillStyle = 'rgba(255,240,200,.18)'; g.fillRect(-200, -200, W + 400, H + 400);
  const sit = easeIO(ss(38.5, 40.5, t));
  oturan({ x: 540, floor: 1960, s: 300, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), brow: .5, look: { x: 0, y: .3 }, breathAmp: 4, breathRate: 6, barefoot: 1, tilt: -.05, arms: { l: { x: -.8, y: 1.5 }, r: { x: .8, y: 1.5 } } }, sit);
  renk('#ffd9a0', 'soft-light', .3);
});

// ---------- SAHNE 3 · SABAH, ISLAK İZLER ----------
cek(42.2, 46.2, t => {
  kamera(t, 42.2, 46.2, { z0: 1.05, z1: 1, shake: 3 });
  sahanlik(t);
  const gap = lerp(60, 220, ss(42.4, 43.6, t)), full = ss(44.6, 45.6, t);
  const dw = 640, dx = 220, open = lerp(gap, dw, full);
  g.fillStyle = '#20140c'; g.fillRect(dx - 30, 300, dw + 60, 1250);
  g.fillStyle = '#0e0905'; g.fillRect(dx, 320, open, 1220);
  g.save(); g.beginPath(); g.rect(dx, 320, open, 1220); g.clip();
  figur(g, { x: dx + open / 2 + lerp(-120, 0, full), y: 1540, s: lerp(240, 220, full), kim: 'ECE', t, bl: ECEb(t), look: { x: 0, y: .7 }, brow: .6, eye: 1.1 });
  g.restore();
  g.fillStyle = '#4a2e1c'; g.fillRect(dx + open, 320, dw - open + 10, 1220);
  g.strokeStyle = '#2e1c10'; g.lineWidth = 12; g.strokeRect(dx + open + 40, 380, Math.max(0, dw - open - 80), 480);
  if (full < .5) { g.strokeStyle = '#b8b0a0'; g.lineWidth = 6; g.beginPath(); g.moveTo(dx + open - 10, 700); g.quadraticCurveTo(dx + open + 20, 740 + 30 * (1 - ss(43.6, 44.6, t)), dx + open + 60, 690); g.stroke(); }
  renk('#e8dcc8', 'soft-light', .3);
});
cek(46.2, 52.2, t => {
  // tepeden: paspastan merdivene giden ıslak izler
  const pan = ss(46.4, 51.8, t);
  kamera(t, 46.2, 52.2, { z0: 1, z1: 1.05, y0: lerp(-500, 400, pan), y1: lerp(-500, 400, pan), shake: 2 });
  g.fillStyle = '#b9b2a6'; g.fillRect(-300, -1200, W + 600, H + 2400);
  g.strokeStyle = 'rgba(90,80,70,.2)'; g.lineWidth = 4; for (let i = 0; i < 20; i++) { g.beginPath(); g.moveTo(-300, -1000 + i * 180); g.quadraticCurveTo(540, -1100 + i * 190, 1400, -950 + i * 170); g.stroke(); }
  g.fillStyle = '#5a3a2a'; rr(g, 260, 2050, 560, 260, 20); g.fill(); // paspas
  g.fillStyle = '#4a2e1c'; g.fillRect(140, 2310, 800, 300); // kapı eşiği
  for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#a8a194' : '#c4bdb0'; g.fillRect(560, -1000 + i * 110, 520, 110); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(560, -900 + i * 110, 520, 10); }
  for (let i = 0; i < 12; i++) { const y = 1950 - i * 190, x = 470 + (i % 2) * 70 + i * 22; ayakIzi(x, y, 1.6, .15, 1); }
  const hk = ss(48.6, 49.6, t);
  g.save(); g.translate(lerp(-300, 380, hk), 1290); g.rotate(.2);
  g.fillStyle = '#6e1f2b'; g.fillRect(-520, -70, 420, 150); g.fillStyle = '#e6b391'; g.beginPath(); g.ellipse(-60, 0, 80, 60, 0, 0, TAU); g.fill(); rr(g, -20, -18, 130, 34, 17); g.fill(); g.restore();
  renk('#e8dcc8', 'soft-light', .3);
});
function cati(t, o = {}) {
  sahanlik(t);
  g.fillStyle = '#5a4030'; g.fillRect(820, 160, 230, 520); g.fillStyle = '#3a2416'; g.fillRect(845, 190, 180, 470);
  g.fillStyle = 'rgba(160,80,40,.6)'; for (let i = 0; i < 20; i++) { const r = rng(i); g.beginPath(); g.arc(850 + r() * 170, 200 + r() * 440, 6 + r() * 14, 0, TAU); g.fill(); }
  merdivenBasamak(60, 1560, 800, 680, 9);
  for (let i = 0; i < 6; i++) { const x = 140 + i * 95, y = 1560 - (x - 60) * (880 / 740) + (o.yari ? 0 : 0); ayakIzi(x + 40, y - 6, .7, 1.4, 1, 0); }
  g.fillStyle = '#7a7266'; g.fillRect(650, 680, 30, 900);
  ayakIzi(662, 790, .7, 1.4, 1, 1);
}
cek(52.2, 56.2, t => {
  kamera(t, 52.2, 56.2, { z0: 1, z1: 1.1, shake: 3 });
  cati(t);
  const k = ss(52.3, 55.2, t), x = lerp(-80, 260, k), y = 1560 - (Math.max(60, x) - 60) * (880 / 740);
  figur(g, { x, y: Math.min(1660, y + 10), s: 120, kim: 'ECE', view: k < 1 ? 'side' : 'front', dir: 1, walk: k < 1 ? t * 3.5 : null, t, bl: ECEb(t), look: { x: 1, y: -1 }, brow: .6, barefoot: 1 });
  renk('#e8dcc8', 'soft-light', .3);
});
function remziMerdiven(t, a, b, o = {}) {
  kamera(t, a, b, { z0: o.z0 || 1, z1: o.z1 || 1.06, shake: 3 });
  sahanlik(t);
  g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 6; i++) g.fillRect(-200, 1100 + i * 150, W + 400, 12);
  figur(g, { x: 540, y: 780 + 4.57 * 280, s: 280, kim: 'REMZI', t, m: mouth('REMZI', t), bl: REMb(t), look: o.look || { x: .4, y: -.6 }, brow: o.brow || .3, arms: { r: { x: .7, y: 1.2 }, l: o.uzat ? { x: -.9, y: .9 } : null } });
  // paspas sopası ve kova
  const hx = o.uzat ? 540 - .9 * 280 : 540 + .7 * 280, hy = 780 + (o.uzat ? .9 : 1.2) * 280;
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 16; g.beginPath(); g.moveTo(hx, hy - 300); g.lineTo(hx + (o.uzat ? -200 : 30), hy + 700); g.stroke();
  g.fillStyle = '#4a6a8a'; g.beginPath(); g.moveTo(760, 1700); g.lineTo(980, 1700); g.lineTo(950, 1950); g.lineTo(790, 1950); g.fill();
  renk('#e8dcc8', 'soft-light', .25);
}
cek(56.2, 58.0, t => remziMerdiven(t, 56.2, 58.0));
cek(58.0, 61.5, t => {
  kamera(t, 58.0, 61.5, { z0: 1.1, z1: 1.05, shake: 5 });
  sahanlik(t);
  const turn = ss(58.0, 58.3, t);
  figur(g, { x: 540, y: 820 + 4.57 * 340, s: 340, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), view: turn < .5 ? 'back' : 'front', eye: 1.3, brow: .8, look: { x: 0, y: .6 }, arms: { l: { x: -.1, y: 1.0 } } });
  renk('#e8dcc8', 'soft-light', .25);
});
cek(61.5, 64.8, t => remziMerdiven(t, 61.5, 64.8, { z0: 1.06, z1: 1.14, look: { x: lerp(.4, 0, ss(62.6, 63, t)), y: lerp(-.6, -.2, ss(62.6, 63, t)) }, brow: .6, uzat: t > 63.2 }));
cek(64.8, 68.0, t => {
  kamera(t, 64.8, 68.0, { z0: 1.05, z1: 1.12, shake: 4 });
  sahanlik(t);
  figur(g, { x: 540, y: 820 + 4.57 * 340, s: 340, kim: 'ECE', t, m: mouth('ECE', t), bl: ECEb(t), eye: 1.1, brow: -.7, look: { x: 0, y: .7 }, arms: { l: { x: -.9, y: 1.2 }, r: { x: .7, y: 1.5 } } });
  renk('#e8dcc8', 'soft-light', .25);
});
cek(68.0, 70.2, t => {
  kamera(t, 68.0, 70.2, { z0: 1, z1: 1.03, shake: 3 });
  duvar('#6a6050', '#3a3228');
  merdivenBasamak(1000, 700, 80, 1300, 10);
  const k = ss(68.1, 70.1, t), x = lerp(820, 300, k), y = 700 + (1000 - x) * (600 / 920);
  figur(g, { x, y: y + 6, s: 90, kim: 'REMZI', view: 'side', dir: -1, walk: t * 3.6, t, beads: 'r', bl: REMb(t) });
  figur(g, { x: 1000, y: 690, s: 100, kim: 'ECE', t, bl: ECEb(t), look: { x: -1, y: 1 }, brow: -.4 });
  renk('#e8dcc8', 'soft-light', .25);
});

// ---------- SAHNE 4 · FOTOĞRAF ----------
function fotoMerdiven(x, y, w, h, adim, yuz) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.translate(x, y); g.scale(w / 1080, h / 1440);
  const gr = g.createLinearGradient(0, 0, 0, 1440); gr.addColorStop(0, '#120f0c'); gr.addColorStop(.45, '#5e564a'); gr.addColorStop(1, '#a8a092');
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1440);
  for (let i = 0; i < 12; i++) { const yy = 1440 - i * 95, ww = 1000 - i * 50; g.fillStyle = i % 2 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.06)'; g.fillRect(540 - ww / 2, yy - 95, ww, 95); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(540 - ww / 2, yy - 95, ww, 6); }
  for (let i = 0; i < 8; i++) ayakIzi(500 + (i % 2) * 60, 1380 - i * 95, 1.1 - i * .07, 0, .9);
  g.fillStyle = '#0a0806'; g.fillRect(340, 0, 400, 300);
  const sy = 420 + adim * 95, sc = .55 + adim * .09;
  figur(g, { x: 540, y: sy, s: 70 * sc / .55, kim: 'NEVIN', t: 0, bl: 0, smile: .6, wide: yuz || 0, taklit: !!yuz, barefoot: 1 });
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, 1080, 1440);
  g.restore();
}
cek(70.2, 72.3, t => {
  kamera(t, 70.2, 72.3, { z0: 1, z1: 1.06, shake: 3 });
  sahanlik(t);
  const up = ss(70.4, 71.3, t);
  figur(g, { x: 540, y: 760 + 4.57 * 330, s: 330, kim: 'ECE', t, bl: ECEb(t), brow: -.3, look: { x: .3, y: -.5 }, phone: 'r', phoneGlow: 1, arms: { r: { x: lerp(.6, .3, up), y: lerp(1.6, .2, up) } } });
  if (t > 72.0 && t < 72.15) { g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(-200, -200, W + 400, H + 400); }
  renk('#e8dcc8', 'soft-light', .25);
});
function galeri(t, a, b, adim, yuz, z0, z1, ty) {
  g.fillStyle = '#000'; g.fillRect(-200, -200, W + 400, H + 400);
  const k = easeIO(ss(a + .3, b - .3, t)), z = lerp(z0, z1, k);
  g.save(); g.translate(W / 2 + wob(t, 2) * 5, H / 2 + lerp(0, ty, k)); g.scale(z, z); g.translate(-W / 2, -H / 2);
  fotoMerdiven(0, 240, 1080, 1440, adim, yuz);
  g.restore();
  g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, W, 150);
  yazi(g, 'Bugün 08:12', W / 2, 90, 36, { weight: 400, stroke: false, color: '#ddd' });
}
cek(72.3, 79.2, t => galeri(t, 72.3, 79.2, 0, 0, 1, 2.8, 1736));
cek(79.2, 82.2, t => {
  kamera(t, 79.2, 82.2, { z0: 1, z1: 1.06, shake: 3 });
  cati(t);
  figur(g, { x: 260, y: 1660, s: 120, kim: 'ECE', t, bl: ECEb(t), look: { x: .6, y: -1 }, brow: .8, eye: 1.2, barefoot: 1 });
  renk('#e8dcc8', 'soft-light', .3);
});
cek(82.2, 86, t => {
  const punch = t > 84.4 ? 1 + .25 * ss(84.4, 84.6, t) : 1;
  g.save(); g.translate(W / 2, H / 2); g.scale(punch, punch); g.translate(-W / 2, -H / 2);
  galeri(t, 82.2, 86, 1.6, ss(84.2, 85, t), 2.6, 3.4, 1877);
  g.restore();
  if (t > 84.4) { g.fillStyle = `rgba(90,0,0,${.25 * ss(84.4, 85, t)})`; g.fillRect(0, 0, W, H); }
});
cek(86, 90.01, t => bitisKarti(t, 86, 'Bölüm 3: Kullanılmayan Numara', 88.6));
