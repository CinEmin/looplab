const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function boot(saved='{}',search=''){
const events=[];const nodes=new Map();function node(){const classes=new Set();const handlers={};return {handlers,textContent:'',innerHTML:'',style:{},dataset:{},children:[],firstElementChild:{style:{}},classList:{toggle(){},add(x){classes.add(x)},contains(x){return classes.has(x)},remove(x){classes.delete(x)}},setAttribute(){},addEventListener(type,fn){handlers[type]=fn},appendChild(n){this.children.push(n)},querySelectorAll(){return []}}}
const tabs=['odd','numbers','memory'].map(game=>{const n=node();n.dataset.game=game;return n});
const doc={getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},querySelectorAll(){return tabs},createElement:node};let interval;let timeout;let time=0;
const ctx={document:doc,localStorage:{getItem:()=>saved,setItem:(k,v)=>{saved=v}},location:{href:'https://example.com/'+search,search,protocol:'http:'},URL,URLSearchParams,Date,Math,performance:{now:()=>time},navigator:{},history:{replaceState(){}},setInterval:fn=>{interval=fn;return 1},clearInterval(){},setTimeout:fn=>{timeout=fn;return 1},clearTimeout(){},window:{makeLoopLabAnalytics:()=>({ready:false,choice:()=>null,track:(name,props)=>events.push({name,props})})}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1],ctx);return {events,tabs,advance(ms){time+=ms},reveal(){timeout()},api:ctx.window.__loopLabQA,tick(ms){time+=ms;interval()},nodes};}
test('incomplete persisted stats do not stop startup',()=>{assert.doesNotThrow(()=>boot('{"version":1}'))});
test('shared seed zero remains zero in challenge links',()=>{const {api}=boot('{}','?g=odd&seed=0');api.begin();assert.equal(new URL(api.makeLink(false)).searchParams.get('seed'),'0')});
test('elapsed wall time ends a run after a delayed timer callback',()=>{const b=boot();b.api.begin();b.tick(61000);assert.equal(b.api.getState().runState,'finished')});
test('all three modes start and finish',()=>{for(const mode of ['odd','numbers','memory']){const {api}=boot('{}','?g='+mode);api.begin();assert.equal(api.getState().runState,'active');api.finish();assert.equal(api.getState().runState,'finished')}});

test('game events count start, completion and replay once',()=>{const b=boot();b.api.begin();b.api.finish();b.api.finish();b.api.begin();assert.equal(b.events.filter(x=>x.name==='game_complete').length,1);const starts=b.events.filter(x=>x.name==='game_start');assert.equal(starts.length,2);assert.equal(starts[1].props.replay,true)});

for(const mode of ['odd','numbers','memory']) test(mode+': input at the deadline cannot score before timer callback',()=>{
  const b=boot('{}','?g='+mode);b.api.begin();
  if(mode==='memory')b.reveal();
  const tiles=b.nodes.get('game-board').children.slice();
  b.advance(60000);
  const tile=mode==='numbers'?tiles.find(t=>t.textContent==='1'):mode==='memory'?tiles.find(t=>t.className.includes('show')):tiles.find(t=>tiles.filter(x=>x.style.cssText===t.style.cssText).length===1);
  tile.handlers.click({currentTarget:tile});
  assert.equal(b.api.getState().score,0);
  assert.equal(b.api.getState().runState,'finished');
  assert.equal(b.events.filter(e=>e.name==='game_complete').length,1);
});

test('shared challenge opens the public game rather than an embedded asset host',()=>{
 const b=boot('{}','?g=numbers&seed=0#game-panel'); b.api.begin(); b.api.finish();
 const url=new URL(b.api.makeLink(true));
 assert.equal(url.origin,'https://looplab-pilot.racing-thyme-8277.chatgpt.site');
 assert.equal(url.pathname,'/');assert.equal(url.hash,'');
 assert.equal(url.searchParams.get('g'),'numbers');assert.equal(url.searchParams.get('target'),'0');
});

test('switching modes clears a previous share fallback',()=>{
 const b=boot();b.api.begin();b.api.finish();b.nodes.get('share-result').textContent='Copy this link: old-game';
 b.tabs.find(t=>t.dataset.game==='numbers').handlers.click();
 assert.equal(b.nodes.get('share-result').textContent,'');
 assert.equal(b.api.getState().mode,'numbers');
});
