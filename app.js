const story=document.querySelector('.story');
const stage=document.querySelector('.stage');
const world=document.querySelector('.world-image');
const explorer=document.querySelector('.explorer');
const beats=[...document.querySelectorAll('.beat')];
const progressBar=document.querySelector('.progress i');
const intro=document.querySelector('.intro');
const trail=document.querySelector('.data-trail');
const question=document.querySelector('.tree-signal');
const answer=document.querySelector('.solution-signal');
const shield=document.querySelector('.shield-ring');
const bloom=document.querySelector('.bloom');
const decay=document.querySelector('.tree-decay');
const trees=[...document.querySelectorAll('.story-tree')];
const healthyTree=document.querySelector('.tree-healthy');
const computer=document.querySelector('.analysis-computer');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const runFrames=Array.from({length:6},(_,i)=>`assets/run-frame-${i}.webp`);
const actionFrames=Array.from({length:6},(_,i)=>`assets/action-frame-${i}.webp`);
[...runFrames,...actionFrames].forEach(src=>{const image=new Image();image.src=src});
let target=0,current=0,raf=0;

const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const range=(n,a,b)=>clamp((n-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;

function readScroll(){
  const rect=story.getBoundingClientRect();
  target=clamp(-rect.top/(story.offsetHeight-innerHeight));
  if(!raf) raf=requestAnimationFrame(draw);
}

function draw(time=0){
  current=reduce?target:lerp(current,target,.22);
  const outward=range(current,.25,.375);
  const returning=range(current,.5,.625);
  const travel=current<.5?outward:1-returning;
  const worldX=-travel*48;
  const phase=Math.min(7,Math.floor(current*8));
  const running=(current>.25&&current<.375)||(current>.5&&current<.625);
  const facing=running?(current>.5?-1:1):([0,1,5,6].includes(phase)?-1:1);
  const bob=running?Math.sin(time/85*Math.PI)*4:0;
  const frame=running?Math.floor(time/85)%runFrames.length:1;
  const action=phase===0?0:phase===1?1:phase===3?2:phase===5?3:phase===6?4:phase===7?5:1;

  world.style.transform=`translate3d(${worldX}vw,0,0)`;
  trees.forEach(tree=>tree.style.transform=`translate3d(${worldX}vw,0,0)`);
  computer.style.transform=`translate3d(${worldX}vw,0,0)`;
  const characterFrame=running?runFrames[frame]:actionFrames[action];
  if(!explorer.src.endsWith(characterFrame)) explorer.src=characterFrame;
  explorer.style.transform=`translate3d(${(outward-returning)*14}vw,${bob}px,0) scaleX(${facing})`;
  explorer.style.opacity='1';
  progressBar.style.transform=`scaleX(${current})`;
  intro.style.opacity=String(1-range(current,.04,.15));
  intro.style.transform=`translateY(${-range(current,.04,.15)*18}px)`;
  beats.forEach((beat,i)=>beat.classList.toggle('is-active',i===phase));
  question.style.opacity=String(1-range(current,.08,.14));
  trail.style.opacity=String(range(current,.14,.22)*(1-range(current,.46,.5)));
  trail.style.transform=`scaleX(${range(current,.14,.375)})`;
  answer.style.opacity=String(range(current,.4,.44)*(1-range(current,.48,.5)));
  shield.style.opacity=String(range(current,.625,.7));
  shield.style.transform=`scale(${lerp(.75,1,range(current,.625,.75))})`;
  decay.style.opacity=String(1-range(current,.76,.9));
  healthyTree.style.clipPath=`inset(${100-range(current,.76,.94)*100}% 0 0)`;
  bloom.style.opacity=String(range(current,.85,.94));
  bloom.style.transform=`scale(${lerp(.6,1.15,range(current,.85,.97))})`;

  if(Math.abs(target-current)>.001||running) raf=requestAnimationFrame(draw); else raf=0;
}

document.querySelector('.skip').addEventListener('click',()=>document.querySelector('#capacidades').scrollIntoView());
addEventListener('scroll',readScroll,{passive:true});
addEventListener('resize',readScroll);
readScroll();
