const isTouch=window.matchMedia('(pointer: coarse)').matches;
const isMobile=window.innerWidth<=600;
if(isTouch){
  document.getElementById('cur').style.display='none';
  document.getElementById('cur2').style.display='none';
  document.body.style.setProperty('cursor','auto','important');
}
const PCOUNT=isMobile?60:130;
const STAR_COUNT=isMobile?2:5;

const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d', {alpha:false});
let W,H;
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
window.addEventListener('resize',resize);
resize();

let mx=W/2, my=H/2, tgX=W/2, tgY=H/2;
if(!isTouch){
  window.addEventListener('mousemove',e=>{ tgX=e.clientX; tgY=e.clientY; });
  let cur=document.getElementById('cur'), cur2=document.getElementById('cur2');
  let cx=W/2, cy=H/2;
  function updateCur(){
    mx=tgX; my=tgY;
    cx+=(mx-cx)*0.13; cy+=(my-cy)*0.13;
    cur.style.transform=`translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    cur2.style.transform=`translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    requestAnimationFrame(updateCur);
  }
  updateCur();
  document.addEventListener('mousedown',()=>document.body.classList.add('mdn'));
  document.addEventListener('mouseup',()=>document.body.classList.remove('mdn'));
}

class P{
  constructor(){ this.r(); this.x=Math.random()*W; this.y=Math.random()*H; }
  r(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.vx=(Math.random()-0.5)*0.5; this.vy=(Math.random()-0.5)*0.5;
    this.rad=0.2+Math.random()*0.9;
    this.ph=Math.random()*Math.PI*2;
  }
  t(){
    if(!isTouch){
      let dx=mx-this.x, dy=my-this.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<140 && d>0){
        let f=(140-d)/140 * 0.02;
        this.vx+=dx*f; this.vy+=dy*f;
      }
    }
    this.vx*=0.98; this.vy*=0.98;
    this.x+=this.vx+0.2; this.y+=this.vy-0.2;
    if(this.x>W)this.x=0; if(this.x<0)this.x=W;
    if(this.y>H)this.y=0; if(this.y<0)this.y=H;
    this.ph+=0.02;
  }
  d(){
    let o=0.4+Math.sin(this.ph)*0.4;
    ctx.fillStyle=`rgba(200,255,0,${o})`;
    ctx.beginPath(); ctx.arc(this.x,this.y,this.rad,0,Math.PI*2); ctx.fill();
  }
}

class S{
  constructor(){ this.r(); }
  r(){
    this.x=Math.random()*W; this.y=Math.random()*(H*0.4);
    this.vx=-4-Math.random()*3; this.vy=4+Math.random()*3;
    this.len=50+Math.random()*50;
    this.life=0; this.maxLife=70+Math.random()*60;
    this.del=Math.random()*200;
  }
  t(){
    if(this.del>0){ this.del--; return; }
    this.x+=this.vx; this.y+=this.vy;
    this.life++;
    if(this.life>=this.maxLife) this.r();
  }
  d(){
    if(this.del>0)return;
    let o = Math.sin((this.life/this.maxLife)*Math.PI);
    let grad=ctx.createLinearGradient(this.x,this.y,this.x-this.vx*10,this.y-this.vy*10);
    grad.addColorStop(0,`rgba(200,255,0,${o})`);
    grad.addColorStop(1,'transparent');
    ctx.strokeStyle=grad; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(this.x,this.y); ctx.lineTo(this.x-this.vx*10,this.y-this.vy*10); ctx.stroke();
  }
}

let pts=[], sts=[];
for(let i=0;i<PCOUNT;i++) pts.push(new P());
for(let i=0;i<STAR_COUNT;i++) sts.push(new S());

function dGrd(){
  ctx.strokeStyle='rgba(200,255,0,0.08)'; ctx.lineWidth=1;
  ctx.beginPath();
  for(let x=0;x<W;x+=70){ ctx.moveTo(x,0); ctx.lineTo(x,H); }
  for(let y=0;y<H;y+=70){ ctx.moveTo(0,y); ctx.lineTo(W,y); }
  ctx.stroke();
}

function dCnn(){
  ctx.lineWidth=0.5;
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      let dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){
        ctx.strokeStyle=`rgba(200,255,0,${(1-d/110)*0.25})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
      }
    }
  }
}

function frm(){
  ctx.fillStyle='#050508'; ctx.fillRect(0,0,W,H);
  dGrd();
  if(!isMobile) dCnn();
  pts.forEach(p=>{p.t();p.d();});
  sts.forEach(s=>{s.t();s.d();});
  
  if(!isTouch){
    let g=ctx.createRadialGradient(mx,my,0,mx,my,220);
    g.addColorStop(0,'rgba(200,255,0,0.15)');
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  }
  requestAnimationFrame(frm);
}
frm();

let lperc=document.getElementById('lperc'), lfill=document.getElementById('lfill'), ldr=document.getElementById('loader');
let prg=0;
let lint=setInterval(()=>{
  prg+=Math.random()*15;
  if(prg>=100){ prg=100; clearInterval(lint); setTimeout(()=>ldr.classList.add('gone'),200); }
  lperc.innerText=Math.floor(prg)+'%';
  lfill.style.width=prg+'%';
}, 100);

let navL=document.querySelectorAll('.n-links a'), secs=document.querySelectorAll('section');
window.addEventListener('scroll',()=>{
  let y=window.scrollY+300;
  secs.forEach(s=>{
    if(y>=s.offsetTop && y<s.offsetTop+s.offsetHeight){
      navL.forEach(a=>a.classList.remove('act'));
      let a=document.querySelector(`.n-links a[href="#${s.id}"]`);
      if(a) a.classList.add('act');
    }
  });
});

let obs=new IntersectionObserver(en=>{
  en.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      let st=e.target.querySelectorAll('.st-n');
      st.forEach(n=>{
        if(!n.hasAttribute('dnd')){
          n.setAttribute('dnd','1');
          let t=+n.getAttribute('data-n'), c=0;
          let inc=t/60;
          function up(){ c+=inc; if(c>=t){n.innerText=t;}else{n.innerText=Math.floor(c);requestAnimationFrame(up);} }
          up();
        }
      });
      let sf=e.target.querySelectorAll('.sk-f');
      sf.forEach(f=>{ if(f.getAttribute('data-w')) f.style.setProperty('--w',f.getAttribute('data-w')); });
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal, .rl, .rr, section').forEach(e=>obs.observe(e));

if(!isTouch){
  document.querySelectorAll('.pj-c').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      let r=c.getBoundingClientRect();
      let x=(e.clientX-r.left)/r.width - 0.5;
      let y=(e.clientY-r.top)/r.height - 0.5;
      c.style.transform=`perspective(700px) rotateY(${x*7}deg) rotateX(${-y*5}deg) translateY(-5px)`;
    });
    c.addEventListener('mouseleave',()=>c.style.transform='');
  });
}

window.st = function(i){
  document.querySelectorAll('.cat-btn').forEach((b,j)=>b.classList.toggle('on',i===j));
  document.querySelectorAll('.sk-pan').forEach((p,j)=>p.classList.toggle('on',i===j));
  document.querySelectorAll('.sk-pan.on .sk-f').forEach(f=>f.style.setProperty('--w',f.getAttribute('data-w')));
};
window.xp = function(i){
  document.querySelectorAll('.xp-ni').forEach((b,j)=>b.classList.toggle('on',i===j));
  document.querySelectorAll('.xp-pan').forEach((p,j)=>p.classList.toggle('on',i===j));
};
