(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* ---------- WHATSAPP NUMBER · single source of truth ----------
   Change WA_NUMBER and every wa.me link on the page updates on load.
   Keep the visible +234 label in the footer contact block in sync. */
var WA_NUMBER='2349122356353';
$$('a[href*="wa.me/"]').forEach(function(a){a.href=a.href.replace(/wa\.me\/\d+/, 'wa.me/'+WA_NUMBER);});
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var touch=matchMedia('(pointer: coarse)').matches;

/* ---------- SMOOTH SCROLL WRAP ---------- */
var native=touch||reduce; /* wheel easing only for mouse users; layout is always native */
if('scrollRestoration' in history){history.scrollRestoration='manual';}
var sm={t:0,c:0,on:false,raf:0};
function maxY(){return Math.max(0,document.documentElement.scrollHeight-innerHeight);}
function smLoop(){
  if(!sm.on)return;
  sm.c+=(sm.t-sm.c)*0.1;
  if(Math.abs(sm.t-sm.c)>0.5){scrollTo(0,sm.c);sm.raf=requestAnimationFrame(smLoop);}
  else{scrollTo(0,sm.t);sm.on=false;}
}
if(!native){
  addEventListener('wheel',function(e){
    if(e.ctrlKey||e.target.closest('textarea,select'))return;
    if(document.documentElement.classList.contains('is-cover')){e.preventDefault();return;}
    e.preventDefault();
    var dy=e.deltaMode===1?e.deltaY*16:e.deltaY;
    if(!sm.on){sm.t=sm.c=scrollY;sm.on=true;}
    sm.t=Math.max(0,Math.min(sm.t+dy*0.8,maxY()));
    cancelAnimationFrame(sm.raf);sm.raf=requestAnimationFrame(smLoop);
  },{passive:false});
  addEventListener('scroll',function(){ if(!sm.on){sm.t=sm.c=scrollY;} },{passive:true});
}
function pageY(el){ return el.getBoundingClientRect().top+scrollY; }

/* ---------- PRELOADER ---------- */
var pre=$('#pre'), preN=$('#preN'), preG=0, seen=false;
try{seen=sessionStorage.getItem('dsPre')==='1';}catch(e){}
document.documentElement.classList.add('is-cover');
function preEnd(){
  if(!pre||pre.dataset.end)return; pre.dataset.end='1';
  try{sessionStorage.setItem('dsPre','1');}catch(e){}
  pre.classList.add('is-done');
  document.documentElement.classList.remove('is-cover');
  setTimeout(function(){ if(pre.parentNode)pre.parentNode.removeChild(pre); },1000);
}
if(pre&&!reduce&&!seen){
  var pt=setInterval(function(){
    preG+=Math.random()*18+12;
    if(preG>=100){preG=100;clearInterval(pt);setTimeout(preEnd,120);}
    if(preN)preN.textContent=Math.floor(preG);
  },70);
  pre.addEventListener('click',preEnd);
  addEventListener('keydown',function(e){ if(e.key==='Escape')preEnd(); });
}else{
  if(pre&&pre.parentNode)pre.parentNode.removeChild(pre);
  document.documentElement.classList.remove('is-cover');
}
/* ---------- HEADER: theme + condense ---------- */
var hdr=$('#hdr'), lastY=0;
var themes=$$('[data-htheme]');
if('IntersectionObserver' in window){
  var thObs=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        hdr.classList.toggle('is-light', e.target.getAttribute('data-htheme')==='light');
      }
    });
  },{rootMargin:'-8% 0px -92% 0px'});
  themes.forEach(function(s){thObs.observe(s)});
}
addEventListener('scroll',function(){
  var y=window.scrollY||0;
  hdr.classList.toggle('is-scrolled', y>10);
  if(!native){
    if(y>lastY+2 && y>420){hdr.classList.add('is-condensed');hdr.classList.remove('is-returning')}
    else if(y<lastY-2){hdr.classList.remove('is-condensed');hdr.classList.add('is-returning');setTimeout(function(){hdr.classList.remove('is-returning')},600)}
    if(y<200){hdr.classList.remove('is-condensed','is-returning')}
  }
  lastY=y;
},{passive:true});

