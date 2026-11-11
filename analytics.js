/* Explicit opt-in, allowlisted events, no SDK, session replay or autocapture. */
(function(root,factory){if(typeof module==='object')module.exports=factory;else root.makeLoopLabAnalytics=factory;})(typeof window==='undefined'?{}:window,function(config,env){
 'use strict';
 const consentKey='looplab_analytics_consent',idKey='looplab_analytics_id';
 const events=new Set(['visit','game_start','game_complete','game_abandon','share_success','theme_interest']);
 const ready=Boolean(config.token)&&['https://eu.i.posthog.com','https://us.i.posthog.com'].includes(config.host);
 let choice=null,identity=null,count=0;
 try{choice=env.storage.getItem(consentKey);identity=JSON.parse(env.storage.getItem(idKey)||'null');}catch{}
 function consent(yes){choice=yes?'yes':'no';try{env.storage.setItem(consentKey,choice);if(!yes){env.storage.removeItem(idKey);identity=null;}}catch{if(!yes)identity=null;}}
 function enabled(){return ready&&choice==='yes'&&!env.blocked;}
 function track(event,props={}){
  if(!enabled()||!events.has(event)||count>=100)return false;
  try{
   const now=env.now();
   if(!identity||typeof identity.id!=='string'||!Number.isFinite(identity.created)||now-identity.created>90*86400000){identity={id:env.uuid(),created:now};env.storage.setItem(idKey,JSON.stringify(identity));}
   const properties={$process_person_profile:false,$geoip_disable:true,release:'pilot-01.1'};
   if(['odd','numbers','memory'].includes(props.mode))properties.mode=props.mode;
   if(['daily','practice','shared'].includes(props.run_type))properties.run_type=props.run_type;
   if(['maybe','no'].includes(props.choice))properties.choice=props.choice;
   if(typeof props.replay==='boolean')properties.replay=props.replay;
   if(typeof props.shared_entry==='boolean')properties.shared_entry=props.shared_entry;
   properties.days_since_first_visit=Math.max(0,Math.floor((now-identity.created)/86400000));
   count++;env.send(config.host+'/i/v0/e/',{api_key:config.token,event,distinct_id:identity.id,properties});return true;
  }catch{return false;}
 }
 return {track,consent,enabled,ready,choice:()=>choice};
});
