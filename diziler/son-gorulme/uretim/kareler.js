// kullanım: node kareler.js out_dir t1 t2 ...
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
const NO=String(process.env.BOLUM||1).padStart(2,'0');await p.goto('file://'+__dirname+'/bolum'+NO+'.html');
const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
for(const t of process.argv.slice(3)){const d=await p.evaluate(t=>{render(+t);return document.getElementById('c').toDataURL('image/jpeg',.85)},t);
fs.writeFileSync(`${out}/k_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));}
await b.close();})();
