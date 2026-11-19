(function(){
var d=document;
/* menu */
var top=d.getElementById('top'),bur=d.getElementById('burger');
bur.addEventListener('click',function(){var o=top.classList.toggle('open');bur.setAttribute('aria-expanded',o);bur.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
d.querySelectorAll('#nav a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('open');bur.setAttribute('aria-expanded','false');});});
/* aktywna pozycja menu */
var links=[].slice.call(d.querySelectorAll('#nav a[href^="#"]'));
var map={drzwi:'drzwi',kolekcja:'drzwi',loft:'loft',katalogi:'katalogi',zewnetrzne:'zewnetrzne',inwestycje:'inwestycje','o-nas':'o-nas',kontakt:'kontakt'};
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=map[e.target.id];links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id);});}});},{rootMargin:'-45% 0px -50% 0px'});
 Object.keys(map).forEach(function(k){var el=d.getElementById(k);if(el)io.observe(el);});
}
/* paski zdjec: strzalki + przeciaganie mysza */
d.querySelectorAll('.strip').forEach(function(s){
 var ar=d.querySelector('.arrows[data-for="'+s.id+'"]');
 function step(){var f=s.querySelector('figure');return f?f.getBoundingClientRect().width+parseFloat(getComputedStyle(s).columnGap||24):300;}
 function upd(){if(!ar)return;ar.querySelector('.pv').disabled=s.scrollLeft<4;ar.querySelector('.nx').disabled=s.scrollLeft+s.clientWidth>=s.scrollWidth-4;}
 if(ar){ar.querySelector('.pv').onclick=function(){s.scrollBy({left:-step(),behavior:'smooth'});};ar.querySelector('.nx').onclick=function(){s.scrollBy({left:step(),behavior:'smooth'});};}
 s.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
 var down=false,sx=0,sl=0,moved=0;
 s.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=s.scrollLeft;});
 window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){s.classList.add('drag');moved=1;}s.scrollLeft=sl-dx;});
 window.addEventListener('pointerup',function(){if(!down)return;down=false;if(s.classList.contains('drag')){s.classList.remove('drag');var st=step(),i=Math.round(s.scrollLeft/st);s.scrollTo({left:i*st,behavior:'smooth'});}});
 s.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=0;}},true);
});
/* lightbox */
var lb=d.getElementById('lb'),li=lb.querySelector('img'),cap=lb.querySelector('.cap'),grp=[],idx=0;
function show(i){idx=(i+grp.length)%grp.length;var b=grp[idx],im=b.querySelector('img');li.src=im.currentSrc||im.src;li.alt=im.alt;cap.textContent=im.alt+'  '+(idx+1)+'/'+grp.length;var full=b.getAttribute('data-full');if(full){var p=new Image();p.onload=function(){if(grp[idx]===b)li.src=full;};setTimeout(function(){p.src=full;},120);}}
d.querySelectorAll('[data-lbg]').forEach(function(g){var bs=[].slice.call(g.querySelectorAll('button[data-full]'));bs.forEach(function(b,i){b.addEventListener('click',function(){grp=bs;show(i);lb.classList.add('on');lb.querySelector('.x').focus();});});});
function close(){lb.classList.remove('on');li.removeAttribute('src');}
lb.querySelector('.x').onclick=close;lb.querySelector('.pv').onclick=function(){show(idx-1);};lb.querySelector('.nx').onclick=function(){show(idx+1);};
lb.addEventListener('click',function(e){if(e.target===lb)close();});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));},{passive:true});
/* formularz pokazowy */
d.getElementById('form').addEventListener('submit',function(e){e.preventDefault();d.getElementById('ok').style.display='block';});
/* mapa ladowana przy przewinieciu */
var m=d.getElementById('map');
function loadMap(){if(m.dataset.l)return;m.dataset.l=1;var f=d.createElement('iframe');f.title='Mapa dojazdu do salonu DAN-POL';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.src='https://maps.google.com/maps?q=Brze%C5%BAnicka%2046a%2C%2042-200%20Cz%C4%99stochowa&z=15&output=embed';m.appendChild(f);}
if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){loadMap();mo.disconnect();}},{rootMargin:'400px'});mo.observe(m);}else loadMap();
})();
