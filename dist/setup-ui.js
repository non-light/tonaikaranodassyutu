import {ROLES} from './core.js';
import {difficultyPickerHTML} from './rules-ui.js';

export function setupHTML({difficulty='normal',role=0,soloOpen=false,hasSave=false}={}){
 return `<span class="setup-tag">ONLINE CO-OP / 2〜4人</span><h2>仲間と、オンライン。</h2><p class="panel-desc">それぞれのスマホで同じルームに参加。<br>自分の手番を、自分の端末で進めよう。</p>
 <div class="online-start-buttons"><button class="primary" id="setup-create"><span>ルームを作る</span><span>→</span></button><button class="secondary" id="setup-join">ルームコードで参加する</button></div>
 <ol class="online-steps"><li><b>1</b><span>1人がルームを作って、招待を送る</span></li><li><b>2</b><span>仲間が自分のスマホから参加する</span></li><li><b>3</b><span>2〜4人そろったら、ホストが出発！</span></li></ol>
 ${hasSave?'<button class="resume-btn" id="resume-btn">つづきから遊ぶ →</button>':''}
 <details id="solo-options" class="solo-options" ${soloOpen?'open':''}><summary>ひとりで遊ぶ</summary><div class="solo-content">${difficultyPickerHTML(difficulty)}<label class="field-label" for="solo-role">役割</label><select class="form-input" id="solo-role">${ROLES.map((r,i)=>`<option value="${i}" ${i===role?'selected':''}>${r.name} — ${r.perk}</option>`).join('')}</select><button class="primary" id="start-btn"><span>1人ではじめる</span><span>↗</span></button></div></details>`;
}

export function inviteURL(currentURL,code){
 const url=new URL(currentURL);
 url.search='';url.hash='';url.searchParams.set('room',code);
 return url.href;
}
