(()=>{
'use strict';
const BLUE='#2b16f2',BG='#dedde1',DB='yearbloom-personal',STORE='entries';
const PALETTE=['#2b16f2','#47a936','#12a9d6','#f28c18','#e24f75'];
const templates=[
'M22 35V17M22 17c-7 0-10-9-3-11 4-1 6 2 6 6 1-4 4-6 7-4 5 3 2 10-5 10M18 27c-4-1-6-4-5-7M26 26c5-1 7-5 5-8',
'M22 35V20M15 21c-5-2-4-9 2-10 4-1 6 2 6 5 2-5 6-7 10-4 4 4 0 10-6 10',
'M22 35V18M16 18c-5-4-1-10 4-9 3 1 3 4 2 6 2-6 8-8 11-4 2 4-2 8-7 8M16 27c-4-4-2-8 2-9M28 27c4-4 2-8-2-9',
'M22 35V18M22 18c0-6 4-9 10-9M32 9c-5 0-8 3-10 9M18 26c-7-1-8-8-3-10 5-2 7 3 5 7-1 2-1 2-2 3Z',
'M22 35V21M22 21c-9-3-8-13 0-13s9 10 0 13ZM22 15c-3-2-4-4-3-7',
'M22 35c-7-5-10-9-7-14 3-6 10-5 11 0 2-6 9-6 11-1 2 6-7 12-15 15ZM19 12c2-4 7-5 10-1',
'M10 27c2-7 8-11 15-11 7 0 11 4 12 11M14 27v5M21 27v5M28 27v5M34 27v5M19 16c-1-5 2-8 7-8 5 1 6 5 4 8',
'M14 29c0-6 5-10 10-10 6 0 10 4 10 9 0 4-3 6-7 6H19c-3 0-5-2-5-5ZM18 21c-2-5 1-9 6-9 5 0 8 4 7 9',
'M11 24c2-8 10-13 18-11 6 1 9 7 6 12-4 7-14 8-21 5M29 13c2-3 5-4 8-3',
'M22 35V19M14 19h16M18 19c-2-4-1-8 3-11M26 19c2-4 1-8-3-11M14 27c3-4 6-6 8-6 3 0 6 2 9 6',
'M13 20c-2-6 3-10 8-8 2-6 11-5 12 2 6 1 6 9 0 10-3 5-11 7-17 3-4 1-6-3-3-7Z',
'M22 35V20M14 20c0-6 4-10 8-10 5 0 9 4 8 10M13 30c3-4 6-6 9-6s7 2 10 6',
'M15 34c0-6 5-10 10-10 5 0 9 4 9 9M19 24c-1-5 2-8 7-8 5 1 6 5 4 8',
'M14 30c0-5 4-9 9-9 5 0 9 4 9 9M17 21c-2-7 9-11 12-5 1 2 1 4 0 6',
'M22 35V20M14 20c0-6 4-10 8-10 5 0 9 4 8 10M18 13l4-5 4 5',
'M22 35V17M15 17c-4-5 1-10 6-8 2 1 2 3 1 6 2-5 7-7 10-3 3 5-2 9-8 8',
'M22 34V18M14 18c2-6 7-9 12-7 5 2 7 8 3 12M17 18c-5-2-7-7-4-10',
'M12 31c0-7 5-12 11-12 7 0 11 5 11 11M18 19c-1-5 2-8 7-8 5 1 6 5 4 8M15 31h20',
'M22 34V18M15 18c-5-3-3-10 3-10 4 0 5 3 4 6 1-4 5-7 9-5 5 3 2 10-4 10',
'M22 34V21M17 21c-6-2-5-9 1-10 4-1 6 2 5 5 2-4 7-6 10-2 3 5-2 9-7 8',
'M22 35V18M18 18c-6-3-2-11 4-10 5 0 7 5 4 9M26 18c6-2 7-8 2-10',
'M12 28c2-7 7-11 13-11 6 0 10 4 11 11M16 28v5M22 28v5M28 28v5M34 28v5',
'M22 35V18M15 18c0-5 3-9 7-9 4 0 8 4 7 9M13 28c3-4 6-6 9-6 4 0 7 2 10 6',
'M22 34V20M16 20c-6-3-3-10 2-10 3 0 5 2 4 5 1-4 5-7 9-5 5 3 2 9-5 10'
];
function hash(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function doodle(seed,size=30,color=BLUE){const d=templates[hash(seed)%templates.length];return `<svg viewBox="0 0 44 44" width="${size}" height="${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function openDb(){return new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'date'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function entries(){const d=await openDb(),tx=d.transaction(STORE,'readonly'),r=tx.objectStore(STORE).getAll();const out=await new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>no(r.error)});d.close();return out}
function modeColor(entry,seed,mode){if(mode==='blue')return BLUE;if(entry?.mood){const map={1:'#2b16f2',2:'#12a9d6',3:'#47a936',4:'#f28c18',5:'#e24f75'};return map[entry.mood]||BLUE}return PALETTE[hash(seed)%PALETTE.length]}
function yearDays(year){const out=[],d=new Date(year,0,1);while(d.getFullYear()===year){out.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1)}return out}
function currentYear(){try{return JSON.parse(localStorage.yearbloomSettings||'{}').year||new Date().getFullYear()}catch{return new Date().getFullYear()}}
async function enhanceGarden(){const garden=document.querySelector('.v2-garden,.garden');if(!garden||garden.dataset.v3==='1')return;garden.dataset.v3='1';const all=await entries();const map=new Map(all.map(e=>[e.date,e]));garden.querySelectorAll('.plant,.v2-garden-cell').forEach((b,i)=>{const day=b.dataset.v||String(i);if(b.disabled){b.innerHTML='<i class="v3-dot"></i>';return}const entry=map.get(day);b.innerHTML=doodle(day,28,modeColor(entry,day,'blue'));});const screen=garden.closest('.screen');if(screen&&!screen.querySelector('.v3-wallpaper-trigger')){const btn=document.createElement('button');btn.className='v3-wallpaper-trigger';btn.dataset.v3Wallpaper='1';btn.innerHTML='▣ <span>Lock Screen</span>';garden.insertAdjacentElement('afterend',btn)}}
function settingsCard(){const settings=document.querySelector('.settings-screen,.v2-settings-screen,.screen');if(!settings||settings.querySelector('.v3-lock-card'))return;if(!settings.querySelector('.settings'))return;const card=document.createElement('div');card.className='card settings v3-lock-card';card.innerHTML='<div class="stack"><b>Pantalla de bloqueo</b><p>Genera una imagen del jardín actual para usarla como fondo de bloqueo del iPhone.</p><div class="buttons"><button class="secondary" data-v3-wallpaper="1">Abrir Lock Screen</button></div></div>';settings.querySelector('.settings').insertAdjacentElement('afterend',card)}
function svgWallpaper(year,all,mode='blue',clockSafe=true){const W=1179,H=2556,top=clockSafe?300:100,left=80,right=80,cols=13,cell=(W-left-right)/(cols-1),rowGap=82,days=yearDays(year),today=new Date().toISOString().slice(0,10),map=new Map(all.map(e=>[e.date,e]));let body='';days.forEach((day,i)=>{const col=i%cols,row=Math.floor(i/cols),x=left+col*cell,y=top+row*rowGap;if(y>H-120)return;if(day>today){body+=`<circle cx="${x}" cy="${y}" r="4" fill="${BLUE}" opacity=".9"/>`;return}const entry=map.get(day),color=modeColor(entry,day,mode),d=templates[hash(day)%templates.length],scale=1.25+(hash(day)%3)*.08;body+=`<g transform="translate(${x-27} ${y-27}) scale(${scale})"><path d="${d}" fill="none" stroke="${color}" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"/></g>`});return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${BG}"/>${body}</svg>`}
async function drawPreview(canvas,mode,clockSafe){const year=currentYear(),all=await entries(),svg=svgWallpaper(year,all,mode,clockSafe),blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});canvas.width=1179;canvas.height=2556;canvas.getContext('2d').drawImage(img,0,0);URL.revokeObjectURL(url);return canvas}
async function openWallpaper(){document.querySelector('.v3-wallpaper-modal')?.remove();const modal=document.createElement('div');modal.className='v3-wallpaper-modal';modal.innerHTML=`<div class="v3-wallpaper-sheet"><div class="v3-handle"></div><div class="v3-wallpaper-head"><div><h2>Lock Screen</h2><p>Se actualiza con tu jardín del año actual.</p></div><button data-v3-close="1">×</button></div><div class="v3-toolbar"><button class="active" data-v3-mode="blue">Azul</button><button data-v3-mode="multi">Color</button><label><input type="checkbox" data-v3-clock checked> espacio reloj</label></div><canvas class="v3-wallpaper-canvas"></canvas><div class="v3-wallpaper-actions"><button data-v3-share="1">Compartir</button><button data-v3-save="1">Guardar PNG</button></div><p class="v3-help">iOS no permite que una PWA cambie automáticamente tu fondo. Esta vista se sincroniza con YearBloom y genera el PNG actualizado para que lo selecciones como pantalla de bloqueo.</p></div>`;document.body.appendChild(modal);const canvas=modal.querySelector('canvas');modal.dataset.mode='blue';await drawPreview(canvas,'blue',true)}
async function blobFromCanvas(canvas){return await new Promise(ok=>canvas.toBlob(ok,'image/png',1))}
async function saveCanvas(canvas){const blob=await blobFromCanvas(canvas),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`yearbloom-lockscreen-${currentYear()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
async function shareCanvas(canvas){const blob=await blobFromCanvas(canvas),file=new File([blob],`yearbloom-lockscreen-${currentYear()}.png`,{type:'image/png'});if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'YearBloom Lock Screen'});return}await saveCanvas(canvas)}
async function refreshModal(){const modal=document.querySelector('.v3-wallpaper-modal');if(!modal)return;const mode=modal.dataset.mode||'blue',clock=modal.querySelector('[data-v3-clock]')?.checked!==false;await drawPreview(modal.querySelector('canvas'),mode,clock)}
function enhance(){enhanceGarden();settingsCard()}
document.addEventListener('click',async e=>{const w=e.target.closest('[data-v3-wallpaper]');if(w){await openWallpaper();return}if(e.target.closest('[data-v3-close]')){document.querySelector('.v3-wallpaper-modal')?.remove();return}const m=e.target.closest('[data-v3-mode]');if(m){const modal=m.closest('.v3-wallpaper-modal');modal.dataset.mode=m.dataset.v3Mode;modal.querySelectorAll('[data-v3-mode]').forEach(b=>b.classList.toggle('active',b===m));await refreshModal();return}if(e.target.closest('[data-v3-save]')){await saveCanvas(document.querySelector('.v3-wallpaper-canvas'));return}if(e.target.closest('[data-v3-share]')){await shareCanvas(document.querySelector('.v3-wallpaper-canvas'));return}},true);
document.addEventListener('change',async e=>{if(e.target.matches('[data-v3-clock]'))await refreshModal()});
const obs=new MutationObserver(()=>requestAnimationFrame(async()=>{await enhance();if(document.querySelector('.v3-wallpaper-modal'))await refreshModal()}));obs.observe(document.getElementById('app'),{childList:true,subtree:true});window.addEventListener('DOMContentLoaded',()=>setTimeout(enhance,120));document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.querySelector('.v3-wallpaper-modal'))refreshModal()});
})();