/* ---------- MOBILE MENU ---------- */
var mbtn=$('#mbtn'), mnav=$('#mnav'), root=document.documentElement;
function mset(o){ root.classList.toggle('menu-open',o); hdr.classList.toggle('menu-open',o); mbtn.setAttribute('aria-expanded',o?'true':'false'); mnav.setAttribute('aria-hidden',o?'false':'true'); }
mbtn.addEventListener('click',function(){ mset(!root.classList.contains('menu-open')); });
$$('a',mnav).forEach(function(a){ a.addEventListener('click',function(){ mset(false); }); });
addEventListener('keydown',function(e){ if(e.key==='Escape')mset(false); });
addEventListener('resize',function(){ if(innerWidth>900)mset(false); });

/* ---------- TEAM: hover image follows the cursor ---------- */
var pm=$('#pmedia'), pmi=pm&&pm.querySelector('img'), pmx=0, pmy=0, ptx=0, pty=0, pmOn=false, pmRaf=0;
function pmStep(){
  pmx+=(ptx-pmx)*0.2; pmy+=(pty-pmy)*0.2;
  pm.style.left=pmx+'px'; pm.style.top=pmy+'px';
  pmRaf=pmOn||Math.abs(ptx-pmx)>0.5||Math.abs(pty-pmy)>0.5?requestAnimationFrame(pmStep):0;
}
if(pm&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('.trow').forEach(function(row){
    var img=row.querySelector('.tav');
    function move(e){ ptx=Math.min(innerWidth-280,e.clientX+28); pty=Math.max(76,Math.min(innerHeight-340,e.clientY-150)); }
    row.addEventListener('mouseenter',function(e){ pmi.src=img.src; move(e); if(!pm.classList.contains('show')){pmx=ptx;pmy=pty;} pmOn=true; pm.classList.add('show'); if(!pmRaf)pmRaf=requestAnimationFrame(pmStep); });
    row.addEventListener('mousemove',move);
    row.addEventListener('mouseleave',function(){ pmOn=false; pm.classList.remove('show'); });
  });
}

/* ---------- REVEALS ---------- */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  $$('[data-rv],.hero_h1').forEach(function(el){io.observe(el)});
  setTimeout(function(){ $$('.hero_h1 .mask, .hero_h1').forEach(function(el){el.classList.add('in')}) }, reduce?50:1250);
}else{ $$('[data-rv]').forEach(function(el){el.classList.add('in')}); }

