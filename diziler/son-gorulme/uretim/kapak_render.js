const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+__dirname+'/kapak01.html');
const out=__dirname+'/../cikti/';
const jpg=await p.evaluate(()=>{render(.95);return document.getElementById('c').toDataURL('image/jpeg',.95)});
fs.writeFileSync(out+'bolum-01-kapak.jpg',Buffer.from(jpg.split(',')[1],'base64'));
const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','24','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','19','-pix_fmt','yuv420p',__dirname+'/tmp/kapak.mp4']);
for(let f=0;f<24;f++){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.93)},f/24);ff.stdin.write(Buffer.from(d.split(',')[1],'base64'));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('ok');})();
