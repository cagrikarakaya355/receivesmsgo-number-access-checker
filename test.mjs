import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const context=vm.createContext({});
for(const file of ['decision.js','copy.js'])vm.runInContext(await fs.readFile(new URL(file,import.meta.url),'utf8'),context,{filename:file});
const {accessQuestionOptions,assessNumberAccess,completeAccessAnswers}=context.NumberAccessDecision;
const {numberAccessCopy}=context.NumberAccessTranslations;
const simple={authorization:'yes',duration:'once',reuse:'no',channel:'sms',important:'no'};

test('exactly one of 162 combinations qualifies for possible temporary access',()=>{
  let combinations=[{}];
  for(const [key,values] of Object.entries(accessQuestionOptions))combinations=combinations.flatMap(part=>Array.from(values,value=>({...part,[key]:value})));
  assert.equal(combinations.length,162);
  const temporary=combinations.filter(answers=>assessNumberAccess(answers).outcome==='temporary');
  assert.deepEqual(temporary,[simple]);
  for(const answers of combinations){
    const decision=assessNumberAccess(answers);
    if(decision.outcome!=='temporary')assert.ok(decision.reasons.length);
    if(answers.authorization!=='yes')assert.equal(decision.outcome,'permission');
    else if(answers.channel!=='sms')assert.equal(decision.outcome,'voice');
    else if(answers.important==='yes'||answers.duration!=='once'||answers.reuse!=='no')assert.equal(decision.outcome,'durable');
  }
});

test('unknown future reuse requires durable access and reasons remain visible',()=>{
  assert.equal(assessNumberAccess({...simple,reuse:'unsure'}).outcome,'durable');
  const decision=assessNumberAccess({authorization:'unsure',duration:'days',reuse:'yes',channel:'both',important:'yes'});
  assert.equal(decision.outcome,'permission');
  assert.deepEqual(Array.from(decision.reasons),['permission','voice','important','duration','reuse']);
});

test('missing or invented choices cannot produce an answer',()=>{
  assert.equal(completeAccessAnswers({}),false);
  for(const key of Object.keys(simple)){
    const missing={...simple};delete missing[key];
    assert.equal(completeAccessAnswers(missing),false);
    assert.throws(()=>assessNumberAccess(missing));
    assert.throws(()=>assessNumberAccess({...simple,[key]:'invented'}));
  }
});

test('eight languages cover each decision and all offered choices',()=>{
  for(const locale of ['en','tr','pt','de','ru','id','bn','es']){
    const copy=numberAccessCopy(locale);
    for(const [question,choices] of Object.entries(accessQuestionOptions)){
      assert.ok(copy.questions[question].title);
      assert.deepEqual(Object.keys(copy.questions[question].options),Array.from(choices));
    }
    for(const outcome of ['permission','voice','durable','temporary'])for(const key of ['title','body','next'])assert.ok(copy.results[outcome][key].length>10);
    for(const reason of ['permission','voice','important','duration','reuse'])assert.ok(copy.reasons[reason].length>10);
  }
});

test('the shipped tool uses local assets and has no network or storage APIs',async()=>{
  const html=await fs.readFile(new URL('index.html',import.meta.url),'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const ref=match[1];
    if(ref.startsWith('#')||ref.startsWith('https://'))continue;
    assert.ok((await fs.stat(new URL(ref,import.meta.url))).isFile(),ref);
  }
  for(const file of ['decision.js','copy.js','app.js']){
    const source=await fs.readFile(new URL(file,import.meta.url),'utf8');
    assert.doesNotMatch(source,/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB)\b/);
    assert.doesNotMatch(source,/\bdocument\.cookie\b/);
  }
});
