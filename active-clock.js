/* Active play time excludes hidden-tab time, including pending reveal callbacks. */
(function(root){
 function createActiveClock(env){
  let paused=env.hidden(),since=env.now(),excluded=0,nextId=0;const jobs=new Map();
  const now=()=> (paused?since:env.now())-excluded;
  function arm(id,job){if(paused)return;job.timer=env.set(()=>{job.timer=null;if(paused)return;jobs.delete(id);job.fn();},Math.max(0,job.at-now()));}
  function change(){const hidden=env.hidden();if(hidden===paused)return;
   if(hidden){since=env.now();paused=true;for(const j of jobs.values()){env.clear(j.timer);j.timer=null;}}
   else{excluded+=env.now()-since;paused=false;for(const [id,j] of jobs)arm(id,j);}
  }
  env.listen(change);
  return {now,hidden:()=>paused,schedule(fn,ms){const id=++nextId,j={fn,at:now()+ms,timer:null};jobs.set(id,j);arm(id,j);return id;},cancel(id){const j=jobs.get(id);if(j){env.clear(j.timer);jobs.delete(id);}}};
 }
 if(typeof module!=='undefined')module.exports={createActiveClock};
 else root.createActiveClock=createActiveClock;
})(typeof window==='undefined'?globalThis:window);
