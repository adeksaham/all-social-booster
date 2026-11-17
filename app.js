const KEY='asb_personal_test_v1';
const platforms={TikTok:'♪',Instagram:'◎',Shopee:'S',Tokopedia:'T',Facebook:'f'};
const missions=[
 {id:'m1',title:'Buat satu video promosi',desc:'Buat video produk atau aktivitas bisnis dan unggah ke salah satu akunmu.',points:100},
 {id:'m2',title:'Bagikan tautan profil',desc:'Bagikan profil media sosial kepada calon pelanggan melalui kanal yang relevan.',points:50},
 {id:'m3',title:'Perbarui foto dan bio akun',desc:'Pastikan foto profil, deskripsi, dan informasi toko sudah jelas.',points:40},
 {id:'m4',title:'Buat konten cerita / story',desc:'Publikasikan story yang informatif dan tidak berulang atau spam.',points:60},
 {id:'m5',title:'Catat perkembangan follower',desc:'Perbarui jumlah follower di menu Statistik setelah memeriksa akunmu.',points:30}
];
let state=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{accounts:[],done:[],transactions:[],snapshots:[]}}catch(e){return {accounts:[],done:[],transactions:[],snapshots:[]}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function toast(t){let el=document.getElementById('toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function points(){return state.transactions.reduce((a,x)=>a+x.amount,0)}
function switchTab(id){document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.goto)));
document.getElementById('accountForm').addEventListener('submit',e=>{e.preventDefault();let a={id:crypto.randomUUID(),platform:platform.value,handle:handle.value.trim(),url:url.value.trim(),followers:Number(followers.value)||0,created:new Date().toISOString()};if(!/^https?:\/\//i.test(a.url)){toast('Masukkan tautan yang diawali https://');return}state.accounts.push(a);state.snapshots.push({accountId:a.id,followers:a.followers,date:new Date().toISOString()});e.target.reset();save();toast('Akun berhasil disimpan')});
function deleteAccount(id){if(confirm('Hapus akun ini dari aplikasi?')){state.accounts=state.accounts.filter(a=>a.id!==id);state.snapshots=state.snapshots.filter(s=>s.accountId!==id);save();toast('Akun dihapus')}}
function finishMission(id){if(state.done.includes(id))return;let m=missions.find(x=>x.id===id);state.done.push(id);state.transactions.push({id:crypto.randomUUID(),amount:m.points,label:'Misi: '+m.title,date:new Date().toISOString()});save();toast('Misi dicatat. Poin simulasi ditambahkan.')}
document.getElementById('snapshotForm').addEventListener('submit',e=>{e.preventDefault();let id=snapshotAccount.value,n=Number(snapshotFollowers.value);if(!id||!Number.isFinite(n)||n<0){toast('Pilih akun dan isi angka yang valid');return}state.snapshots.push({accountId:id,followers:n,date:new Date().toISOString()});let a=state.accounts.find(x=>x.id===id);if(a)a.followers=n;save();toast('Perkembangan disimpan')});
function render(){document.getElementById('points').textContent=points().toLocaleString('id-ID');document.getElementById('accountCount').textContent=state.accounts.length;document.getElementById('missionCount').textContent=state.done.length;
let cards=state.accounts.map(a=>`<div class="account"><div class="platform-icon">${platforms[a.platform]||'•'}</div><div><b>${esc(a.platform)} · ${esc(a.handle)}</b><small>${a.followers.toLocaleString('id-ID')} pengikut</small></div></div>`).join('');
document.getElementById('homeAccounts').innerHTML=cards||'<div class="card empty">Belum ada akun. Tambahkan akun pertamamu di menu Akun.</div>';
document.getElementById('accountList').innerHTML=state.accounts.map(a=>`<div class="card rowline"><div class="account" style="border:0;box-shadow:none;padding:0"><div class="platform-icon">${platforms[a.platform]}</div><div><b>${esc(a.platform)} · ${esc(a.handle)}</b><small>${a.followers.toLocaleString('id-ID')} pengikut</small><br><a href="${esc(a.url)}" target="_blank" rel="noopener">Buka profil ↗</a></div></div><button class="smallbtn danger" onclick="deleteAccount('${a.id}')">Hapus</button></div>`).join('')||'<div class="card empty">Belum ada akun tersimpan.</div>';
document.getElementById('missionList').innerHTML=missions.map(m=>{let done=state.done.includes(m.id);return `<article class="mission ${done?'done':''}"><div class="rowline"><h3>${esc(m.title)}</h3><span>+${m.points} poin</span></div><p>${esc(m.desc)}</p><button class="smallbtn ${done?'':'primary'}" ${done?'disabled':''} onclick="finishMission('${m.id}')">${done?'✓ Selesai':'Tandai selesai'}</button></article>`}).join('');
let select=document.getElementById('snapshotAccount');let old=select.value;select.innerHTML=state.accounts.map(a=>`<option value="${a.id}">${esc(a.platform)} - ${esc(a.handle)}</option>`).join('')||'<option value="">Tambahkan akun dahulu</option>';if(state.accounts.some(a=>a.id===old))select.value=old;
let snaps=[...state.snapshots].reverse().map(s=>{let a=state.accounts.find(x=>x.id===s.accountId);return a?`<div class="snapshot"><div class="rowline"><b>${esc(a.platform)} · ${esc(a.handle)}</b><small>${new Date(s.date).toLocaleDateString('id-ID')}</small></div><strong>${s.followers.toLocaleString('id-ID')}</strong> <small>pengikut</small></div>`:''}).join('');
document.getElementById('statsList').innerHTML=snaps||'<div class="card empty">Belum ada catatan perkembangan.</div>';
let tx=[...state.transactions].reverse().slice(0,5);document.getElementById('recent').innerHTML=tx.length?tx.map(t=>`<div class="rowline" style="padding:7px 0"><span>${esc(t.label)}</span><b>+${t.amount}</b></div>`).join(''):'Belum ada aktivitas. Mulai dengan menambahkan akun atau menyelesaikan misi.';
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.getElementById('installBtn').classList.remove('hidden')});
document.getElementById('installBtn').addEventListener('click',async()=>{if(!deferred){toast('Gunakan menu Chrome lalu Tambahkan ke layar utama');return}deferred.prompt();deferred=null});
render();