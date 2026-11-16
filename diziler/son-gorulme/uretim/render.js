// Bölüm 1'i render eder: node render.js  -> ../cikti/bolum-01.mp4
const {chromium}=require('playwright');const {spawn,execFileSync}=require('child_process');const fs=require('fs');const path=require('path');
const FPS=24,SURE=120,N=FPS*SURE,PAR=4,TMP=path.join(__dirname,'tmp');fs.mkdirSync(TMP,{recursive:true});
async function parca(b,i){const a=Math.floor(N*i/PAR),z=Math.floor(N*(i+1)/PAR);
 const out=path.join(TMP,`p${i}.mp4`);
 const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p',out]);
 const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/bolum01.html');
 for(let f=a;f<z;f++){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.93)},f/FPS);
  if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));
  if((f-a)%240===0)console.log(`parça ${i}: ${f-a}/${z-a}`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));return out;}
(async()=>{const b=await chromium.launch();const t0=Date.now();
 const outs=await Promise.all([...Array(PAR).keys()].map(i=>parca(b,i)));await b.close();
 fs.writeFileSync(path.join(TMP,'liste.txt'),outs.map(o=>`file '${o}'`).join('\n'));
 const dst=path.join(__dirname,'..','cikti','bolum-01.mp4');fs.mkdirSync(path.dirname(dst),{recursive:true});
 execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',path.join(TMP,'liste.txt'),'-i',path.join(__dirname,'ses01.wav'),
  '-c:v','copy','-af','apad','-c:a','aac','-b:a','192k','-t',String(SURE),'-movflags','+faststart',dst]);
 console.log('bitti',dst,((Date.now()-t0)/1000).toFixed(0)+'s');})();
