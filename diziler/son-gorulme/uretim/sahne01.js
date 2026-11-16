// SON GÖRÜLME · Bölüm 1 "Çevrimiçi" · çekim listesi
// ---------- çekimler ----------
window.SON_KART = 116.4;

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

