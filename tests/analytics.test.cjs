const {test}=require('node:test');const assert=require('node:assert/strict');
const make=require('../analytics.js');
function setup(config={token:'phc_test',host:'https://eu.i.posthog.com'}){const data=new Map(),sent=[];const env={storage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},uuid:()=> 'random-test-id',now:()=>Date.UTC(2026,10,11),send:(url,body)=>sent.push({url,body}),blocked:false};return {a:make(config,env),data,sent}}
test('no network or identity before opt in',()=>{const {a,data,sent}=setup();a.track('game_start',{mode:'odd'});assert.equal(sent.length,0);assert.equal(data.size,0)});
test('consent sends only approved event properties',()=>{const {a,sent}=setup();a.consent(true);a.track('game_start',{mode:'odd',email:'private',url:'secret',run_type:'daily'});assert.equal(sent.length,1);assert.equal(sent[0].body.properties.mode,'odd');assert.equal(sent[0].body.properties.email,undefined);assert.equal(sent[0].body.properties.$process_person_profile,false)});
test('revocation deletes identifier and blocks future transmission',()=>{const {a,data,sent}=setup();a.consent(true);a.track('visit');a.consent(false);a.track('game_start');assert.equal(sent.length,1);assert.equal(data.has('looplab_analytics_id'),false)});
test('empty token cannot start collection',()=>{const {a,sent}=setup({token:'',host:'https://eu.i.posthog.com'});a.consent(true);a.track('visit');assert.equal(sent.length,0)});
test('unapproved event and unsafe host cannot send',()=>{const {a,sent}=setup({token:'phc_test',host:'https://other.example'});a.consent(true);a.track('visit');assert.equal(sent.length,0)});

test('channel attribution uses only recognized distribution labels',()=>{
 for(const [channel,want] of [['itch','itch'],['site','site'],['private-url.example','site']]){
  const {a,sent}=setup({token:'phc_test',host:'https://eu.i.posthog.com',channel});
  a.consent(true);a.track('visit');assert.equal(sent[0].body.properties.channel,want);
 }
});
