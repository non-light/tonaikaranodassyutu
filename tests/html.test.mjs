import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createSingleFileHTML} from '../scripts/export-html.mjs';
import {setupHTML,inviteURL} from '../dist/setup-ui.js';
import {createGame} from '../dist/core.js';
import {actionScreenHTML,teamScreenHTML,compactBriefingHTML} from '../dist/play-ui.js';
import {briefingHTML} from '../dist/campaign-ui.js';
import {gameRuleBadgesHTML,betrayalMenuHTML} from '../dist/rules-ui.js';

test('the single HTML contains executable scripts and every essential local asset',async()=>{
 const html=await createSingleFileHTML();
 assert.doesNotMatch(html,/<script\b[^>]*\bsrc=|<link\b[^>]*rel="stylesheet"/i);
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
 assert.equal(scripts.length,3);scripts.forEach(([,code])=>assert.doesNotThrow(()=>new vm.Script(code)));
 assert.match(html,/関東の地図/);assert.match(html,/東京都/);assert.match(html,/神奈川県/);assert.match(html,/群馬県/);
 assert.match(html,/data:text\/plain/);assert.doesNotMatch(html,/fetch\(["']kanto\.geojson/);
 assert.ok(Buffer.byteLength(html)<750_000,'the standalone file remains small enough to share');
});
test('the start screen prioritizes separate-device rooms and keeps solo optional',()=>{
 const html=setupHTML();assert.match(html,/id="setup-create"/);assert.match(html,/id="setup-join"/);
 assert.match(html,/それぞれのスマホ/);assert.match(html,/<details id="solo-options"/);assert.doesNotMatch(html,/data-count/);
});
test('invitations keep the game path and replace stale room codes',()=>{
 assert.equal(inviteURL('https://lightspirits.jp/games/tokyo-escape/?room=OLD#map','ABCD234'),'https://lightspirits.jp/games/tokyo-escape/?room=ABCD234');
 assert.equal(inviteURL('https://example.com/game.html','ABCD234'),'https://example.com/game.html?room=ABCD234');
});
test('room mode labels are absent from briefings, team screens and personal actions',()=>{
 for(const betrayal of [true,false]){
  const g=createGame(4,'normal',[],[],{seed:13,betrayal});
  const html=[teamScreenHTML(g),compactBriefingHTML(g),briefingHTML(g),gameRuleBadgesHTML(g),betrayalMenuHTML(g,true),actionScreenHTML(g)].join('');
  assert.doesNotMatch(html,/裏切りあり|裏切りなし/);assert.doesNotMatch(g.log[0].text,/裏切りあり|裏切りなし/);
 }
});
test('only the current player can open personal actions on their own device',()=>{
 const g=createGame(2);
 assert.match(actionScreenHTML(g,{online:{isHost:true},localSlot:0,control:true}),/id="betrayal-btn"/);
 assert.doesNotMatch(actionScreenHTML(g,{online:{isHost:false},localSlot:1,control:false}),/id="betrayal-btn"/);
 g.turn=1;
 assert.doesNotMatch(actionScreenHTML(g,{online:{isHost:true},localSlot:0,control:true}),/id="betrayal-btn"/);
});
