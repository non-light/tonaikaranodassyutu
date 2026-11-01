import {NODE,NODES,EXITS,RES,neighbors,pursuitDistance,missionCheck,escapeCheck,exitHeatLimit,activePlayers} from './core.js';

export function routeBetween(from,to){
 const queue=[[from]],seen=new Set([from]);
 for(let i=0;i<queue.length;i++){const path=queue[i],last=path.at(-1);if(last===to)return path;for(const e of neighbors(last))if(!seen.has(e.to)){seen.add(e.to);queue.push([...path,e.to])}}
 return [];
}
function closest(from,ids){return [...ids].sort((a,b)=>pursuitDistance(from,a)-pursuitDistance(from,b))[0]}
function supplyGoal(g,key,amount){const p=g.players[g.turn],sites=NODES.filter(n=>n.loot===key&&!g.searched.includes(n.id));if(!sites.length)return null;return{kind:'gather',node:closest(p.pos,sites.map(n=>n.id)),label:`${RES[key].label}を集めよう`,detail:`あと${amount}必要です。到着したら「探索する」。`,resource:key}}
export function objectiveFor(g,navigationTarget=null){
 const p=g.players[g.turn];
 if(navigationTarget&&NODE[navigationTarget]&&navigationTarget!==p.pos)return{kind:'navigate',node:navigationTarget,label:`${NODE[navigationTarget].name}へ向かおう`,detail:'選んだ地点への道順を表示しています。'};
 const pending=g.story?.missions.filter(m=>!m.done)||[];
 const here=pending.find(m=>m.nodes.includes(p.pos)&&missionCheck(g,m.id).ok);
 const mission=here||pending.find(m=>!m.requires?.some(id=>!g.story.missions.find(x=>x.id===id)?.done));
 if(mission){for(const[k,v]of Object.entries(mission.need))if(g.resources[k]<v){const supply=supplyGoal(g,k,v-g.resources[k]);if(supply)return supply}return{kind:'mission',node:closest(p.pos,mission.nodes),missionId:mission.id,label:mission.kind==='proof'?'まずは証明書を手に入れよう':mission.kind==='ally'?'取り残された仲間を助けよう':'県外へ帰国の連絡をしよう',detail:mission.kind==='proof'?'任務A。目的地で「任務を実行」を押します。':mission.kind==='ally'?'任務B。必要な人数で集まって救出します。':'任務C。通信機を1つ使って連絡します。'}}
 const exit=EXITS.find(e=>e.id===g.goal)||EXITS[0];
 for(const[k,v]of Object.entries(exit.need))if(g.resources[k]<v){const supply=supplyGoal(g,k,v-g.resources[k]);if(supply)return supply}
 return{kind:'exit',node:exit.node,exitId:exit.id,label:`${NODE[exit.node].name}に集まろう`,detail:`${exit.name}からの帰国を目指しています。`};
}
export function guidanceFor(g,navigationTarget=null){
 const p=g.players[g.turn],goal=objectiveFor(g,navigationTarget),path=routeBetween(p.pos,goal.node),result={...goal,path,next:path[1]||null};
 const escape=NODE[p.pos].exit?escapeCheck(g,NODE[p.pos].exit):null;
 if(escape?.ok)return{...result,title:'帰国の準備ができました',text:'全員が集まり、必要な任務と物資もそろっています。',action:'escape'};
 if(g.ap===0)return{...result,title:'この手番の行動はおしまい',text:activePlayers(g).length>1?'下の交代ボタンを押しましょう。':'下の「次へ進む」で、また2回行動できます。',action:'end'};
 if(g.pursuit&&g.pursuit.heat>exitHeatLimit(g))return{...result,title:'追跡度が高くなっています',text:'「隠れる」で追跡度を3下げられます。',action:'hide'};
 if(goal.node===p.pos){
  if(goal.kind==='gather')return{...result,title:`ここで${RES[goal.resource].label}を集めよう`,text:'「探索する」を1回押せば、チーム全員で使えます。',action:'search'};
  if(goal.kind==='mission'){const check=missionCheck(g,goal.missionId);return{...result,title:check.ok?'この場所で任務を実行できます':'仲間や物資を待ちましょう',text:check.ok?'緑の「任務を実行」ボタンを押しましょう。':check.reasons.join('。'),action:check.ok?'mission':'team'}}
  if(goal.kind==='exit')return{...result,title:'もう少しで帰国できます',text:escape?.reasons.join('。')||goal.detail,action:'team'};
 }
 if(p.hp<=2&&g.resources.food>0)return{...result,title:'移動する前に、体力を回復しよう',text:'「休む」で食料を1つ使い、体力を4回復できます。',action:'rest'};
 return{...result,title:goal.label,text:`目的地：${NODE[goal.node].name}（あと${Math.max(0,path.length-1)}区間）。${goal.detail}`,action:'move'};
}
