const story=document.querySelector('.story');
const stage=document.querySelector('.stage');
const world=document.querySelector('.world-image');
const explorer=document.querySelector('.explorer');
const explorerLayers=[...document.querySelectorAll('.explorer-frame')];
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
[...runFrames,...actionFrames].forEach(src=>{const image=new Image();image.decoding='async';image.src=src;image.decode().catch(()=>{})});
let target=0,current=0,raf=0;
let lastTime=0,lastPhase=-1,lastFrame='';
let visibleLayer=0;

const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const range=(n,a,b)=>clamp((n-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=n=>n*n*(3-2*n);

function readScroll(){
  const rect=story.getBoundingClientRect();
  target=clamp(-rect.top/(story.offsetHeight-innerHeight));
  if(!raf) raf=requestAnimationFrame(draw);
}

function draw(time=0){
  const delta=Math.min(48,lastTime?time-lastTime:16.7);
  lastTime=time;
  const damping=1-Math.exp(-delta/72);
  current=reduce?target:lerp(current,target,damping);
  const moving=Math.abs(target-current)>.001;
  const outward=smooth(range(current,.18,.4));
  const returning=smooth(range(current,.6,.8));
  const travel=current<.5?outward:1-returning;
  const worldX=-travel*48;
  const storyPhase=Math.min(7,Math.floor(current*8));
  const phase=Math.min(4,Math.floor(current*5));
  const running=(current>.18&&current<.4)||(current>.6&&current<.8);
  const facing=running?(current>.5?-1:1):([0,1,5,6].includes(storyPhase)?-1:1);
  const bob=running&&moving?Math.sin(time/70*Math.PI)*3:0;
  const frame=running&&moving?Math.floor(time/70)%runFrames.length:1;
  const action=current>=.4&&current<.6?2:storyPhase===0?0:storyPhase===1?1:storyPhase===5?3:storyPhase===6?4:storyPhase===7?5:1;

  world.style.transform=`translate3d(${worldX}vw,0,0)`;
  trees.forEach(tree=>tree.style.transform=`translate3d(${worldX}vw,0,0)`);
  computer.style.transform=`translate3d(${worldX}vw,0,0)`;
  const characterFrame=running?runFrames[frame]:actionFrames[action];
  if(characterFrame!==lastFrame){
    const nextLayer=1-visibleLayer;
    explorerLayers[nextLayer].src=characterFrame;
    explorerLayers[nextLayer].classList.add('is-visible');
    explorerLayers[visibleLayer].classList.remove('is-visible');
    visibleLayer=nextLayer;
    lastFrame=characterFrame;
  }
  explorer.style.transform=`translate3d(${(outward-returning)*18}vw,${bob}px,0) scaleX(${facing})`;
  explorer.style.opacity='1';
  progressBar.style.transform=`scaleX(${current})`;
  intro.style.opacity=String(1-range(current,.04,.15));
  intro.style.transform=`translateY(${-range(current,.04,.15)*18}px)`;
  if(phase!==lastPhase){
    beats.forEach((beat,i)=>beat.classList.toggle('is-active',i===phase));
    lastPhase=phase;
  }
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

  if(moving) raf=requestAnimationFrame(draw); else raf=0;
}

document.querySelector('.skip').addEventListener('click',()=>{
  const destination=document.querySelector('#servicios');
  destination.scrollIntoView();
  destination.focus({preventScroll:true});
});
addEventListener('scroll',readScroll,{passive:true});
addEventListener('resize',readScroll);
readScroll();

document.querySelectorAll('.problem-grid,.capability-path,.project-grid,.method-steps').forEach(carousel=>{
  const progress=document.createElement('div');
  const bar=document.createElement('i');
  const update=()=>bar.style.transform=`scaleX(${clamp((carousel.scrollLeft+carousel.clientWidth)/carousel.scrollWidth)})`;
  progress.className='carousel-progress';
  progress.setAttribute('aria-hidden','true');
  progress.append(bar);
  carousel.after(progress);
  carousel.addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update);
  update();
});
