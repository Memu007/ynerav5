// Run: node design/check-ambience.cjs
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../ambience.js'),'utf8');
function run(hour,search='') {
 const links=[{href:'http://127.0.0.1:8765/en.html'}];
 const context={window:{},Date:class {getHours(){return Math.floor(hour)} getMinutes(){return (hour%1)*60}},URLSearchParams,URL,location:{search,href:'http://127.0.0.1:8765/index.html'+search},document:{addEventListener(name,fn){fn()},querySelectorAll(){return links},documentElement:{dataset:{},style:{setProperty(){}}}}};
 vm.runInNewContext(source,context);
 const requested=new URLSearchParams(search).get('scene');
 assert.equal(new URL(links[0].href).searchParams.get('scene'),['day','dusk','night'].includes(requested)?requested:null);
 return context.window.YneraAmbience;
}
for(const [hour,phase] of [[0,'night'],[5.99,'night'],[6,'day'],[8,'day'],[12,'day'],[17,'dusk'],[19,'dusk'],[21,'night'],[23.9,'night']]) assert.equal(run(hour).phase,phase);
for(const key of ['day','dusk','night']) assert.equal(run(12,'?scene='+key).phase,key);
assert.equal(run(12,'?scene=unknown').phase,'day');
for(let hour=0;hour<24;hour+=.05){
 const c=run(hour);for(const key of ['stars','daylight','particles','emission']) assert(c[key]>=0&&c[key]<=1);
 for(const key of ['top','mid','low','horizon','haze']) assert(c[key].every(n=>Number.isFinite(n)&&n>=0&&n<=1));
}
for(const boundary of [6,8,17,19,21]){
 const a=run(boundary-.001),b=run(boundary+.001);
 for(const key of ['stars','daylight','particles','emission']) assert(Math.abs(a[key]-b[key])<.002);
}
console.log('Local hours, transition boundaries, previews and palette ranges OK');
