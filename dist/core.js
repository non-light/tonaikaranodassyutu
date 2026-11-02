import {SCENARIO,makeStory} from './story.js';
export const DIFFICULTIES={
 easy:{name:'簡単',rounds:30,foodBonus:6,ticketBonus:4,initialHeat:1,chaseAt:5,sprintAt:9,strikeLimit:4,exitHeat:7,description:'物資が多く、追跡はゆっくり。初めての帰国作戦に。'},
 normal:{name:'普通',rounds:24,foodBonus:0,ticketBonus:0,initialHeat:2,chaseAt:3,sprintAt:7,strikeLimit:3,exitHeat:6,description:'物資と追跡を見ながら、協力と駆け引きを楽しむ。'},
 hard:{name:'難しい',rounds:18,foodBonus:-2,ticketBonus:-2,initialHeat:3,chaseAt:2,sprintAt:5,strikeLimit:2,exitHeat:4,description:'物資は少なく、追跡は速い。限られた機会で脱出。'}
};
export function ruleSet(g){return g.version>=3?DIFFICULTIES[g.difficulty]||DIFFICULTIES.normal:{...DIFFICULTIES.normal,name:DIFFICULTIES[g.difficulty]?.name||'普通',rounds:g.limit}}
export function activePlayers(g){return g.players.filter(p=>!p.escaped)}
export function requiredRescuers(g,m){return Math.min(m.minPlayers||1,activePlayers(g).length)}
export function exitHeatLimit(g){return Math.min(ruleSet(g).exitHeat,SCENARIO[g.story?.scenario]?.trait==='gate'?4:10)}
export function scenarioTactic(g){const s=SCENARIO[g.story?.scenario];return s?.trait==='fast'?`機動力の高い追跡隊。追跡度${ruleSet(g).sprintAt-1}以上で1ラウンドに2区間進む。`:s?.tactic||''}
export const ROLES=[
 {name:'探索者',en:'SCOUT',icon:'⌕',color:'#efb45d',perk:'探索で食料を追加で2つ発見'},
 {name:'整備士',en:'ENGINEER',icon:'⚙',color:'#79c9c0',perk:'鉄道の乗車券消費が1枚少ない'},
 {name:'救護員',en:'MEDIC',icon:'✚',color:'#e38f9b',perk:'休息で全員の体力を2回復'},
 {name:'登山家',en:'CLIMBER',icon:'△',color:'#a9b6e7',perk:'山道の体力消費を2軽減'}
];
export const RES={food:{label:'食料',icon:'◒',color:'#e9bc78'},ticket:{label:'乗車券',icon:'▤',color:'#9accc2'},gear:{label:'山装備',icon:'△',color:'#b5b8e8'},signal:{label:'通信機',icon:'⌁',color:'#e2a3ae'}};
export const NODES=[
 ['kinshicho','錦糸町',35.697,139.814,'food','東東京の集合地点。ここから、全員で脱出する。'],
 ['akihabara','秋葉原',35.698,139.774,'signal','電気街で通信機を探せる。'],
 ['tokyo','東京',35.681,139.767,'ticket','中央ターミナル。各方面への乗車券が残る。'],
 ['ueno','上野',35.714,139.777,'food','北への玄関口。アメ横で食料を確保。'],
 ['ikebukuro','池袋',35.729,139.711,'gear','西側ルートに備え、アウトドア用品を探す。'],
 ['shinjuku','新宿',35.690,139.700,'ticket','中央線と山手線の分岐点。'],
 ['shibuya','渋谷',35.658,139.702,'food','取り残された店舗に食料がある。'],
 ['shinagawa','品川',35.628,139.739,'ticket','空港と港へ向かう南側の拠点。'],
 ['haneda','羽田空港',35.550,139.780,'signal','臨時便の管制周波数を確保せよ。','haneda'],
 ['yokohama','横浜港',35.450,139.647,'food','停泊する救援船へ、物資を持って集まろう。','port'],
 ['musashi','武蔵小杉',35.576,139.660,'food','多摩川を越えた先の補給地点。'],
 ['tachikawa','立川',35.698,139.414,'gear','都心を離れ、山の装備を整える。'],
 ['ome','青梅',35.790,139.259,'food','最後の市街地。山へ入る前に食料を。'],
 ['okutama','奥多摩',35.809,139.097,'gear','登山口に到着。県境の峠まであと一歩。'],
 ['naguri','県境の峠',35.863,139.123,'gear','奥多摩から埼玉へ。山越えの最終地点。','mountain'],
 ['omiya','大宮',35.906,139.624,'ticket','北へ向かう救援列車に乗り込め。','north'],
 ['kawagoe','川越',35.907,139.483,'food','旧市街の備蓄から、チームの食料を補給。'],
 ['funabashi','船橋',35.701,139.985,'food','東へ進む際の補給地点。'],
 ['chiba','千葉',35.613,140.113,'ticket','房総と空港へつながる駅。'],
 ['narita','成田空港',35.771,140.392,'signal','貨物便の乗員に救難信号を送る。','narita'],
 ['kashiwa','柏',35.863,139.970,'signal','常磐線沿線の無線中継ポイント。'],
 ['tsukuba','つくば',36.082,140.111,'gear','研究施設の装備を回収する。'],
 ['mito','水戸',36.371,140.477,'food','茨城の補給拠点。通信機を柏へ運べ。'],
 ['utsunomiya','宇都宮',36.559,139.883,'signal','栃木から救援信号を中継。'],
 ['takasaki','高崎',36.322,139.013,'gear','群馬方面の装備集積所。']
].map(([id,name,lat,lng,loot,desc,exit])=>({id,name,lat,lng,loot,desc,exit}));
export const NODE=Object.fromEntries(NODES.map(n=>[n.id,n]));
export const EDGES=[
 ['kinshicho','akihabara','rail','総武線'],['kinshicho','funabashi','rail','総武線'],
 ['akihabara','tokyo','loop','山手線'],['akihabara','ueno','loop','山手線'],['ueno','ikebukuro','loop','山手線'],['ikebukuro','shinjuku','loop','山手線'],['shinjuku','shibuya','loop','山手線'],['shibuya','shinagawa','loop','山手線'],['shinagawa','tokyo','loop','山手線'],
 ['shinagawa','haneda','rail','京急線'],['shinagawa','musashi','rail','横須賀線'],['musashi','yokohama','rail','東横線'],['shinjuku','tachikawa','rail','中央線'],['tachikawa','ome','rail','青梅線'],['ome','okutama','rail','青梅線'],['okutama','naguri','mountain','県境の山道'],['ome','naguri','mountain','名栗への山道'],
 ['ikebukuro','omiya','rail','埼京線'],['ikebukuro','kawagoe','rail','東武東上線'],['kawagoe','omiya','rail','川越線'],['kawagoe','naguri','foot','名栗への道'],['omiya','takasaki','rail','高崎線'],['omiya','utsunomiya','rail','宇都宮線'],
 ['ueno','kashiwa','rail','常磐線'],['kashiwa','tsukuba','rail','つくば方面'],['kashiwa','mito','rail','常磐線'],['funabashi','chiba','rail','総武線'],['chiba','narita','rail','成田線'],['funabashi','narita','rail','空港方面'],['funabashi','kashiwa','rail','東武野田線']
].map(([a,b,type,name],i)=>({id:i,a,b,type,name}));
export const EXITS=[
 {id:'haneda',node:'haneda',name:'羽田の最終便',en:'LAST FLIGHT',icon:'✈',tag:'空路',risk:'スピード重視',color:'#edb462',need:{ticket:4,signal:2},desc:'通信機で管制と交信し、臨時便の座席を確保する。'},
 {id:'narita',node:'narita',name:'成田の貨物便',en:'CARGO FLIGHT',icon:'✈',tag:'空路',risk:'長距離ルート',color:'#9accc2',need:{ticket:5,signal:1},desc:'千葉を横断。貨物便にチーム全員を乗せる。'},
 {id:'mountain',node:'naguri',name:'奥多摩の峠越え',en:'OVER THE RIDGE',icon:'△',tag:'徒歩',risk:'体力と装備',color:'#b2b5e7',need:{gear:3,food:4},desc:'東東京から西へ。奥多摩を経由し、埼玉側へ山を越える。'},
 {id:'port',node:'yokohama',name:'横浜港の救援船',en:'RESCUE VESSEL',icon:'⚓',tag:'海路',risk:'物資を届ける',color:'#80b7d2',need:{food:6,signal:1},desc:'多摩川を渡り、救援船へ食料と通信機を運ぶ。'},
 {id:'north',node:'omiya',name:'大宮の救援列車',en:'NORTHBOUND',icon:'▥',tag:'鉄道',risk:'通信を確保',color:'#b8cb90',need:{ticket:3,signal:3},desc:'関東北部の仲間と連絡を取り、北へ向かう特別列車へ。'}
];
export const EVENTS=[
 {name:'静かな街',text:'まだ列車は動いている。まずは物資と脱出経路を確認しよう。',kind:'calm'},
 {name:'臨時配給',text:'残された備蓄を発見。チームの食料が4増えた。',kind:'supply'},
 {name:'山手線の運転見合わせ',text:'このラウンドは山手線の列車が使えない。徒歩なら移動できる。',kind:'blackout'},
 {name:'雨雲の接近',text:'山道の体力消費が1増える。休息と食料を忘れずに。',kind:'rain'},
 {name:'臨時列車の運行',text:'このラウンドは鉄道の乗車券消費が1枚少ない。',kind:'train'},
 {name:'遠くからの無線',text:'救援隊の周波数を受信。通信機を1つ獲得した。',kind:'radio'},
 {name:'静かな街',text:'道路は通れる。仲間の位置を確認し、集合地点を決めよう。',kind:'calm'}
];
export function createGame(count=1,difficulty='normal',names=[],roleIds=[],options={}){
 count=Math.floor(Math.max(1,Math.min(4,Number(count)||1)));
 difficulty=Object.hasOwn(DIFFICULTIES,difficulty)?difficulty:'normal';
 const rules=DIFFICULTIES[difficulty],seed=Number.isInteger(options.seed)?options.seed>>>0:Math.floor(Math.random()*4294967296),story=makeStory(seed,count,options),scenario=SCENARIO[story.scenario];
 return {version:3,status:'playing',difficulty,betrayal:count>1&&options.betrayal!==false,round:1,limit:rules.rounds,turn:0,ap:2,event:0,seed,story,pursuit:{pos:scenario.start,target:null,heat:rules.initialHeat,strikes:0,stunned:0},players:Array.from({length:count},(_,i)=>({id:i,name:(names[i]||`プレイヤー ${i+1}`).slice(0,16),role:roleIds[i]??i,pos:'kinshicho',hp:8,origin:story.origins[i],hiddenUntil:0,detained:0,escaped:false,escapeKind:null,escapeExit:null,escapeRound:null,betrayalUsed:false,borderPass:false})),resources:{food:14+count*2+rules.foodBonus,ticket:12+count*2+rules.ticketBonus,gear:0,signal:0},searched:[],log:[{round:1,text:`東京国が独立を宣言。「${scenario.title}」作戦開始。難易度：${rules.name}。帰国作戦が始まった。`}],goal:'haneda',ending:null};
}
export function log(g,text){g.log.unshift({round:g.round,text});g.log=g.log.slice(0,50)}
export function neighbors(pos){return EDGES.filter(e=>e.a===pos||e.b===pos).map(e=>({...e,to:e.a===pos?e.b:e.a}))}
export function moveCost(g,to,mode='rail'){
 const p=g.players[g.turn],e=neighbors(p.pos).find(e=>e.to===to);if(!e)return {error:'隣接する地点を選んでください。'};
 const mountain=e.type==='mountain',walk=mode==='foot'||e.type==='foot'||mountain;
 if(!walk&&e.type==='loop'&&EVENTS[g.event].kind==='blackout')return{error:'山手線は運転見合わせ中。徒歩を選べます。'};
 const hp=mountain?Math.max(1,4-(p.role===3?2:0)+(EVENTS[g.event].kind==='rain'?1:0)):walk?2:0;
 const ticket=walk?0:Math.max(0,(e.type==='loop'?1:2)-(p.role===1?1:0)-(EVENTS[g.event].kind==='train'?1:0));
 if(p.hp<hp)return {error:'体力が足りません。食料を使って休息してください。',hp,ticket};
 if(g.resources.ticket<ticket)return{error:'乗車券が足りません。徒歩で移動するか、駅で探索してください。',hp,ticket};
 if(mountain&&g.resources.gear<1)return{error:'山道には山装備が1つ以上必要です。',hp,ticket};
 return {hp,ticket,walk,mountain,edge:e};
}
export function escapeCheck(g,exitId){const exit=EXITS.find(e=>e.id===exitId);if(!exit)return {ok:false,reasons:['脱出地点を選んでください。']};const reasons=[];if(activePlayers(g).some(p=>p.pos!==exit.node))reasons.push('未脱出の全員がこの地点に集合する');for(const[k,v]of Object.entries(exit.need))if(g.resources[k]<v)reasons.push(`${RES[k].label} あと${v-g.resources[k]}`);if(g.story){const remaining=g.story.missions.filter(m=>!m.done).length;if(remaining)reasons.push(`帰国任務 あと${remaining}件`);const threshold=exitHeatLimit(g);if(g.pursuit.heat>threshold)reasons.push(`追跡度を${threshold}以下に下げる`);if(g.pursuit.pos===exit.node&&!g.pursuit.stunned)reasons.push('追跡隊を陽動して出口から離す');}return{ok:reasons.length===0,reasons,exit}}
export function soloEscapeCheck(g,exitId=NODE[g.players[g.turn].pos].exit){
 const p=g.players[g.turn],exit=EXITS.find(e=>e.id===exitId),reasons=[];
 if(!g.betrayal||g.players.length<2)reasons.push('この遠征ではその行動を選べません。');
 if(p.escaped)reasons.push('すでに脱出しています。');
 if(!exit||p.pos!==exit.node)reasons.push('脱出地点まで移動する');
 if(!g.story?.missions.find(m=>m.id==='proof')?.done)reasons.push('先にAの証明書回収を達成する');
 const need=exit?Object.fromEntries(Object.entries(exit.need).map(([k,v])=>[k,Math.ceil(v/2)])):{};
 for(const[k,v]of Object.entries(need))if(g.resources[k]<v)reasons.push(`${RES[k].label} あと${v-g.resources[k]}`);
 if(g.pursuit&&g.pursuit.heat>exitHeatLimit(g)&&!p.borderPass)reasons.push(`追跡度を${exitHeatLimit(g)}以下に下げるか、密告で個人通行証を得る`);
 if(exit&&g.pursuit?.pos===exit.node&&!g.pursuit.stunned)reasons.push('追跡隊を陽動して出口を通れる状態にする');
 return{ok:reasons.length===0,reasons,exit,need};
}
export function denounceCheck(g,targetId){
 const p=g.players[g.turn],target=g.players.find(x=>x.id===targetId),reasons=[];
 if(!g.betrayal||g.players.length<2)reasons.push('この遠征ではその行動を選べません。');
 if(p.escaped)reasons.push('脱出済みの人は行動できません。');
 if(p.betrayalUsed)reasons.push('密告は1人につき1回までです。');
 if(!target||target.id===p.id||target.escaped)reasons.push('未脱出の仲間を選んでください。');
 return{ok:reasons.length===0,reasons,target};
}
function markEscaped(g,p,kind,exitId){p.escaped=true;p.escapeKind=kind;p.escapeExit=exitId;p.escapeRound=g.round;p.hiddenUntil=0}
export function missionCheck(g,missionId){
 const m=g.story?.missions.find(x=>x.id===missionId),p=g.players[g.turn],reasons=[];
 if(!m)return{ok:false,reasons:['この任務はありません。']};
 if(m.done)reasons.push('この任務は達成済みです。');
 if(!m.nodes.includes(p.pos))reasons.push(`実行地点：${m.nodes.map(id=>NODE[id].name).join(' または ')}`);
 if(m.requires?.some(id=>!g.story.missions.find(x=>x.id===id)?.done))reasons.push('先に証明書回収と救出の任務を達成する');
 const required=requiredRescuers(g,m);if(activePlayers(g).filter(x=>x.pos===p.pos).length<required)reasons.push(`仲間${required}人が同じ地点に集合する`);
 for(const[k,v]of Object.entries(m.need))if(g.resources[k]<v)reasons.push(`${RES[k].label} あと${v-g.resources[k]}`);
 return{ok:reasons.length===0,reasons,mission:m};
}
export function isHidden(g,p){return !!g.story&&p.hiddenUntil>=g.round}
export function pursuitDistance(from,to){
 if(from===to)return 0;const queue=[[from,0]],seen=new Set([from]);
 for(let i=0;i<queue.length;i++){const[pos,d]=queue[i];for(const e of neighbors(pos)){if(e.to===to)return d+1;if(!seen.has(e.to)){seen.add(e.to);queue.push([e.to,d+1])}}}return Infinity;
}
function noise(g,p,type){if(!g.pursuit)return;const trait=SCENARIO[g.story.scenario].trait;let amount=type==='mission'?2:1;if((type==='rail'&&trait==='rail')||(type==='search'&&trait==='crowd'))amount=2;if(type==='mission'&&trait==='radio')amount=3;g.pursuit.heat=Math.min(10,g.pursuit.heat+amount);g.pursuit.target=p.pos;p.hiddenUntil=0}
function intercept(g,players){
 if(!players.length||g.pursuit.stunned)return;g.pursuit.strikes++;g.pursuit.heat=Math.max(0,g.pursuit.heat-2);g.resources.food=Math.max(0,g.resources.food-2);
 for(const p of players){p.pos='kinshicho';p.hp=Math.max(0,p.hp-2);p.detained=1;p.hiddenUntil=0}
 const maximum=ruleSet(g).strikeLimit;log(g,`追跡隊に発見された（${g.pursuit.strikes}/${maximum}回）。${players.map(p=>p.name).join('・')}は錦糸町へ送還。体力−2、次の手番は1行動。食料を2没収。`);
 if(g.pursuit.strikes>=maximum){g.status='lost';g.ending='captured';log(g,`${maximum}度目の拘束。国境が完全封鎖され、残った人は帰国の機会を失った。`)}
}
function advancePursuit(g){
 if(!g.pursuit)return;const q=g.pursuit,scenario=SCENARIO[g.story.scenario],rules=ruleSet(g),players=activePlayers(g);
 if(q.stunned){q.stunned--;log(g,'陽動に成功。追跡隊はこのラウンド移動しない。');return}
 if(scenario.trait==='sweep')q.heat=Math.min(10,q.heat+1);
 const caught=new Set();
 if(q.heat>=rules.chaseAt&&q.target){const steps=q.heat>=rules.sprintAt-(scenario.trait==='fast'?1:0)?2:1;for(let i=0;i<steps&&q.pos!==q.target;i++){const e=neighbors(q.pos).sort((a,b)=>pursuitDistance(a.to,q.target)-pursuitDistance(b.to,q.target))[0];if(e)q.pos=e.to;players.filter(p=>p.pos===q.pos&&!isHidden(g,p)).forEach(p=>caught.add(p))}}
 players.filter(p=>p.pos===q.pos&&!isHidden(g,p)).forEach(p=>caught.add(p));intercept(g,[...caught]);
 log(g,`${scenario.pursuer}：現在地は${NODE[q.pos].name}。${q.heat>=rules.chaseAt&&q.target?`最後の目撃情報「${NODE[q.target].name}」を追跡中。`:'手がかりを見失っている。'}`);
}
export function act(state,action){
 const g=structuredClone(state);if(g.status!=='playing')return{error:'この遠征は終了しています。'};
 const p=g.players[g.turn];if(p.escaped)return{error:'脱出済みの人は行動できません。'};if(action.type==='goal'){if(!EXITS.some(e=>e.id===action.goal))return{error:'不明なルートです。'};g.goal=action.goal;return{state:g}}
 if(action.type==='end'){nextTurn(g);return{state:g}}
 if(action.type==='escape'){const check=escapeCheck(g,NODE[p.pos].exit);if(!check.ok)return{error:check.reasons.join(' / ')};for(const[k,v]of Object.entries(check.exit.need))g.resources[k]-=v;activePlayers(g).forEach(x=>markEscaped(g,x,'team',check.exit.id));g.status='won';g.ending=check.exit.id;log(g,`残っていた全員が「${check.exit.name}」で脱出に成功した。`);return{state:g}}
 if(action.type==='soloEscape'){const check=soloEscapeCheck(g);if(!check.ok)return{error:check.reasons.join(' / ')};for(const[k,v]of Object.entries(check.need))g.resources[k]-=v;markEscaped(g,p,'solo',check.exit.id);p.borderPass=false;log(g,`${p.name}が仲間を待たず、「${check.exit.name}」から単独脱出した。${activePlayers(g).length?'残された人の遠征は続く。':'全員の帰国が確定した。'}`);if(!activePlayers(g).length){g.status='won';g.ending='separate'}else nextTurn(g);return{state:g}}
 if(g.ap<=0)return{error:'行動を終えて、次の仲間に交代してください。'};
 if(action.type==='move'){const c=moveCost(g,action.to,action.mode);if(c.error)return{error:c.error};p.hp-=c.hp;g.resources.ticket-=c.ticket;p.pos=action.to;if(g.story){p.hiddenUntil=0;if(!c.walk)noise(g,p,'rail')}log(g,`${p.name} → ${NODE[p.pos].name}（${c.walk?'徒歩・目撃情報なし':c.edge.name}）`)}
 else if(action.type==='search'){if(g.searched.includes(p.pos))return{error:'この地点は探索済みです。'};const k=NODE[p.pos].loot,v={food:6,ticket:5,gear:2,signal:2}[k];g.resources[k]+=v;if(p.role===0)g.resources.food+=2;g.searched.push(p.pos);noise(g,p,'search');log(g,`${p.name}が${NODE[p.pos].name}で${RES[k].label}を${v}発見${p.role===0?'。食料も2獲得':''}。`)}
 else if(action.type==='rest'){if(g.resources.food<1)return{error:'休息には食料が1つ必要です。'};g.resources.food--;p.hp=Math.min(8,p.hp+4);if(p.role===2)activePlayers(g).forEach(other=>other.hp=Math.min(8,other.hp+2));log(g,`${p.name}が休息して体力を回復した。`)}
 else if(action.type==='mission'){const check=missionCheck(g,action.id);if(!check.ok)return{error:check.reasons.join(' / ')};const m=check.mission;for(const[k,v]of Object.entries(m.need))g.resources[k]-=v;for(const[k,v]of Object.entries(m.reward))g.resources[k]+=v;m.done=true;m.by=p.id;noise(g,p,'mission');if(m.kind==='transmit')g.pursuit.heat=Math.max(0,g.pursuit.heat-3);log(g,`任務達成：${m.title}（${p.name}）。`)}
 else if(action.type==='hide'){if(!g.pursuit)return{error:'この遠征では潜伏を使いません。'};g.pursuit.heat=Math.max(0,g.pursuit.heat-3);p.hiddenUntil=g.round+1;log(g,`${p.name}が路地に潜伏。追跡度−3。次のラウンドまで発見を防ぐ。`)}
 else if(action.type==='decoy'){if(!g.pursuit)return{error:'この遠征では陽動を使いません。'};if(g.resources.signal<1)return{error:'陽動には通信機が1つ必要です。'};g.resources.signal--;g.pursuit.heat=Math.max(0,g.pursuit.heat-4);g.pursuit.stunned=1;g.pursuit.target=null;p.hiddenUntil=g.round+1;log(g,`${p.name}が偽の目撃情報を流した。追跡度−4、追跡隊を1ラウンド足止め。`)}
 else if(action.type==='denounce'){const check=denounceCheck(g,action.target);if(!check.ok)return{error:check.reasons.join(' / ')};p.betrayalUsed=true;p.borderPass=true;check.target.hiddenUntil=0;g.pursuit.target=check.target.pos;g.pursuit.heat=Math.min(10,g.pursuit.heat+3);log(g,`裏切り：${p.name}が${check.target.name}の居場所「${NODE[check.target.pos].name}」を密告。追跡度+3、対象の潜伏を解除。${p.name}は個人通行証を得た。`)}
 else return{error:'不明な行動です。'};
 g.ap--;if(g.pursuit&&['move','search','mission'].includes(action.type)&&p.pos===g.pursuit.pos&&!isHidden(g,p))intercept(g,[p]);return{state:g};
}
function nextTurn(g){
 const active=activePlayers(g);if(!active.length){g.status='won';g.ending='separate';return}
 const setAP=()=>{const p=g.players[g.turn];g.ap=p.detained?1:2;p.detained=0};
 const next=active.find(p=>p.id>g.turn);if(next){g.turn=next.id;setAP();return}
 g.turn=active[0].id;g.ap=2;g.round++;
 if(g.round>g.limit){g.status='lost';g.ending='time';log(g,'すべての脱出便が締め切られた。遠征はここで終了。');return}
 const eaten=Math.min(g.resources.food,active.length);g.resources.food-=eaten;if(eaten<active.length){active.forEach(p=>p.hp=Math.max(0,p.hp-2));log(g,'食料不足。未脱出の全員の体力が2減った。探索を急ごう。')}
 g.event=1+((g.round+g.seed)%6);if(EVENTS[g.event].kind==='supply')g.resources.food+=4;if(EVENTS[g.event].kind==='radio')g.resources.signal++;
 log(g,`${EVENTS[g.event].name}：${EVENTS[g.event].text}`);
 advancePursuit(g);if(g.status!=='playing')return;setAP();
 const anyProgress=active.some(p=>{if(!g.searched.includes(p.pos)||g.resources.food>0)return true;const view={...g,turn:p.id};return neighbors(p.pos).some(e=>!moveCost(view,e.to,'rail').error||!moveCost(view,e.to,'foot').error)||g.story?.missions.some(m=>!m.done&&missionCheck(view,m.id).ok)||g.betrayal&&soloEscapeCheck(view).ok});
 if(!anyProgress){g.status='lost';g.ending='exhausted';log(g,'食料と体力が尽き、全員が移動できなくなった。')}
}
