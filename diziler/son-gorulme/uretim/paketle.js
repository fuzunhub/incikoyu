// Yayın paketi: node paketle.js <bölüm_no>
// SADECE kullanıcı bölüm videosunu onayladıktan sonra çalıştırılır.
// Çıktı: ../yayin/bolum-NN/ {story.mp4, kapak-tiktok.jpg, kapak-instagram.jpg, kapak-youtube.jpg}
const {chromium}=require('playwright');const {spawn,execFileSync}=require('child_process');const fs=require('fs');const path=require('path');
const no=+process.argv[2];const NO=String(no).padStart(2,'0');
const P=Object.assign({no},JSON.parse(fs.readFileSync(path.join(__dirname,'paket.json'),'utf8'))[no]);
const SRC=path.join(__dirname,'..','cikti',`bolum-${NO}.mp4`);
const OUT=path.join(__dirname,'..','yayin',`bolum-${NO}`);const T=path.join(__dirname,'tmp',`paket${NO}`);
fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(T,{recursive:true});
const ff=a=>execFileSync('ffmpeg',['-y','-v','error',...a]);
(async()=>{
 const b=await chromium.launch();
 { // kapak arka planı: altyazısız, doğrudan sahne motorundan
   const s=await b.newPage({viewport:{width:1080,height:1920}});s.on('pageerror',e=>console.log('ERR',e.message));
   await s.goto('file://'+__dirname+`/bolum${NO}.html`);
   const d=await s.evaluate(t=>{window.NOSUB=true;render(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},P.kapak);
   fs.writeFileSync(path.join(T,'kare.jpg'),Buffer.from(d.split(',')[1],'base64'));await s.close(); }const p=await b.newPage({viewport:{width:1280,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/paket.html');
 const kare='data:image/jpeg;base64,'+fs.readFileSync(path.join(T,'kare.jpg')).toString('base64');
 const al=async(fn)=>Buffer.from((await p.evaluate(fn)).split(',')[1],'base64');
 const dikey=await al(`(async()=>{const i=await resimYukle(${JSON.stringify(kare)});await dikeyKapak(i,${JSON.stringify(P)});return cv.toDataURL('image/jpeg',.93)})()`);
 fs.writeFileSync(path.join(OUT,'kapak-tiktok.jpg'),dikey);fs.writeFileSync(path.join(OUT,'kapak-instagram.jpg'),dikey);
 fs.writeFileSync(path.join(OUT,'kapak-youtube.jpg'),await al(`(async()=>{const i=await resimYukle(${JSON.stringify(kare)});await yatayKapak(i,${JSON.stringify(P)});return cv.toDataURL('image/jpeg',.93)})()`));
 fs.writeFileSync(path.join(T,'rozet.png'),await al(`(()=>{storyRozet();return cv.toDataURL('image/png')})()`));
 const enc=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','24','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p',path.join(T,'kart.mp4')]);
 for(let f=0;f<43;f++)enc.stdin.write(await al(`(()=>{storyKart(${f/24},${JSON.stringify(P)});return cv.toDataURL('image/jpeg',.93)})()`));
 enc.stdin.end();await new Promise(r=>enc.on('close',r));await b.close();
 // story: 4 parça + kapanış kartı; ses son parçadan kart bitene kadar sürer
 const S=P.story;let fv='',fa='',lv='',la='';
 S.forEach(([a,z],i)=>{fv+=`[0:v]trim=${a}:${z},setpts=PTS-STARTPTS[v${i}];`;lv+=`[v${i}]`;
   const az=i===S.length-1?P.story_ses_son:z;fa+=`[0:a]atrim=${a}:${az},asetpts=PTS-STARTPTS[a${i}];`;la+=`[a${i}]`;});
 const vsum=S.reduce((s,[a,z])=>s+z-a,0),dur=vsum+1.8;
 const fc=fv+`${lv}concat=n=${S.length}:v=1:a=0,format=yuv420p[vm];[vm][2:v]overlay=0:0[vo];[1:v]trim=0:1.8,setpts=PTS-STARTPTS,format=yuv420p[vk];[vo][vk]concat=n=2:v=1:a=0[v];`+
   fa+`${la}concat=n=${S.length}:v=0:a=1,apad,atrim=0:${dur},afade=t=out:st=${dur-0.4}:d=0.4[a]`;
 ff(['-i',SRC,'-i',path.join(T,'kart.mp4'),'-i',path.join(T,'rozet.png'),'-filter_complex',fc,'-map','[v]','-map','[a]',
   '-c:v','libx264','-crf','20','-preset','slow','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t',String(dur),'-movflags','+faststart',path.join(OUT,'story.mp4')]);
 console.log('paket hazır:',OUT,'story',dur.toFixed(1)+'sn');
})();