/* ---------- HERO RIBBON CAROUSEL ---------- */
var ribbon=$('#ribbon'), track=$('#ribbonTrack');
if(ribbon&&track){
  var vx=reduce?0:-0.45, dragging=false, px=0, off=0, half=0;
  var measure=function(){ half=track.scrollWidth/2; };
  measure(); addEventListener('resize',measure); addEventListener('load',measure);
  var step=function(){
    if(!dragging){ vx+=((reduce?0:-0.45)-vx)*0.04; off+=vx; }
    if(half>0){ off=((off%half)+half)%half; track.style.transform='translate3d('+(-off)+'px,0,0)'; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  ribbon.addEventListener('pointerdown',function(e){
    dragging=true; px=e.clientX; ribbon.classList.add('dragging');
    try{ ribbon.setPointerCapture(e.pointerId); }catch(err){}
  });
  ribbon.addEventListener('pointermove',function(e){
    if(!dragging)return;
    var dx=e.clientX-px; px=e.clientX;
    off-=dx; vx=dx*0.9;
    if(half>0){ off=((off%half)+half)%half; track.style.transform='translate3d('+(-off)+'px,0,0)'; }
  });
  var endDrag=function(){ dragging=false; ribbon.classList.remove('dragging'); };
  ribbon.addEventListener('pointerup',endDrag);
  ribbon.addEventListener('pointercancel',endDrag);
}

/* ---------- FORM DELIVERY ---------- */
function dsSend(form,name,ok,extra){
  var req=[].slice.call(form.querySelectorAll('input[required]')),bad=req.filter(function(i){return !i.value.trim()});
  if(bad.length){bad[0].focus();return;}
  var d=new URLSearchParams(),lines=["Hi Design Shark International, I'd like to send a brief."];
  d.append('form-name',name);
  [].forEach.call(form.elements,function(el){if(el.name&&el.name!=='form-name'&&el.type!=='submit'){d.append(el.name,el.value);if(el.value&&el.name!=='bot-field')lines.push(el.name+': '+el.value);}});
  if(extra)for(var k in extra){d.append(k,extra[k]);lines.push(k+': '+extra[k]);}
  var b=form.querySelector('button[type=submit]');if(b)b.disabled=true;
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:d.toString()})
    .then(function(r){if(!r.ok)throw 0;ok();})
    .catch(function(){window.dsAsk('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(lines.join('\n')),'We could not send your brief from this page. Continue to WhatsApp to send it there?');})
    .then(function(){if(b)b.disabled=false;});
}
/* ---------- APPLY FORM (page section) ---------- */
var apl=$('#apply');
var aplForm=$('.apl_form');
if(aplForm){
  aplForm.addEventListener('submit',function(e){
    e.preventDefault();
    dsSend(aplForm,'apply-page',function(){ apl.classList.add('done'); });
  });
}

/* ---------- APPLY: PATH CHIPS ---------- */
var pathIn=$('.apl_form input[name="path"]');
var makers={founding:'What are you making?',sample:'What are you sampling?',batch:'What are you producing?'};
function setPath(v){
  $$('.apl_path').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-v')===v)});
  if(pathIn)pathIn.value=v;
  var mk=$('.apl_form input[name="making"]');
  if(mk&&makers[v])mk.placeholder=makers[v];
}
$$('.apl_path').forEach(function(b){b.addEventListener('click',function(){setPath(b.getAttribute('data-v'))})});
$$('a[data-path]').forEach(function(a){a.addEventListener('click',function(){setPath(a.getAttribute('data-path'))})});

/* ---------- ANCHOR SCROLL ---------- */
$$('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=a.getAttribute('href');
    if(id.length<2)return;
    var t=$(id); if(!t)return;
    e.preventDefault();
    sm.on=false;cancelAnimationFrame(sm.raf);
    scrollTo({top:Math.max(0,Math.min(pageY(t)-76,maxY())),behavior:reduce?'auto':'smooth'});
  });
});
})();

(function(){
var box=document.getElementById('dsgo'),msg=document.getElementById('dsgo_m'),go=document.getElementById('dsgo_go'),x=document.getElementById('dsgo_x'),last=null;
function label(u){var h=u.hostname.replace(/^www\./,'');if(h==='wa.me')return'WhatsApp';if(h==='apps.apple.com')return'the App Store';if(h==='play.google.com')return'Google Play';return h}
function ask(url,text){var u;try{u=new URL(url,location.href)}catch(e){return}
msg.textContent=text||('This opens '+label(u)+' in a new tab. Continue?');
go.href=u.href;last=document.activeElement;box.classList.add('on');box.setAttribute('aria-hidden','false');go.focus()}
function close(){box.classList.remove('on');box.setAttribute('aria-hidden','true');if(last&&last.focus)last.focus()}
window.dsAsk=ask;
x.addEventListener('click',close);
box.addEventListener('click',function(e){if(e.target===box)close()});
go.addEventListener('click',function(){setTimeout(close,0)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('on'))close()});
document.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.hasAttribute('data-ok'))return;
var u;try{u=new URL(a.href,location.href)}catch(err){return}
if(!/^https?:$/.test(u.protocol)||u.host===location.host)return;
e.preventDefault();e.stopImmediatePropagation();ask(u.href)},true);
})();

/* ---------- IMAGE FALLBACKS (replaces the inline onerror handlers) ---------- */
document.addEventListener('error', function (e) {
  var img = e.target;
  if (!img || img.tagName !== 'IMG') return;
  var tile = img.closest('.tile'), fig = img.closest('.fact_grid figure');
  if (tile) { tile.classList.add('tfail'); img.remove(); }
  else if (fig) { fig.classList.add('fimg-fail'); img.remove(); }
  else if (img.parentNode) { img.parentNode.style.display = 'none'; }
}, true);
