import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,NODE,NODES,EXITS,neighbors,escapeCheck} from '../dist/core.js';
import {objectiveFor,guidanceFor,routeBetween} from '../dist/guide.js';

const run=(count=1)=>createGame(count,'easy',[],[],{seed:13,scenarioId:'commuters',betrayal:false});
const complete=g=>{g.story.missions.forEach(m=>m.done=true);g.pursuit.heat=0;g.pursuit.pos='takasaki';return g};

test('directions lead across connected Kanto locations without teleporting',()=>{
 for(const from of NODES)for(const to of NODES){
  const path=routeBetween(from.id,to.id);
  assert.equal(path[0],from.id);assert.equal(path.at(-1),to.id);
  assert.equal(new Set(path).size,path.length);
  for(let i=1;i<path.length;i++)assert.ok(neighbors(path[i-1]).some(e=>e.to===path[i]));
 }
});
test('an available mission at the current location takes priority over extra travel',()=>{
 const g=run();g.players[0].pos=g.story.missions[1].nodes[0];
 const guide=guidanceFor(g);
 assert.equal(guide.missionId,'ally');assert.equal(guide.action,'mission');assert.equal(guide.next,null);
});
test('rescue guidance asks separated teammates to gather after proof is complete',()=>{
 const g=run(2);g.story.missions[0].done=true;
 g.players[0].pos=g.story.missions[1].nodes[0];g.players[1].pos='takasaki';
 const guide=guidanceFor(g);
 assert.equal(guide.action,'team');assert.match(guide.text,/2人/);
 g.players[1].pos=g.players[0].pos;assert.equal(guidanceFor(g).action,'mission');
});
test('missing supplies point to an unsearched source, then suggest searching on arrival',()=>{
 const g=run();g.story.missions[0].done=true;g.story.missions[1].done=true;g.resources.signal=0;
 const objective=objectiveFor(g);
 assert.equal(objective.kind,'gather');assert.equal(NODE[objective.node].loot,'signal');
 g.players[0].pos=objective.node;assert.equal(guidanceFor(g).action,'search');
 g.searched.push(objective.node);assert.notEqual(objectiveFor(g).node,objective.node);
});
test('spent actions point to the next turn, but an available escape stays actionable',()=>{
 const g=run();g.ap=0;assert.equal(guidanceFor(g).action,'end');
 complete(g);const exit=EXITS[0];g.players[0].pos=exit.node;Object.assign(g.resources,exit.need);
 assert.equal(escapeCheck(g,exit.id).ok,true);assert.equal(guidanceFor(g).action,'escape');
});
test('guidance explains excessive pursuit and low health without changing the game',()=>{
 const g=run();g.players[0].pos='funabashi';g.pursuit.heat=10;
 const saved=structuredClone(g);assert.equal(guidanceFor(g).action,'hide');assert.deepEqual(g,saved);
 g.pursuit.heat=0;g.players[0].hp=2;assert.equal(guidanceFor(g).action,'rest');
});
test('manual destinations override automatic goals and can be cancelled without mutating state',()=>{
 const g=run(),saved=structuredClone(g);
 const guide=guidanceFor(g,'narita');assert.equal(guide.node,'narita');assert.equal(guide.kind,'navigate');
 assert.notEqual(guidanceFor(g).kind,'navigate');assert.deepEqual(g,saved);
});
test('completed missions lead to the chosen exit, including legacy saves without a story',()=>{
 const g=complete(run());g.goal='narita';g.resources.signal=5;
 assert.equal(objectiveFor(g).node,'narita');
 delete g.story;delete g.pursuit;g.version=1;assert.equal(guidanceFor(g).node,'narita');
});
