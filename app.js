"use strict";
/* SaveBox: رسايلك وملفاتك بين كل أجهزتك. الربط برقم الموبايل + QR، ومزامنة لحظية عبر Supabase. */
const CFG=window.SB_CFG||{};
const Q=new URLSearchParams(location.search),DEV=Q.get("dev")||"";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ls={get(k,d){try{const v=localStorage.getItem("sb_"+DEV+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("sb_"+DEV+k,JSON.stringify(v))}catch(e){}}};

/* ---------- النصوص (عربي / English) ---------- */
const T={ar:{
tagline:"رسايلك وملفاتك على كل أجهزتك",tagsub:"زي الشات مع نفسك، بس أحسن: صور وفيديوهات وروابط وملفات، وتوصل لكل جهاز فوراً.",
start_new:"ابدأ مساحة جديدة",start_new_s:"ده أول جهاز عندي",link_existing:"اربط بجهاز موجود",link_existing_s:"امسح QR من جهازك التاني",
your_name:"اسمك",phone:"رقم الموبايل",phone_ph:"01012345678",device_name:"اسم الجهاز ده",create:"إنشاء المساحة",back:"رجوع",
phone_note:"الرقم ده بيربط أجهزتك ببعض. اكتب نفس الرقم على كل جهاز.",
link_title:"اربط الجهاز ده",link_how:"افتح SaveBox على جهازك المربوط، واضغط «ربط جهاز»، ووجّه الكاميرا على الكود ده.",
link_phone:"اكتب الرقم اللي سجّلت بيه المساحة",show_qr:"اعرض الـ QR",or_code:"أو اكتب الكود ده على الجهاز التاني",expires:"ينتهي خلال {0}",waiting:"في انتظار موافقة جهازك التاني...",cancel:"إلغاء",
scan_title:"ربط جهاز جديد",scan_hint:"وجّه الكاميرا على الـ QR اللي ظاهر على الجهاز الجديد.",manual_code:"أو اكتب الكود يدوي",approve:"ربط",no_cam:"الكاميرا مش متاحة هنا. اكتب الكود يدوي.",linked_ok:"اتربط «{0}» ✓",new_dev:"جهاز جديد اتربط: {0}",
msg_ph:"اكتب رسالة أو الصق صورة...",send:"إرسال",attach:"إرفاق ملف",copy:"نسخ",copied:"اتنسخ",del:"حذف",sure:"تأكيد؟",open:"فتح",download:"تحميل",
empty_t:"مفيش حاجة هنا لسه",empty_s:"ابعت رسالة أو ملف، أو الصق صورة (Ctrl+V)، وهتظهر على كل أجهزتك فوراً.",older:"تحميل الأقدم",newer:"رسائل جديدة ↓",uploading:"جاري الرفع...",too_big:"الملف أكبر من الحد ({0} ميجا). غيّره من الإعدادات.",
connected:"متصل",connecting:"بيحاول يتصل...",devices_n:"{0} أجهزة",today:"النهارده",yesterday:"امبارح",just_now:"دلوقتي",min_ago:"من {0} د",hr_ago:"من {0} س",day_ago:"من {0} يوم",
settings:"الإعدادات",s_space:"المساحة",s_this:"الجهاز ده",s_devices:"الأجهزة المربوطة",s_look:"المظهر واللغة",s_files:"الملفات",s_danger:"منطقة الخطر",
space_name:"اسم المساحة",save:"حفظ",saved:"اتحفظ",this_dev:"الجهاز ده",last_seen:"آخر ظهور {0}",remove:"فصل",remove_others:"فصل كل الأجهزة التانية",link_device:"ربط جهاز جديد",
theme:"المظهر",auto:"تلقائي",light:"فاتح",dark:"داكن",lang:"اللغة",max_size:"أقصى حجم للملف: {0} ميجا",compress:"ضغط الصور (مقاس واتساب)",install:"تثبيت التطبيق",
leave:"اخرج من الجهاز ده",wipe:"امسح كل حاجة نهائياً",c_remove:"تفصل «{0}»؟ هيحتاج يتربط تاني.",c_others:"هتفصل كل الأجهزة التانية. تكمل؟",c_leave:"الجهاز ده هيتفصل عن المساحة. تكمل؟",c_wipe:"هتمسح كل الرسائل والملفات من كل الأجهزة نهائياً. تأكيد؟",yes:"أيوه",no:"لأ",
e_phone:"الرقم مش نفس الرقم المسجل في المساحة.",e_invalid:"الكود غلط أو انتهى. اطلب كود جديد.",e_already:"الجهاز ده مربوط بالفعل.",e_limit:"وصلت لأقصى عدد أجهزة (6).",e_nospace:"الجهاز ده مش مربوط بمساحة.",e_busy:"الخدمة مشغولة. جرّب بعد شوية.",e_storage_full:"المساحة امتلت (400 ميجا). امسح ملفات قديمة.",e_net:"مفيش اتصال. جرّب تاني.",e_generic:"حصل خطأ. جرّب تاني.",e_name:"اكتب اسمك.",e_phone_f:"اكتب رقم موبايل صحيح.",e_auth:"مش قادر أدخل. تأكد إن «الدخول المجهول» متفعّل في Supabase.",
kicked:"الجهاز ده اتفصل عن المساحة. اربطه تاني.",no_cfg:"التطبيق لسه مش مربوط بقاعدة البيانات.",shared_ok:"اتبعت من المشاركة ✓",
d_android:"موبايل أندرويد",d_iphone:"آيفون",d_linux:"لابتوب لينكس",d_win:"ويندوز",d_mac:"ماك",d_other:"جهاز"},
en:{
tagline:"Your notes and files, on every device",tagsub:"Like chatting with yourself, only better: photos, videos, links and files that show up on all your devices instantly.",
start_new:"Start a new space",start_new_s:"This is my first device",link_existing:"Link to an existing device",link_existing_s:"Scan a QR from your other device",
your_name:"Your name",phone:"Phone number",phone_ph:"+201012345678",device_name:"This device's name",create:"Create space",back:"Back",
phone_note:"This number ties your devices together. Use the same number everywhere.",
link_title:"Link this device",link_how:"Open SaveBox on your linked device, tap “Link device”, and point the camera at this code.",
link_phone:"Enter the phone number your space was created with",show_qr:"Show QR",or_code:"Or type this code on the other device",expires:"Expires in {0}",waiting:"Waiting for approval on your other device...",cancel:"Cancel",
scan_title:"Link a new device",scan_hint:"Point the camera at the QR shown on the new device.",manual_code:"Or type the code manually",approve:"Link",no_cam:"Camera isn't available here. Type the code manually.",linked_ok:"“{0}” linked ✓",new_dev:"New device linked: {0}",
msg_ph:"Type a message or paste an image...",send:"Send",attach:"Attach file",copy:"Copy",copied:"Copied",del:"Delete",sure:"Sure?",open:"Open",download:"Download",
empty_t:"Nothing here yet",empty_s:"Send a message or a file, or paste an image (Ctrl+V). It shows up on all your devices instantly.",older:"Load older",newer:"New messages ↓",uploading:"Uploading...",too_big:"File is over the limit ({0} MB). Change it in Settings.",
connected:"Connected",connecting:"Connecting...",devices_n:"{0} devices",today:"Today",yesterday:"Yesterday",just_now:"just now",min_ago:"{0} min ago",hr_ago:"{0} h ago",day_ago:"{0} d ago",
settings:"Settings",s_space:"Space",s_this:"This device",s_devices:"Linked devices",s_look:"Look and language",s_files:"Files",s_danger:"Danger zone",
space_name:"Space name",save:"Save",saved:"Saved",this_dev:"This device",last_seen:"Last seen {0}",remove:"Unlink",remove_others:"Unlink all other devices",link_device:"Link a new device",
theme:"Theme",auto:"Auto",light:"Light",dark:"Dark",lang:"Language",max_size:"Max file size: {0} MB",compress:"Compress images (chat size)",install:"Install app",
leave:"Leave from this device",wipe:"Delete everything permanently",c_remove:"Unlink “{0}”? It will need to be linked again.",c_others:"This unlinks all other devices. Continue?",c_leave:"This device will leave the space. Continue?",c_wipe:"This permanently deletes every message and file on all devices. Sure?",yes:"Yes",no:"No",
e_phone:"That isn't the phone number registered for this space.",e_invalid:"The code is wrong or expired. Get a new one.",e_already:"This device is already linked.",e_limit:"Device limit reached (6).",e_nospace:"This device isn't linked to a space.",e_busy:"Service is busy. Try again shortly.",e_storage_full:"Space is full (400 MB). Delete old files.",e_net:"No connection. Try again.",e_generic:"Something went wrong. Try again.",e_name:"Enter your name.",e_phone_f:"Enter a valid phone number.",e_auth:"Can't sign in. Make sure Anonymous sign-ins is enabled in Supabase.",
kicked:"This device was unlinked from the space. Link it again.",no_cfg:"The app isn't connected to its database yet.",shared_ok:"Sent from Share ✓",
d_android:"Android phone",d_iphone:"iPhone",d_linux:"Linux laptop",d_win:"Windows PC",d_mac:"Mac",d_other:"Device"}};
let LANG=ls.get("lang",(navigator.language||"ar").toLowerCase().startsWith("ar")?"ar":"en");
const t=(k,...a)=>{let s=(T[LANG]&&T[LANG][k])||T.ar[k]||k;a.forEach((v,i)=>{s=s.replace("{"+i+"}",v)});return s};
function applyLang(){document.documentElement.lang=LANG;document.documentElement.dir=LANG==="ar"?"rtl":"ltr";const sp_=$("#spsub");if(sp_)sp_.textContent=t("tagline")}
function applyTheme(){const m=ls.get("theme","auto"),r=document.documentElement;if(m==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",m);const mt=$('meta[name=theme-color]');if(mt)mt.content=getComputedStyle(r).getPropertyValue("--bg").trim()||"#0A0F1A"}

/* ---------- أيقونات ---------- */
const P={attach:'<path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.9-8.9a3.4 3.4 0 014.8 4.8l-8.9 8.9a1.7 1.7 0 01-2.4-2.4l8-8"/>',send:'<path d="M3 11.5L21 3l-8.5 18-2.2-7.3L3 11.5z"/><path d="M10.3 13.7L21 3"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',dl:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',scan:'<path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2M4 12h16"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',file:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',laptop:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',open:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/>',link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||""}</svg>`;
const LOGO=`<svg class="lg" viewBox="0 0 64 64" fill="none" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#121A2B"/><g stroke="#EAF0FF" stroke-width="3"><path d="M14 26l18-9 18 9v20l-18 9-18-9z"/><path d="M14 26l18 9 18-9M32 35v20"/></g><circle cx="32" cy="35" r="4.6" fill="#FF8A3D"/></svg>`;

/* ---------- حالة التطبيق ---------- */
const S={sb:null,uid:null,space:null,items:[],urls:{},urlAt:0,ch:null,online:false,more:true,pending:0,inst:null,timers:{}};
let sb=null;
const hue=s=>{let h=0;for(const c of String(s||"?"))h=(h*31+c.charCodeAt(0))%360;return h};
const kindOf=m=>/^image\//.test(m||"")?"image":/^video\//.test(m||"")?"video":/^audio\//.test(m||"")?"audio":"file";
const fmtSize=n=>{n=+n||0;return n<1024?n+" B":n<1048576?(n/1024).toFixed(0)+" KB":(n/1048576).toFixed(1)+" MB"};
const hhmm=d=>new Date(d).toLocaleTimeString(LANG==="ar"?"ar-EG":"en-GB",{hour:"2-digit",minute:"2-digit"});
const dayLabel=d=>{const n=new Date(),s=new Date(d),k=x=>x.toDateString();if(k(s)===k(n))return t("today");if(k(s)===k(new Date(n-864e5)))return t("yesterday");return s.toLocaleDateString(LANG==="ar"?"ar-EG":"en-GB",{day:"numeric",month:"long",year:s.getFullYear()===n.getFullYear()?undefined:"numeric"})};
const rel=d=>{const m=Math.max(0,Math.round((Date.now()-new Date(d))/6e4));if(m<2)return t("just_now");if(m<60)return t("min_ago",m);if(m<1440)return t("hr_ago",Math.round(m/60));return t("day_ago",Math.round(m/1440))};
const normPhone=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("0020")&&d.length===14)d="0"+d.slice(4);else if(d.startsWith("20")&&d.length===12)d="0"+d.slice(2);return d};
function defaultDevice(){const u=navigator.userAgent||"";if(/iPhone|iPad/.test(u))return t("d_iphone");if(/Android/.test(u))return t("d_android");if(/Linux|X11/.test(u))return t("d_linux");if(/Windows/.test(u))return t("d_win");if(/Mac/.test(u))return t("d_mac");return t("d_other")}
const isPhoneDev=n=>/موبايل|android|iphone|phone|اندرويد|أندرويد|آيفون/i.test(n||"");
function toast(m,ms=2400){const e=$("#toast");e.innerHTML="";const d=document.createElement("div");d.textContent=m;e.appendChild(d);clearTimeout(S.timers.toast);S.timers.toast=setTimeout(()=>{e.innerHTML=""},ms)}
function errMsg(e){const m=String((e&&(e.message||e.error_description||e.error))||e||"").toLowerCase();for(const k of ["phone","invalid","already","limit","nospace","busy","storage_full"])if(m.includes(k)&&(k!=="invalid"||!m.includes("jwt")))return t("e_"+k);if(m.includes("fetch")||m.includes("network")||m.includes("failed"))return t("e_net");return t("e_generic")}
async function call(fn,args){const r=await sb.rpc(fn,args||{});if(r.error)throw r.error;return r.data}
function ask(msg,danger){return new Promise(res=>{const o=document.createElement("div");o.className="ov mid";o.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><p>${esc(msg)}</p><div class="row"><button class="btn ghost" data-v="0">${t("no")}</button><button class="btn ${danger?"bad":""}" data-v="1">${t("yes")}</button></div></div>`;o.addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(b||e.target===o){o.remove();res(!!b&&b.dataset.v==="1")}});$("#ovs").appendChild(o);$("[data-v='1']",o).focus()})}
function closeOv(){$("#ovs").innerHTML="";stopScan()}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#ovs").children.length)closeOv();else if($(".viewer"))closeViewer()}});

/* ---------- الإقلاع ---------- */
async function boot(){
 applyLang();applyTheme();
 const min=sleep(1500);
 if(!CFG.url||/PASTE/.test(CFG.url)||!CFG.key||/PASTE/.test(CFG.key)){await min;hideSplash();$("#root").innerHTML=`<div class="screen"><div class="wrap"><div class="brand">${LOGO}<b>SaveBox</b></div><div class="card"><p>${esc(t("no_cfg"))}</p></div></div></div>`;return}
 sb=supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:true,autoRefreshToken:true,storageKey:"savebox-auth"+(DEV?"-"+DEV:"")},realtime:{params:{eventsPerSecond:10}}});
 try{
  let {data:{session}}=await sb.auth.getSession();
  if(session){try{const u=await sb.auth.getUser();if(u.error||!u.data.user){await sb.auth.signOut();session=null}}catch(e){}}
  if(!session){const r=await sb.auth.signInAnonymously();if(r.error)throw r.error;session=r.data.session}
  S.uid=session.user.id;
 }catch(e){await min;hideSplash();return welcome(t("e_auth"))}
 let sp=null;
 try{sp=await call("my_space")}catch(e){await min;hideSplash();return welcome(errMsg(e))}
 await min;hideSplash();
 if(sp)enterApp(sp);else welcome();
}
function hideSplash(){const s=$("#splash");s.classList.add("out");setTimeout(()=>s.remove(),600)}

/* ---------- شاشة البداية ---------- */
function welcome(msg){
 leaveApp();
 $("#root").innerHTML=`<div class="screen"><div class="wrap">
  <div class="brand">${LOGO}<b>SaveBox</b></div>
  <h1>${esc(t("tagline"))}</h1><p>${esc(t("tagsub"))}</p>
  <button class="choice" data-act="new"><span class="ci">${ic("plus")}</span><span><b>${esc(t("start_new"))}</b><small>${esc(t("start_new_s"))}</small></span></button>
  <button class="choice" data-act="linkv"><span class="ci">${ic("qr")}</span><span><b>${esc(t("link_existing"))}</b><small>${esc(t("link_existing_s"))}</small></span></button>
  <div class="msg" id="m">${esc(msg||"")}</div>
  <div class="seg" role="group" style="max-width:200px;justify-self:center"><button data-act="lang" data-v="ar" aria-pressed="${LANG==="ar"}">العربية</button><button data-act="lang" data-v="en" aria-pressed="${LANG==="en"}">English</button></div>
 </div></div>`;
}
function formNew(){
 $("#root").innerHTML=`<div class="screen"><div class="wrap">
  <div class="brand">${LOGO}<b>${esc(t("start_new"))}</b></div>
  <div class="card">
   <label class="f">${esc(t("your_name"))}<input class="in" id="fn" maxlength="40" autocomplete="name"></label>
   <label class="f">${esc(t("phone"))}<input class="in" id="fp" inputmode="tel" dir="ltr" placeholder="${esc(t("phone_ph"))}" autocomplete="tel"></label>
   <label class="f">${esc(t("device_name"))}<input class="in" id="fd" maxlength="40" value="${esc(defaultDevice())}"></label>
   <small style="color:var(--mu)">${esc(t("phone_note"))}</small>
   <div class="msg" id="m"></div>
   <button class="btn" data-act="mk">${esc(t("create"))}</button>
  </div>
  <button class="lnk" data-act="home">${esc(t("back"))}</button></div></div>`;
 $("#fn").focus();
}
async function mkSpace(btn){
 const n=$("#fn").value.trim(),p=$("#fp").value.trim(),d=$("#fd").value.trim()||defaultDevice(),m=$("#m");
 if(!n){m.textContent=t("e_name");return}
 if(normPhone(p).length<8||normPhone(p).length>15){m.textContent=t("e_phone_f");return}
 btn.disabled=true;m.textContent="";
 try{let sp=await call("create_space",{p_name:n,p_phone:p,p_device:d});if(!sp)sp=await call("my_space");enterApp(sp)}catch(e){m.textContent=errMsg(e);btn.disabled=false}
}

/* ---------- ربط جهاز جديد (يعرض QR) ---------- */
function formLink(){
 $("#root").innerHTML=`<div class="screen"><div class="wrap">
  <div class="brand">${LOGO}<b>${esc(t("link_title"))}</b></div>
  <div class="card">
   <label class="f">${esc(t("link_phone"))}<input class="in" id="fp" inputmode="tel" dir="ltr" placeholder="${esc(t("phone_ph"))}" autocomplete="tel"></label>
   <label class="f">${esc(t("device_name"))}<input class="in" id="fd" maxlength="40" value="${esc(defaultDevice())}"></label>
   <div class="msg" id="m"></div>
   <button class="btn" data-act="qr">${esc(t("show_qr"))}</button>
  </div>
  <button class="lnk" data-act="home">${esc(t("back"))}</button></div></div>`;
 $("#fp").focus();
}
async function showQR(btn){
 const p=$("#fp").value.trim(),d=$("#fd").value.trim()||defaultDevice(),m=$("#m");
 if(normPhone(p).length<8||normPhone(p).length>15){m.textContent=t("e_phone_f");return}
 if(btn)btn.disabled=true;
 S.link={phone:p,device:d,exp:0};
 try{await newCode()}catch(e){m.textContent=errMsg(e);if(btn)btn.disabled=false;return}
 const draw=()=>{
  const left=Math.max(0,Math.round((S.link.exp-Date.now())/1000)),mm=Math.floor(left/60),ss=String(left%60).padStart(2,"0");
  const el=$("#cd");if(el)el.textContent=t("expires",mm+":"+ss);
 };
 $("#root").innerHTML=`<div class="screen"><div class="wrap">
  <div class="brand">${LOGO}<b>${esc(t("link_title"))}</b></div>
  <p>${esc(t("link_how"))}</p>
  <div class="qrbox" id="qr"></div>
  <div style="text-align:center;color:var(--mu)"><small>${esc(t("or_code"))}</small></div>
  <div class="code" id="cc"></div>
  <div style="text-align:center;color:var(--mu)"><span class="pulse"></span>${esc(t("waiting"))} <small id="cd"></small></div>
  <div class="msg" id="m"></div>
  <button class="lnk" data-act="cancellink">${esc(t("cancel"))}</button></div></div>`;
 paintQR();draw();
 clearInterval(S.timers.cd);clearInterval(S.timers.poll);
 S.timers.cd=setInterval(async()=>{
  if(!S.link)return;
  if(Date.now()>=S.link.exp-1000){try{await newCode();paintQR()}catch(e){}}
  draw();
 },1000);
 S.timers.poll=setInterval(async()=>{
  try{const sp=await call("my_space");if(sp){stopLink();enterApp(sp)}}catch(e){}
 },2000);
}
async function newCode(){const c=await call("request_link",{p_phone:S.link.phone,p_device:S.link.device});S.link.code=c;S.link.exp=Date.now()+180000}
function paintQR(){
 const q=qrcode(0,"M");q.addData("savebox:"+S.link.code);q.make();
 $("#qr").innerHTML=q.createSvgTag({scalable:true,cellSize:4,margin:0});
 $("#cc").textContent=S.link.code.slice(0,4)+" "+S.link.code.slice(4);
}
function stopLink(){clearInterval(S.timers.cd);clearInterval(S.timers.poll);S.link=null}
async function cancelLink(){stopLink();try{await call("cancel_link")}catch(e){}welcome()}

/* ---------- التطبيق الرئيسي ---------- */
function leaveApp(){
 if(S.ch){try{sb.removeChannel(S.ch)}catch(e){}S.ch=null}
 clearInterval(S.timers.touch);clearInterval(S.timers.sync);S.space=null;S.items=[];S.urls={};
}
async function enterApp(sp){
 stopLink();leaveApp();closeOv();
 S.space=sp;S.more=true;
 $("#root").innerHTML=`
 <header class="top">${LOGO}<div class="tt"><b id="sn">${esc(sp.name)}</b><small><span class="dot" id="dot"></span><span id="st">${esc(t("connecting"))}</span><span id="dn"></span></small></div>
  <button class="ib" data-act="scan" aria-label="${esc(t("link_device"))}" title="${esc(t("link_device"))}">${ic("qr")}</button>
  <button class="ib" data-act="settings" aria-label="${esc(t("settings"))}" title="${esc(t("settings"))}">${ic("gear")}</button></header>
 <main id="feed" style="position:relative"><div class="inner" id="inner"></div></main>
 <button id="newpill" class="hide" data-act="bottom">${esc(t("newer"))}</button>
 <footer class="comp"><button class="rb att" data-act="pick" aria-label="${esc(t("attach"))}" title="${esc(t("attach"))}">${ic("attach")}</button>
  <textarea id="ta" rows="1" dir="auto" placeholder="${esc(t("msg_ph"))}" aria-label="${esc(t("msg_ph"))}" enterkeyhint="send"></textarea>
  <button class="rb snd" id="sendb" data-act="send" aria-label="${esc(t("send"))}" title="${esc(t("send"))}" disabled>${ic("send")}</button>
  <input type="file" id="fi" multiple class="hide"></footer>`;
 devCount();
 const ta=$("#ta");
 ta.addEventListener("input",grow);
 ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&!matchMedia("(pointer:coarse)").matches){e.preventDefault();sendText()}});
 $("#fi").addEventListener("change",e=>{sendFiles([...e.target.files]);e.target.value=""});
 $("#feed").addEventListener("scroll",()=>{if(nearBottom())$("#newpill").classList.add("hide")},{passive:true});
 await loadItems(true);
 subscribe();
 S.timers.touch=setInterval(()=>{if(!document.hidden)call("touch_device").catch(()=>{})},120000);
 call("touch_device").catch(()=>{});
 S.timers.sync=setInterval(()=>{if(!S.online&&!document.hidden)syncNew()},8000);
 consumeShare();
 installBtn();
}
function grow(){const ta=$("#ta");if(!ta)return;ta.style.height="auto";ta.style.height=Math.min(150,ta.scrollHeight)+"px";$("#sendb").disabled=!ta.value.trim()}
const nearBottom=()=>{const f=$("#feed");return !f||f.scrollHeight-f.scrollTop-f.clientHeight<160};
function devCount(){const n=(S.space.devices||[]).length;const e=$("#dn");if(e)e.textContent=n>1?" · "+t("devices_n",n):""}
function setStatus(on){S.online=on;const d=$("#dot"),s=$("#st");if(d)d.classList.toggle("on",on);if(s)s.textContent=on?t("connected"):t("connecting")}

/* ---------- الرسائل ---------- */
async function loadItems(first,older){
 let q=sb.from("items").select("*").eq("space_id",S.space.id).order("created_at",{ascending:false}).limit(60);
 if(older&&S.items.length)q=q.lt("created_at",S.items[0].created_at);
 const {data,error}=await q;
 if(error){toast(errMsg(error));return}
 const rows=(data||[]).reverse();
 if(rows.length<60)S.more=false;
 if(first){S.items=rows;renderFeed();const f=$("#feed");f.style.scrollBehavior="auto";f.scrollTop=f.scrollHeight;f.style.scrollBehavior=""}
 else if(older){const f=$("#feed"),h=f.scrollHeight;S.items=rows.concat(S.items);renderFeed();f.style.scrollBehavior="auto";f.scrollTop=f.scrollHeight-h;f.style.scrollBehavior=""}
 mediaUrls(rows);
}
async function syncNew(){
 if(!S.space)return;const last=S.items.filter(i=>!i.pending).slice(-1)[0];
 let q=sb.from("items").select("*").eq("space_id",S.space.id).order("created_at",{ascending:true}).limit(100);
 if(last)q=q.gt("created_at",last.created_at);
 const {data}=await q;(data||[]).forEach(r=>addItem(r));
}
function renderFeed(){
 const inner=$("#inner");if(!inner)return;
 if(!S.items.length){inner.innerHTML=`<div class="empty">${ic("file")}<b>${esc(t("empty_t"))}</b><span>${esc(t("empty_s"))}</span></div>`;return}
 inner.innerHTML=(S.more?`<button class="more" data-act="older">${esc(t("older"))}</button>`:"")+S.items.map(itemHtml).join("");
 fixDays();
}
function fixDays(){let prev="";$$("#inner .it").forEach(a=>{const d=$(".day",a),k=a.dataset.day;d.classList.toggle("hide",k===prev);prev=k})}
function linkify(s){return s.replace(/(https?:\/\/[^\s<]+)/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`)}
function host(u){try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return u}}
function mediaHtml(it){
 const u=S.urls[it.file_path]&&S.urls[it.file_path].u;
 if(it.kind==="image")return u?`<button class="im" data-act="view" data-id="${it.id}" aria-label="${esc(it.file_name||"")}"><img data-p="${esc(it.file_path)}" src="${esc(u)}" alt="${esc(it.file_name||"")}" loading="lazy"></button>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 if(it.kind==="video")return u?`<video data-p="${esc(it.file_path)}" src="${esc(u)}" controls preload="metadata" playsinline></video>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 if(it.kind==="audio")return u?`<audio data-p="${esc(it.file_path)}" src="${esc(u)}" controls preload="metadata"></audio>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 return `<div class="fl"><span class="fi">${it.pending?`<span class="pulse" style="margin:0"></span>`:ic("file")}</span><div><b dir="auto">${esc(it.file_name||"")}</b><small>${it.pending?esc(t("uploading")):esc(fmtSize(it.size))}</small></div></div>`;
}
function itemHtml(it){
 let body="";
 if(it.kind==="text")body=`<p class="tx" dir="auto">${linkify(esc(it.body))}</p>`;
 else if(it.kind==="link"&&/^https?:\/\//i.test(it.body||""))body=`<a class="lk" href="${esc(it.body)}" target="_blank" rel="noopener noreferrer"><b>${esc(host(it.body))}</b><span>${esc(it.body)}</span></a>`;
 else if(it.kind==="link")body=`<p class="tx" dir="auto">${esc(it.body)}</p>`;
 else body=it.pending?`<div class="fl"><span class="fi"><span class="pulse" style="margin:0"></span></span><div><b dir="auto">${esc(it.file_name||"")}</b><small>${esc(t("uploading"))}</small></div></div>`:mediaHtml(it);
 const acts=it.pending?"":`${it.kind==="text"||it.kind==="link"?`<button data-act="copy" data-id="${it.id}" aria-label="${esc(t("copy"))}" title="${esc(t("copy"))}">${ic("copy")}</button>`:""}${it.kind==="link"?`<a class="" href="${esc(it.body)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t("open"))}" title="${esc(t("open"))}" style="width:30px;height:28px;display:grid;place-items:center;color:var(--mu)">${ic("open")}</a>`:""}${it.file_path?`<button data-act="dl" data-id="${it.id}" aria-label="${esc(t("download"))}" title="${esc(t("download"))}">${ic("dl")}</button>`:""}<button data-act="del" data-id="${it.id}" aria-label="${esc(t("del"))}" title="${esc(t("del"))}">${ic("trash")}</button>`;
 return `<article class="it" data-id="${it.id}" data-day="${new Date(it.created_at).toDateString()}"><div class="day">${esc(dayLabel(it.created_at))}</div><div class="bub">${body}<div class="meta"><span class="dv" style="--h:${hue(it.device)}"><i></i>${esc(it.device||"")}</span><time>${hhmm(it.created_at)}</time><span class="acts">${acts}</span></div></div></article>`;
}
function addItem(it,mine){
 if(S.items.some(x=>x.id===it.id))return;
 const wasNear=nearBottom();
 const emp=$("#inner .empty");if(emp)emp.remove();
 S.items.push(it);S.items.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
 const inner=$("#inner");if(!inner)return;
 const tpl=document.createElement("template");tpl.innerHTML=itemHtml(it).trim();
 const idx=S.items.indexOf(it),next=S.items[idx+1];
 const nextEl=next&&$(`#inner .it[data-id="${next.id}"]`);
 inner.insertBefore(tpl.content.firstChild,nextEl||null);
 fixDays();
 if(it.file_path&&!it.pending)mediaUrls([it]);
 if(mine||wasNear){const f=$("#feed");f.scrollTop=f.scrollHeight}else $("#newpill").classList.remove("hide");
}
function removeItem(id){
 S.items=S.items.filter(x=>x.id!==id);const el=$(`#inner .it[data-id="${id}"]`);if(el)el.remove();
 if(!S.items.length)renderFeed();else fixDays();
}
async function mediaUrls(rows){
 const need=rows.filter(r=>r.file_path&&["image","video","audio"].includes(r.kind)&&!(S.urls[r.file_path]&&S.urls[r.file_path].e>Date.now()));
 if(!need.length)return;
 const paths=[...new Set(need.map(r=>r.file_path))];
 const {data,error}=await sb.storage.from("savebox").createSignedUrls(paths,21600);
 if(error||!data)return;
 S.urlAt=Date.now();
 data.forEach(d=>{if(d.signedUrl)S.urls[d.path]={u:d.signedUrl,e:Date.now()+21000e3}});
 need.forEach(r=>{const el=$(`#inner .it[data-id="${r.id}"] .bub`);if(!el)return;const old=el.firstElementChild;if(old&&(old.classList.contains("sk")||old.classList.contains("fl")))return paint(r,el,old);});
}
function paint(r,el,old){const tpl=document.createElement("template");tpl.innerHTML=mediaHtml(r).trim();if(tpl.content.firstChild)old.replaceWith(tpl.content.firstChild)}
async function refreshMedia(){
 if(Date.now()-S.urlAt<5*3600e3)return;
 const media=S.items.filter(r=>r.file_path&&["image","video","audio"].includes(r.kind));
 S.urls={};
 const paths=media.map(r=>r.file_path);if(!paths.length)return;
 const {data}=await sb.storage.from("savebox").createSignedUrls(paths,21600);if(!data)return;
 S.urlAt=Date.now();
 data.forEach(d=>{if(d.signedUrl){S.urls[d.path]={u:d.signedUrl,e:Date.now()+21000e3};$$(`[data-p="${CSS.escape(d.path)}"]`).forEach(e=>{if(e.src!==undefined&&e.tagName!=="DIV")e.src=d.signedUrl})}});
}

/* ---------- الإرسال ---------- */
async function insertItem(row){
 const {data,error}=await sb.from("items").insert({space_id:S.space.id,device:S.space.device,...row}).select().single();
 if(error){toast(errMsg(error));return null}
 addItem(data,true);return data;
}
async function sendText(){
 const ta=$("#ta");if(!ta)return;const v=ta.value.trim();if(!v)return;
 if(v.length>20000){toast(t("e_generic"));return}
 ta.value="";grow();
 const kind=/^https?:\/\/\S+$/i.test(v)?"link":"text";
 const r=await insertItem({kind,body:v});if(!r){ta.value=v;grow()}
}
async function shrink(f,max=1600,q=.82){
 try{
  const bmp=await createImageBitmap(f,{imageOrientation:"from-image"});
  const sc=Math.min(1,max/Math.max(bmp.width,bmp.height));
  if(sc===1&&f.size<600*1024)return f;
  const c=document.createElement("canvas");c.width=Math.round(bmp.width*sc);c.height=Math.round(bmp.height*sc);
  c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
  const b=await new Promise(r=>c.toBlob(r,"image/jpeg",q));
  if(!b||b.size>=f.size)return f;
  return new File([b],f.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"});
 }catch(e){return f}
}
const pad=n=>String(n).padStart(2,"0");
async function sendFiles(list){
 if(!S.space)return;
 for(let f of list){
  if(!f||!f.size)continue;
  if(/^image\/(jpeg|png|webp)$/.test(f.type)&&ls.get("compress",true))f=await shrink(f);
  const max=ls.get("max",25)*1048576;
  if(f.size>max){toast(t("too_big",ls.get("max",25)));continue}
  let name=f.name||"file";
  if(/^image\.(png|jpe?g|webp)$/i.test(name)){const d=new Date();name="paste-"+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+"-"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds())+(name.match(/\.[a-z]+$/i)||[".png"])[0]}
  const tmp={id:"tmp-"+Math.random().toString(36).slice(2),kind:"file",file_name:name,size:f.size,created_at:new Date().toISOString(),device:S.space.device,pending:true};
  addItem(tmp,true);
  const ext=(name.match(/\.[A-Za-z0-9]{1,8}$/)||[""])[0].toLowerCase();
  const path=S.space.id+"/"+crypto.randomUUID()+ext;
  const mime=f.type||"application/octet-stream";
  const up=await sb.storage.from("savebox").upload(path,f,{contentType:mime,upsert:false});
  if(up.error){removeItem(tmp.id);toast(errMsg(up.error));continue}
  const row=await insertItem({kind:kindOf(mime),file_path:path,file_name:name,mime,size:f.size});
  removeItem(tmp.id);
  if(!row)await sb.storage.from("savebox").remove([path]);
 }
}
document.addEventListener("paste",e=>{
 if(!S.space)return;const files=[...(e.clipboardData&&e.clipboardData.files||[])];
 if(files.length){e.preventDefault();sendFiles(files)}
});
let dragN=0;
document.addEventListener("dragenter",e=>{if(!S.space||![...(e.dataTransfer&&e.dataTransfer.types||[])].includes("Files"))return;dragN++;if(!$(".drop")){const d=document.createElement("div");d.className="drop";d.textContent=t("attach");document.body.appendChild(d)}});
document.addEventListener("dragleave",()=>{dragN=Math.max(0,dragN-1);if(!dragN){const d=$(".drop");if(d)d.remove()}});
document.addEventListener("dragover",e=>{if(S.space)e.preventDefault()});
document.addEventListener("drop",e=>{e.preventDefault();dragN=0;const d=$(".drop");if(d)d.remove();if(S.space&&e.dataTransfer.files.length)sendFiles([...e.dataTransfer.files])});

/* المشاركة من تطبيقات الموبايل (Share target) */
async function consumeShare(){
 if(!Q.get("shared")||!("caches" in window))return;
 try{
  const c=await caches.open("sb-share"),keys=await c.keys(),files=[];let text="";
  for(const k of keys){const r=await c.match(k);if(!r)continue;
   if(k.url.endsWith("/text")){const j=await r.json();text=[j.title,j.text,j.url].filter(Boolean).join("\n")}
   else{const b=await r.blob();files.push(new File([b],decodeURIComponent(r.headers.get("x-name")||"file"),{type:b.type}))}}
  for(const k of keys)await c.delete(k);
  history.replaceState(null,"",location.pathname+(DEV?"?dev="+DEV:""));
  if(text.trim()){const kind=/^https?:\/\/\S+$/i.test(text.trim())?"link":"text";await insertItem({kind,body:text.trim()})}
  if(files.length)await sendFiles(files);
  if(text.trim()||files.length)toast(t("shared_ok"));
 }catch(e){}
}

/* ---------- المزامنة اللحظية ---------- */
function subscribe(){
 if(S.ch){try{sb.removeChannel(S.ch)}catch(e){}}
 const sid=S.space.id;
 S.ch=sb.channel("sb-"+sid)
  .on("postgres_changes",{event:"INSERT",schema:"public",table:"items",filter:"space_id=eq."+sid},p=>{if(p.new)addItem(p.new)})
  .on("postgres_changes",{event:"DELETE",schema:"public",table:"items"},p=>{if(p.old&&p.old.id)removeItem(p.old.id)})
  .on("postgres_changes",{event:"*",schema:"public",table:"members"},onMembers)
  .subscribe(st=>{
   const on=st==="SUBSCRIBED";const was=S.online;setStatus(on);
   if(on&&!was&&S.items.length)syncNew();
  });
}
async function onMembers(p){
 if(p.eventType==="DELETE"&&p.old&&p.old.user_id===S.uid){return checkKicked()}
 try{
  const sp=await call("my_space");if(!sp)return checkKicked();
  const before=(S.space.devices||[]).length;S.space=Object.assign(S.space,sp);devCount();
  const nm=$("#sn");if(nm)nm.textContent=sp.name;
  if(p.eventType==="INSERT"&&p.new&&p.new.user_id!==S.uid&&sp.devices.length>before)toast(t("new_dev",p.new.device));
  if($("#setbox"))openSettings(true);
 }catch(e){}
}
async function checkKicked(){
 try{const sp=await call("my_space");if(sp)return;}catch(e){return}
 await sb.auth.signOut();const r=await sb.auth.signInAnonymously();if(r.data&&r.data.session)S.uid=r.data.session.user.id;
 closeOv();welcome(t("kicked"));
}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden||!S.space)return;
 syncNew();refreshMedia();checkKicked();
});
addEventListener("online",()=>{if(S.space)syncNew()});

