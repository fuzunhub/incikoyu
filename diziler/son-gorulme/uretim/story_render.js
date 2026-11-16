const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
const T=__dirname+'/tmp/';fs.mkdirSync(T,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+__dirname+'/story01.html');
const png=await p.evaluate(()=>{rozet();return document.getElementById('c').toDataURL('image/png')});
fs.writeFileSync(T+'rozet.png',Buffer.from(png.split(',')[1],'base64'));
const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','24','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p',T+'kart.mp4']);
for(let f=0;f<43;f++){const d=await p.evaluate(t=>{kart(t);return document.getElementById('c').toDataURL('image/jpeg',.93)},f/24);ff.stdin.write(Buffer.from(d.split(',')[1],'base64'));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('ok');})();
