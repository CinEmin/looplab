/* Untimed Memory Journey. Pure state machine shared by browser and Node tests. */
(function(root,factory){if(typeof module==='object')module.exports=factory;else root.makeMemoryJourney=factory;})(typeof window==='undefined'?{}:window,function({storage,random=Math.random}={}){
 const key='looplab_journey_v1';let stars=Array(15).fill(0),saved=true;
 function mergeSaved(){const raw=JSON.parse(storage.getItem(key)||'null');if(Array.isArray(raw?.stars)){for(let i=0;i<15;i++){const v=raw.stars[i];if(!Number.isInteger(v)||v<1||v>3)break;stars[i]=Math.max(stars[i],v);}}}
 try{mergeSaved();}catch{saved=false;}
 let phase='map',level=1,round=1,lives=3,mistakes=0,hints=0,pattern=[],hits=[];
 const unlocked=()=>Math.min(15,stars.filter(Boolean).length+1);
 function config(){const step=(level-1)%5;return {rule:level<=5?'pattern':level<=10?'sequence':'reverse',width:level<=3?3:4,count:(level<=5?[2,2,3,3,4]:[2,3,3,4,4])[step],revealMs:level<=5?2600:950};}
 function preview(){const {width,count}=config();const pool=Array.from({length:width*width},(_,i)=>i);for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}pattern=pool.slice(0,count);hits=[];phase='preview';}
 function snapshot(){return {...config(),phase,level,round,lives,mistakes,hints,pattern:[...pattern],hits:[...hits],stars:[...stars],unlocked:unlocked(),saved};}
 function start(n){if(!Number.isInteger(n)||n<1||n>unlocked())return false;level=n;round=1;lives=3;mistakes=0;hints=0;preview();return true;}
 function recall(){if(phase==='preview')phase='recall';}
 function tap(i){if(phase!=='recall'||!Number.isInteger(i)||i<0||i>=config().width**2)return 'ignored';const rule=config().rule;if(rule==='pattern'&&hits.includes(i))return 'ignored';const order=rule==='reverse'?[...pattern].reverse():pattern;const correct=rule==='pattern'?pattern.includes(i):i===order[hits.length];if(!correct){mistakes++;lives--;if(lives===0)phase='retry';return 'wrong';}hits.push(i);if(hits.length===pattern.length){if(round===1)phase='roundComplete';else{phase='complete';stars[level-1]=Math.max(stars[level-1],hints?1:mistakes===0?3:mistakes<=2?2:1);try{try{mergeSaved();}catch{}storage.setItem(key,JSON.stringify({version:1,stars}));saved=true;}catch{saved=false;}}}return 'correct';}
 function next(){if(phase==='roundComplete'){round=2;preview();}}
 function hint(){if(phase==='recall'){hints++;hits=[];phase='preview';}}
 function stop(){phase='map';}
 return {snapshot,start,recall,tap,continue:next,hint,stop};
});