/* ---------- مسح QR (من جهاز مربوط) ---------- */
let scanStream=null,scanRAF=0;
function stopScan(){cancelAnimationFrame(scanRAF);scanRAF=0;if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null}}
async function openScan(){
 const o=document.createElement("div");o.className="ov";
 o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><h2>${esc(t("scan_title"))}<button class="ib" data-act="closeov" aria-label="${esc(t("cancel"))}">${ic("x")}</button></h2>
  <p style="margin:0;color:var(--mu)">${esc(t("scan_hint"))}</p>
  <div class="scan" id="scanbox"><video id="sv" playsinline muted></video></div>
  <div class="msg" id="sm"></div>
  <label class="f">${esc(t("manual_code"))}<div class="row"><input class="in" id="mc" dir="ltr" maxlength="9" autocapitalize="characters" autocomplete="off" placeholder="ABCD 2345"><button class="btn" data-act="mcgo">${esc(t("approve"))}</button></div></label></div>`;
 $("#ovs").innerHTML="";$("#ovs").appendChild(o);
 o.addEventListener("click",e=>{if(e.target===o)closeOv()});
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("nocam");
  scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
  const v=$("#sv");v.srcObject=scanStream;await v.play();
  const det=("BarcodeDetector" in window)?new BarcodeDetector({formats:["qr_code"]}):null;
  const cv=document.createElement("canvas"),cx=cv.getContext("2d",{willReadFrequently:true});let busy=false,last="";
  const tick=async()=>{
   if(!scanStream)return;
   if(!busy&&v.readyState>=2&&v.videoWidth){
    busy=true;let txt="";
    try{
     if(det){const r=await det.detect(v);if(r[0])txt=r[0].rawValue}
     else{const w=Math.min(640,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);cv.width=w;cv.height=h;cx.drawImage(v,0,0,w,h);const d=cx.getImageData(0,0,w,h),r=jsQR(d.data,w,h);if(r)txt=r.data}
    }catch(e){}
    busy=false;
    const m=/^savebox:([A-Z2-9]{8})$/i.exec(txt||"");
    if(m&&m[1]!==last){last=m[1];await approve(m[1])}
   }
   scanRAF=requestAnimationFrame(tick);
  };
  tick();
 }catch(e){const b=$("#scanbox");if(b)b.remove();$("#sm").textContent=t("no_cam")}
}
async function approve(code){
 const m=$("#sm");
 try{const dev=await call("approve_link",{p_code:code});stopScan();closeOv();toast(t("linked_ok",dev));await refreshSpace()}
 catch(e){if(m){m.textContent=errMsg(e);m.className="msg"}setTimeout(()=>{if(m&&m.textContent)m.textContent=""},3500)}
}
async function refreshSpace(){try{const sp=await call("my_space");if(sp){S.space=Object.assign(S.space,sp);devCount()}}catch(e){}}

/* ---------- الإعدادات ---------- */
async function openSettings(keep){
 await refreshSpace();
 const sp=S.space,mx=ls.get("max",25),cm=ls.get("compress",true),th=ls.get("theme","auto");
 const devs=(sp.devices||[]).map(d=>`<div class="dev" style="--h:${hue(d.device)}"><span class="di">${ic(isPhoneDev(d.device)?"phone":"laptop")}</span><div><b>${esc(d.device)}${d.me?` <small>(${esc(t("this_dev"))})</small>`:""}</b><small>${d.me?esc(t("connected")):esc(t("last_seen",rel(d.last_seen)))}</small></div>${d.me?"":`<button class="btn ghost" style="padding:6px 12px" data-act="rmdev" data-id="${d.user_id}" data-n="${esc(d.device)}">${esc(t("remove"))}</button>`}</div>`).join("");
 const html=`<div class="sheet" id="setbox" role="dialog" aria-modal="true"><h2>${esc(t("settings"))}<button class="ib" data-act="closeov" aria-label="${esc(t("cancel"))}">${ic("x")}</button></h2>
 <section class="sec"><h3>${esc(t("s_space"))}</h3><label class="f">${esc(t("space_name"))}<div class="row"><input class="in" id="spn" maxlength="40" value="${esc(sp.name)}"><button class="btn ghost" data-act="svspace">${esc(t("save"))}</button></div></label><label class="f">${esc(t("phone"))}<input class="in" dir="ltr" value="${esc(sp.phone)}" readonly></label></section>
 <section class="sec"><h3>${esc(t("s_this"))}</h3><div class="row"><input class="in" id="dvn" maxlength="40" value="${esc(sp.device)}" aria-label="${esc(t("device_name"))}"><button class="btn ghost" data-act="svdev">${esc(t("save"))}</button></div></section>
 <section class="sec"><h3>${esc(t("s_devices"))}</h3>${devs}<button class="btn" data-act="scan">${ic("qr")}${esc(t("link_device"))}</button>${(sp.devices||[]).length>1?`<button class="btn ghost" data-act="rmothers">${esc(t("remove_others"))}</button>`:""}</section>
 <section class="sec"><h3>${esc(t("s_look"))}</h3><div class="seg" role="group" aria-label="${esc(t("theme"))}">${["auto","light","dark"].map(k=>`<button data-act="theme" data-v="${k}" aria-pressed="${th===k}">${esc(t(k))}</button>`).join("")}</div><div class="seg" role="group" aria-label="${esc(t("lang"))}"><button data-act="lang" data-v="ar" aria-pressed="${LANG==="ar"}">العربية</button><button data-act="lang" data-v="en" aria-pressed="${LANG==="en"}">English</button></div>${S.inst?`<button class="btn ghost" data-act="install">${esc(t("install"))}</button>`:""}</section>
 <section class="sec"><h3>${esc(t("s_files"))}</h3><label class="f"><span id="mxl">${esc(t("max_size",mx))}</span><input type="range" id="mx" min="1" max="50" value="${mx}"></label><div class="sw2"><span>${esc(t("compress"))}</span><button class="tg" role="switch" aria-checked="${cm}" data-act="cmp" aria-label="${esc(t("compress"))}"><i></i></button></div></section>
 <section class="sec"><h3>${esc(t("s_danger"))}</h3><button class="btn ghost" data-act="leave">${esc(t("leave"))}</button><button class="btn bad" data-act="wipe">${esc(t("wipe"))}</button></section></div>`;
 const ov=$("#ovs");const sc=keep&&$("#setbox")?$("#setbox").scrollTop:0;
 ov.innerHTML=`<div class="ov">${html}</div>`;
 const ovEl=ov.firstChild;ovEl.addEventListener("click",e=>{if(e.target===ovEl)closeOv()});
 const sbx=$("#setbox");if(sc)sbx.scrollTop=sc;
 $("#mx").addEventListener("input",e=>{ls.set("max",+e.target.value);$("#mxl").textContent=t("max_size",e.target.value)});
}

/* ---------- الإجراءات ---------- */
function closeViewer(){const v=$(".viewer");if(v)v.remove()}
function installBtn(){}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();S.inst=e});
const A={
 new(){formNew()},home(){welcome()},linkv(){formLink()},mk(b){mkSpace(b)},qr(b){showQR(b)},cancellink(){cancelLink()},
 lang(b){LANG=b.dataset.v;ls.set("lang",LANG);applyLang();if(S.space){enterApp(S.space).then(()=>openSettings())}else welcome()},
 theme(b){ls.set("theme",b.dataset.v);applyTheme();$$("[data-act=theme]").forEach(x=>x.setAttribute("aria-pressed",x===b))},
 cmp(b){const v=!(ls.get("compress",true));ls.set("compress",v);b.setAttribute("aria-checked",v)},
 settings(){openSettings()},scan(){openScan()},closeov(){closeOv()},
 mcgo(){const v=($("#mc").value||"").replace(/\s/g,"").toUpperCase();if(v.length===8)approve(v);else{const m=$("#sm");m.textContent=t("e_invalid")}},
 pick(){$("#fi").click()},send(){sendText()},bottom(){const f=$("#feed");f.scrollTop=f.scrollHeight;$("#newpill").classList.add("hide")},
 older(){loadItems(false,true)},
 async view(b){const id=b.dataset.id,it=S.items.find(x=>x.id===id);if(!it)return;const u=S.urls[it.file_path]&&S.urls[it.file_path].u;if(!u)return;
  const v=document.createElement("div");v.className="viewer";v.innerHTML=`<div class="vb"><button class="ib" data-act="closeviewer" aria-label="${esc(t("cancel"))}">${ic("x")}</button><button class="ib" data-act="dl" data-id="${id}" aria-label="${esc(t("download"))}">${ic("dl")}</button></div><img src="${esc(u)}" alt="${esc(it.file_name||"")}">`;
  v.addEventListener("click",e=>{if(e.target===v||e.target.tagName==="IMG")closeViewer()});document.body.appendChild(v)},
 closeviewer(){closeViewer()},
 async copy(b){const it=S.items.find(x=>x.id===b.dataset.id);if(!it)return;try{await navigator.clipboard.writeText(it.body);toast(t("copied"))}catch(e){const ta=document.createElement("textarea");ta.value=it.body;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(t("copied"))}catch(x){}ta.remove()}},
 async dl(b){const it=S.items.find(x=>x.id===b.dataset.id);if(!it||!it.file_path)return;
  const {data,error}=await sb.storage.from("savebox").createSignedUrl(it.file_path,120,{download:it.file_name||true});
  if(error||!data){toast(errMsg(error));return}const a=document.createElement("a");a.href=data.signedUrl;a.download=it.file_name||"";document.body.appendChild(a);a.click();a.remove()},
 async del(b){
  if(!b.classList.contains("sure")){$$(".acts .sure").forEach(x=>{x.classList.remove("sure");x.innerHTML=ic("trash")});b.classList.add("sure");b.textContent=t("sure");clearTimeout(S.timers.sure);S.timers.sure=setTimeout(()=>{if(b.isConnected){b.classList.remove("sure");b.innerHTML=ic("trash")}},3000);return}
  const id=b.dataset.id,it=S.items.find(x=>x.id===id);if(!it)return;
  const {error}=await sb.from("items").delete().eq("id",id);if(error){toast(errMsg(error));return}
  if(it.file_path)await sb.storage.from("savebox").remove([it.file_path]);
  removeItem(id);
 },
 async svspace(){const v=$("#spn").value.trim();if(!v)return;try{await call("rename_space",{p_name:v});S.space.name=v;$("#sn").textContent=v;toast(t("saved"))}catch(e){toast(errMsg(e))}},
 async svdev(){const v=$("#dvn").value.trim();if(!v)return;try{await call("rename_device",{p_name:v});S.space.device=v;toast(t("saved"))}catch(e){toast(errMsg(e))}},
 async rmdev(b){if(!(await ask(t("c_remove",b.dataset.n),true)))return;try{await call("remove_device",{p_user:b.dataset.id});await openSettings(true)}catch(e){toast(errMsg(e))}},
 async rmothers(){if(!(await ask(t("c_others"),true)))return;try{await call("remove_other_devices");await openSettings(true)}catch(e){toast(errMsg(e))}},
 async leave(){if(!(await ask(t("c_leave"),true)))return;try{await call("leave_space")}catch(e){toast(errMsg(e));return}await resetIdentity();welcome()},
 async wipe(){if(!(await ask(t("c_wipe"),true)))return;
  try{
   const paths=[];let from=0;for(;;){const {data}=await sb.from("items").select("file_path").eq("space_id",S.space.id).not("file_path","is",null).range(from,from+999);if(!data||!data.length)break;data.forEach(r=>paths.push(r.file_path));if(data.length<1000)break;from+=1000}
   for(let i=0;i<paths.length;i+=100)await sb.storage.from("savebox").remove(paths.slice(i,i+100));
   await call("delete_space");
  }catch(e){toast(errMsg(e));return}
  await resetIdentity();welcome()},
 async install(){if(!S.inst)return;S.inst.prompt();try{await S.inst.userChoice}catch(e){}S.inst=null;closeOv()}
};
async function resetIdentity(){closeOv();leaveApp();try{await sb.auth.signOut()}catch(e){}const r=await sb.auth.signInAnonymously();if(r.data&&r.data.session)S.uid=r.data.session.user.id}
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(!b)return;const f=A[b.dataset.act];if(f){e.preventDefault();f(b)}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="mc"){e.preventDefault();A.mcgo()}});

/* PWA */
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
boot();
