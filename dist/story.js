// Every run shares the independence premise, but draws a different cast and operation.
export const WORLD={title:'東京、独立。',text:'午前6時。東京都が突然、独立国家「東京国」を宣言した。昨日までの都県境は、今日から国境。通勤・通学・観光で入っていた近県の住民は、一夜にして「帰国できない外国人」になった。',note:'一部の都民が自警団を結成する一方、帰郷を手助けする都民の協力者もいる。'};
export const HOMES=[
 {id:'saitama',pref:'埼玉県',citizen:'埼玉県民',cities:['さいたま市','川越市','所沢市'],tell:'財布の中の埼玉方面の定期券',color:'#b9cd91'},
 {id:'chiba',pref:'千葉県',citizen:'千葉県民',cities:['船橋市','柏市','千葉市'],tell:'スマートフォンに届いた千葉の帰宅通知',color:'#85c4c0'},
 {id:'kanagawa',pref:'神奈川県',citizen:'神奈川県民',cities:['横浜市','川崎市','藤沢市'],tell:'神奈川の住所が載った会員証',color:'#a8b5e7'}
];
export const SCENARIOS=[
 {id:'commuters',title:'終電のない通勤者たち',identity:'東京へ通勤していた会社員',reveal:'社員証を見せて都民を装ったが、通勤定期の行き先から県外居住が発覚した。',pursuer:'東京国・鉄道入国管理隊',start:'shinjuku',trait:'rail',tactic:'鉄道の改札で照合される。鉄道移動の追跡度が+2。',proof:'勤務先の県外居住証明',proofVerb:'居住証明を回収',proofSites:['tokyo','shinjuku','ueno'],ally:'帰宅できない同僚の救出',allyVerb:'同僚を救出',allySites:['kinshicho','shibuya','ikebukuro'],transmit:'家族への帰国ルート送信'},
 {id:'tourists',title:'日帰り旅行が、国際脱出に',identity:'東京観光に来ていた近県の友人',reveal:'「地元は東京」と言い張ったものの、お土産袋と帰りの切符を見られてしまった。',pursuer:'都民自警団・居残り隊',start:'ueno',trait:'crowd',tactic:'人混みから情報が漏れる。探索の追跡度が+2。',proof:'観光案内所の臨時出国証',proofVerb:'出国証を受け取る',proofSites:['ueno','tokyo','shinjuku'],ally:'はぐれた旅行仲間の救出',allyVerb:'旅行仲間を救出',allySites:['shibuya','ikebukuro','kinshicho'],transmit:'県外の迎え便へ集合連絡'},
 {id:'couriers',title:'県外ナンバーのラスト便',identity:'都内へ荷物を運んでいた配達員',reveal:'配送車が県外ナンバーだと分かり、追跡対象に。車を捨て、荷物だけを持って逃げ出した。',pursuer:'東京国・機動国境検問隊',start:'shinagawa',trait:'fast',tactic:'機動力の高い追跡隊。追跡度6以上で1ラウンドに2区間進む。',proof:'荷物に紛れた県外配送許可証',proofVerb:'配送許可証を回収',proofSites:['shinagawa','tokyo','shinjuku'],ally:'取り残された配送仲間の救出',allyVerb:'配送仲間を救出',allySites:['kinshicho','shibuya','ikebukuro'],transmit:'県境の受取人へ荷物の暗号を送信'},
 {id:'students',title:'放課後、国境ができた',identity:'県外から通学していた学生',reveal:'学生証の住所欄が新しい登録網に引っかかった。いつもの帰り道は、もう通れない。',pursuer:'東京国・学生登録巡回班',start:'ikebukuro',trait:'radio',tactic:'任務で動くたび登録網に検知される。任務実行の追跡度が+3。',proof:'学校に残された住所証明',proofVerb:'学生の住所証明を回収',proofSites:['shinjuku','ikebukuro','ueno'],ally:'連絡の取れない級友の救出',allyVerb:'級友を救出',allySites:['shibuya','kinshicho','ueno'],transmit:'県外の保護者へ救援信号'},
 {id:'reporters',title:'独立宣言の裏側を運べ',identity:'首都圏の共同取材チーム',reveal:'独立宣言の取材中に県外の記者証が露見した。証拠を持ち帰るまで、捕まるわけにはいかない。',pursuer:'東京国・都政保安巡回隊',start:'tokyo',trait:'sweep',tactic:'一斉捜索が続く。ラウンド開始時に追跡度が+1。',proof:'独立宣言の非公開議事録',proofVerb:'議事録を確保',proofSites:['tokyo','shinjuku','ueno'],ally:'情報を託した都民協力者の救出',allyVerb:'都民協力者を救出',allySites:['shibuya','ikebukuro','kinshicho'],transmit:'県外メディアへ証拠を送信'},
 {id:'concert',title:'アンコールの後は帰国便',identity:'同じライブで出会った県外のファン',reveal:'ライブ会場を出たら東京は独立済み。帰路を相談しているところを、都民自警団に聞かれた。',pursuer:'都民自警団・環状線監視班',start:'shibuya',trait:'gate',tactic:'出口の見張りが厳しい。脱出時は追跡度を4以下に下げる必要がある。',proof:'会場に預けた身分証の束',proofVerb:'身分証を回収',proofSites:['shinjuku','tokyo','ikebukuro'],ally:'迷子になったファン仲間の救出',allyVerb:'ファン仲間を救出',allySites:['shibuya','kinshicho','ueno'],transmit:'県外ファン連合へ脱出の合図'}
];
export const SCENARIO=Object.fromEntries(SCENARIOS.map(s=>[s.id,s]));
export function seededRandom(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let t=value;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export function makeStory(seed,count,{previousScenario,scenarioId}={}){
 const rng=seededRandom(seed),pick=list=>list[Math.floor(rng()*list.length)];
 let scenario=SCENARIO[scenarioId]||pick(SCENARIOS);
 if(!scenarioId&&scenario.id===previousScenario)scenario=SCENARIOS[(SCENARIOS.indexOf(scenario)+1+Math.floor(rng()*(SCENARIOS.length-1)))%SCENARIOS.length];
 const homes=[...HOMES];for(let i=homes.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[homes[i],homes[j]]=[homes[j],homes[i]]}
 const origins=Array.from({length:count},(_,i)=>{const home=homes[i%homes.length];return{home:home.id,city:pick(home.cities)}});
 const proof=pick(scenario.proofSites),ally=pick(scenario.allySites.filter(id=>id!==proof));
 const signals=['akihabara','kashiwa','haneda','narita'];const first=pick(signals),second=pick(signals.filter(id=>id!==first));
 return {scenario:scenario.id,origins,missions:[
  {id:'proof',kind:'proof',title:scenario.proof,verb:scenario.proofVerb,nodes:[proof],need:{},reward:{ticket:3},done:false,by:null},
  {id:'ally',kind:'ally',title:scenario.ally,verb:scenario.allyVerb,nodes:[ally],need:{food:2},reward:{food:4,gear:1},minPlayers:Math.min(count,2),done:false,by:null},
  {id:'transmit',kind:'transmit',title:scenario.transmit,verb:'帰国の暗号を送信',nodes:[first,second],requires:['proof','ally'],need:{signal:1},reward:{ticket:2},done:false,by:null}
 ]};
}
