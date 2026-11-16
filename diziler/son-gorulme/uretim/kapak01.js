// Bölüm 1 kapağı (1 sn giriş + Instagram kapak karesi)
function kapak(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const punch = 1 + .06 * (1 - ss(0, .25, t)) + .03 * t;
  const gl = (t < .08 || (t > .45 && t < .5) || (t > .78 && t < .81)) ? 1 : 0;
  g.save();
  g.translate(W / 2, H / 2); g.scale(punch, punch); g.translate(-W / 2, -H / 2);
  // gözetleme deliğinde taklit nine
  g.translate(0, -130);
  peepholeCiz(.9, { x: 450, y: 430 + 4.57 * 300, s: 300, kim: 'NEVIN', t: 0, m: 0, smile: .6, wide: .85, bl: 0, eye: 1.18, taklit: 1, look: { x: 0, y: 0 }, barefoot: 1 }, 1.18);
  g.restore();
  // kırmızı hale
  { const rg = g.createRadialGradient(W / 2, 830, 380, W / 2, 830, 640); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(.25, 'rgba(200,10,20,.45)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
  // kırmızı ton + üstte/altta karartma (yazılar için)
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#b04040'; g.globalAlpha = .45; g.fillRect(0, 0, W, H); g.restore();
  let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(0,0,0,.95)'); gr.addColorStop(.28, 'rgba(0,0,0,0)'); gr.addColorStop(.62, 'rgba(0,0,0,0)'); gr.addColorStop(.82, 'rgba(0,0,0,.92)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // bildirim balonu
  const ny = 330 - 40 * (1 - ss(0, .2, t));
  g.save(); g.globalAlpha = ss(0, .15, t);
  g.fillStyle = 'rgba(32,44,51,.94)'; rr(g, 120, ny, 840, 150, 34); g.fill();
  g.save(); g.beginPath(); g.arc(205, ny + 75, 48, 0, TAU); g.clip(); g.fillStyle = '#c9a36a'; g.fillRect(150, ny + 20, 110, 110);
  figur(g, { x: 205, y: ny + 75 + 4.57 * 58 + 8, s: 58, kim: 'NEVIN', smile: .5, noLegs: true, t: 0 }); g.restore();
  g.fillStyle = '#e9edef'; g.font = '700 42px DejaVu Sans'; g.textAlign = 'left'; g.fillText('Ninem', 280, ny + 62);
  cicek(g, 280 + g.measureText('Ninem').width + 26, ny + 48, 15);
  g.fillStyle = '#25d366'; g.beginPath(); g.arc(292, ny + 104, 9, 0, TAU); g.fill();
  g.font = '400 34px DejaVu Sans'; g.fillText('çevrimiçi · 03:17', 312, ny + 116);
  g.fillStyle = '#8696a0'; g.textAlign = 'right'; g.font = '400 30px DejaVu Sans'; g.fillText('şimdi', 920, ny + 62);
  g.restore();
  // başlık
  const ty = 1360, sl = 1 + .5 * (1 - ss(.08, .22, t));
  g.save(); g.translate(W / 2, ty); g.scale(sl, sl); g.translate(-W / 2, -ty);
  const off = gl ? 14 : 4;
  yazi(g, 'SON', W / 2 - off, ty - 105, 150, { font: 'DejaVu Serif', color: 'rgba(255,0,40,.8)', stroke: false, spacing: 30 });
  yazi(g, 'SON', W / 2 + off, ty - 105, 150, { font: 'DejaVu Serif', color: 'rgba(0,220,255,.6)', stroke: false, spacing: 30 });
  yazi(g, 'SON', W / 2, ty - 105, 150, { font: 'DejaVu Serif', color: '#f4efe6', stroke: false, spacing: 30 });
  yazi(g, 'GÖRÜLME', W / 2 - off, ty + 45, 150, { font: 'DejaVu Serif', color: 'rgba(255,0,40,.8)', stroke: false, spacing: 6 });
  yazi(g, 'GÖRÜLME', W / 2 + off, ty + 45, 150, { font: 'DejaVu Serif', color: 'rgba(0,220,255,.6)', stroke: false, spacing: 6 });
  yazi(g, 'GÖRÜLME', W / 2, ty + 45, 150, { font: 'DejaVu Serif', color: '#f4efe6', stroke: false, spacing: 6 });
  g.restore();
  // 1. BÖLÜM rozeti
  g.save(); g.globalAlpha = ss(.15, .3, t);
  g.fillStyle = '#c4161c'; rr(g, W / 2 - 190, ty + 150, 380, 92, 12); g.fill();
  yazi(g, '1. BÖLÜM', W / 2, ty + 198, 56, { stroke: false, spacing: 8, color: '#fff' });
  g.restore();
  yazi(g, 'Ölüler mesaj atmaz. Peki bu kim?', W / 2, ty + 310, 40, { weight: 400, stroke: false, color: '#d9d2c8', alpha: ss(.25, .4, t) });
  // tarama çizgileri + glitch şeritleri
  g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2);
  if (gl) { const r = rng(Math.floor(t * 100)); for (let i = 0; i < 6; i++) { const y = r() * H, h = 10 + r() * 50; g.drawImage(cv, 0, y, W, h, (r() - .5) * 80, y, W, h); } }
  sonIslem(g, t, { vig: .8, grain: .1 });
}
window.render = kapak;
