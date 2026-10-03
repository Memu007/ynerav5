/* Local clock only. No geolocation, requests, timers or extra render loop. */
(() => {
  const palettes = {
    night: {top:[.012,.014,.06], mid:[.035,.02,.075], low:[.01,.008,.02], horizon:[.14,.035,.2], haze:[0,.06,.07], stars:1, daylight:0, warmth:0, emission:1, particles:1, ambient:.55, sun:1.1, skyLight:'#7f8cff', groundLight:'#2a1b88', sunLight:'#b8c4ff', fallback:'#2a2040'},
    day: {top:[.035,.10,.18], mid:[.08,.18,.26], low:[.018,.04,.035], horizon:[.09,.07,.025], haze:[.005,.035,.045], stars:0, daylight:1, warmth:.2, emission:.38, particles:.25, ambient:1.15, sun:1.6, skyLight:'#cadbd6', groundLight:'#435544', sunLight:'#ffe1b3', fallback:'#344d53'},
    dusk: {top:[.075,.025,.075], mid:[.22,.075,.105], low:[.018,.012,.027], horizon:[.3,.13,.055], haze:[.04,.015,.06], stars:.28, daylight:.3, warmth:1, emission:.7, particles:.6, ambient:.7, sun:1.25, skyLight:'#d7a5b1', groundLight:'#463047', sunLight:'#ffbd80', fallback:'#6d3e4b'}
  };
  const smooth = t => {t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const colorMix=(a,b,t)=>'#'+[1,3,5].map(i=>{
    const x=parseInt(a.slice(i,i+2),16),y=parseInt(b.slice(i,i+2),16);
    return Math.round(x+(y-x)*t).toString(16).padStart(2,'0');
  }).join('');
  const mix = (a,b,t) => Object.fromEntries(Object.keys(a).map(k => [k,
    Array.isArray(a[k]) ? a[k].map((v,i)=>v+(b[k][i]-v)*t) :
    typeof a[k]==='number' ? a[k]+(b[k]-a[k])*t : colorMix(a[k],b[k],t)
  ]));
  function at(hour) {
    hour=((hour%24)+24)%24;
    if(hour<6 || hour>=21) return {...palettes.night,phase:'night'};
    if(hour<8) return {...mix(palettes.night,palettes.day,smooth((hour-6)/2)),phase:'day'};
    if(hour<17) return {...palettes.day,phase:'day'};
    if(hour<19) return {...mix(palettes.day,palettes.dusk,smooth((hour-17)/2)),phase:'dusk'};
    return {...mix(palettes.dusk,palettes.night,smooth((hour-19)/2)),phase:'dusk'};
  }
  const date=new Date(), hour=date.getHours()+date.getMinutes()/60;
  // Allowlisted preview, used by the design review; not a site control.
  const preview=new URLSearchParams(location.search).get('scene');
  const config=Object.hasOwn(palettes,preview)?{...palettes[preview],phase:preview}:at(hour);
  window.YneraAmbience={...config,hour};
  document.documentElement.dataset.scene=config.phase;
  document.documentElement.style.setProperty('--scene-fallback',config.fallback);
  // Keep an explicit scene preview when switching between ES and EN.
  if (Object.hasOwn(palettes,preview)) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.language-switch a').forEach(link => {
        const target = new URL(link.href, location.href);
        target.searchParams.set('scene', preview);
        link.href = target.href;
      });
    }, {once:true});
  }
  // ponytail: sample once per visit; keeps long reading sessions visually stable.
})();
