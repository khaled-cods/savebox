"use strict";
/* SaveBox: رسايلك وملفاتك بين كل أجهزتك. الربط برقم الموبايل + QR، ومزامنة لحظية عبر Supabase. */
const CFG=window.SB_CFG||{};
const VER="3.0.0";
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
Object.assign(T.ar,{
t1h:"رسايلك معاك في كل مكان",t1s:"اكتب على الموبايل، وهتلاقيها على اللابتوب في نفس اللحظة. زي الشات مع نفسك، بس من غير حدود.",
t2h:"اربط أي جهاز بالكاميرا",t2s:"اعرض الـ QR على أي جهاز ووجّه عليه الجهاز التاني. من غير باسورد ومن غير كود SMS.",
t3h:"كل حاجة في مكانها",t3s:"الروابط والصور والفيديوهات والملفات في أقسام لوحدها، وتدوّر على أي حاجة في ثانية.",
t4h:"بياناتك ليك وبس",t4s:"ملفاتك في مساحة خاصة مفيش حد يدخلها غير أجهزتك، وتفصل أي جهاز في أي وقت.",
next:"التالي",skip:"تخطّي",go:"يلا نبدأ",
tab_all:"الكل",tab_links:"روابط",tab_images:"صور",tab_videos:"فيديو",tab_files:"ملفات",tab_notes:"ملاحظات",search_ph:"دوّر في رسايلك وملفاتك...",search:"بحث",no_results:"مفيش نتايج",no_results_s:"جرّب كلمة تانية أو قسم تاني.",
empty_links:"مفيش روابط لسه",empty_images:"مفيش صور لسه",empty_videos:"مفيش فيديوهات لسه",empty_files:"مفيش ملفات لسه",empty_notes:"مفيش ملاحظات لسه",
l_scan:"امسح QR",l_show:"اعرض QR",l_show_hint:"وجّه كاميرا الجهاز الجديد على الكود ده، أو اكتبه عليه.",l_wrong:"الكود ده مش للعملية دي. جرّب تعرض الـ QR من الجهاز التاني.",l_join:"انضم بـ QR",l_join_hint:"وجّه الكاميرا على الـ QR اللي ظاهر على جهازك المربوط (من «ربط جهاز ← اعرض QR»).",l_code:"الكود",
st_general:"عام",st_devices:"الأجهزة",st_prefs:"التفضيلات",st_about:"عن التطبيق",
font:"حجم الخط",font_s:"صغير",font_m:"عادي",font_l:"كبير",font_xl:"كبير جداً",enter_send:"Enter يبعت الرسالة",sound:"صوت عند وصول رسالة",show_dev:"اعرض اسم الجهاز على الرسايل",
storage:"المساحة المستخدمة",st_items:"{0} عنصر",st_of:"من 400 ميجا",k_text:"رسايل",k_link:"روابط",k_image:"صور",k_video:"فيديو",k_audio:"صوت",k_file:"ملفات",
export:"تصدير الرسايل والروابط (txt)",exported:"اتحمّل الملف",export_none:"مفيش حاجة تتصدّر.",
about_desc:"SaveBox مكانك الخاص لحفظ الرسايل والروابط والصور والملفات، وتوصل لكل أجهزتك لحظياً.",
how_title:"إزاي بيشتغل",how1:"كل جهاز بيتربط بمساحتك عن طريق QR، من غير كلمة سر.",how2:"أي جهاز مربوط يقدر يعرض QR أو يمسح QR.",how3:"الملفات بتتخزن في مساحة خاصة، والروابط المؤقتة بتتجدد لوحدها.",how4:"تقدر تفصل أي جهاز أو تمسح كل حاجة من الإعدادات.",
shortcuts:"اختصارات",sc_send:"إرسال",sc_nl:"سطر جديد",sc_paste:"لصق صورة",sc_esc:"قفل النافذة",
replay:"شوف الترحيب تاني",update:"تحديث التطبيق",updating:"بيتحدّث...",version:"الإصدار",
c_del_one:"تمسح العنصر ده من كل الأجهزة؟",view_prev:"الأقدم",view_next:"الأحدث",
sync_hint:"المزامنة لحظية بين كل أجهزتك."
});
Object.assign(T.en,{
t1h:"Your stuff, wherever you are",t1s:"Type on your phone and it's on your laptop that instant. Like chatting with yourself, without the limits.",
t2h:"Link any device with a camera",t2s:"Show a QR on one device and point the other at it. No password, no SMS code.",
t3h:"Everything in its place",t3s:"Links, photos, videos and files sit in their own sections, and anything is a search away.",
t4h:"Your data stays yours",t4s:"Your files live in a private space only your devices can open, and you can unlink any device anytime.",
next:"Next",skip:"Skip",go:"Let's start",
tab_all:"All",tab_links:"Links",tab_images:"Photos",tab_videos:"Videos",tab_files:"Files",tab_notes:"Notes",search_ph:"Search your messages and files...",search:"Search",no_results:"No results",no_results_s:"Try another word or section.",
empty_links:"No links yet",empty_images:"No photos yet",empty_videos:"No videos yet",empty_files:"No files yet",empty_notes:"No notes yet",
l_scan:"Scan QR",l_show:"Show QR",l_show_hint:"Point the new device's camera at this code, or type it there.",l_wrong:"That code isn't for this step. Try showing the QR from the other device.",l_join:"Join with QR",l_join_hint:"Point the camera at the QR on your linked device (Link device → Show QR).",l_code:"Code",
st_general:"General",st_devices:"Devices",st_prefs:"Preferences",st_about:"About",
font:"Text size",font_s:"Small",font_m:"Normal",font_l:"Large",font_xl:"Extra large",enter_send:"Enter sends the message",sound:"Sound on incoming message",show_dev:"Show device name on messages",
storage:"Storage used",st_items:"{0} items",st_of:"of 400 MB",k_text:"Messages",k_link:"Links",k_image:"Photos",k_video:"Videos",k_audio:"Audio",k_file:"Files",
export:"Export messages and links (txt)",exported:"File downloaded",export_none:"Nothing to export.",
about_desc:"SaveBox is your private place for notes, links, photos and files, instantly available on all your devices.",
how_title:"How it works",how1:"Each device joins your space with a QR, no password.",how2:"Any linked device can show or scan a QR.",how3:"Files sit in private storage and temporary links renew by themselves.",how4:"Unlink any device or wipe everything from Settings.",
shortcuts:"Shortcuts",sc_send:"Send",sc_nl:"New line",sc_paste:"Paste image",sc_esc:"Close window",
replay:"Replay the welcome",update:"Update the app",updating:"Updating...",version:"Version",
c_del_one:"Delete this item from all devices?",view_prev:"Older",view_next:"Newer",
sync_hint:"Syncs instantly across all your devices."
});
Object.assign(T.ar,{l_wrong_in:"ده كود دعوة، وجهازك ده مربوط بالفعل. امسحه من جهاز لسه مش مربوط (اللي بيقول «اربط بجهاز موجود»).",l_wrong_new:"ده كود لجهاز جديد. امسحه من جهاز مربوط بالفعل من أيقونة QR.",s_msgs:"الرسايل",waiting_new:"في انتظار الجهاز الجديد..."});Object.assign(T.en,{l_wrong_in:"This is an invite code and this device is already linked. Scan it from a device that is not linked yet (the one showing “Link to an existing device”).",l_wrong_new:"This code belongs to a new device. Scan it from an already linked device using the QR icon.",s_msgs:"Messages",waiting_new:"Waiting for the new device..."});
Object.assign(T.ar,{
sp_account:"حسابي ومساحتي",sp_devices:"الأجهزة والربط",sp_notif:"الإشعارات",sp_look:"المظهر واللغة",sp_files:"الملفات والمساحة",sp_privacy:"الخصوصية والأمان",sp_about:"عن التطبيق",
on:"شغّالة",off:"مقفولة",lock_on:"القفل شغّال",lock_off:"من غير قفل",st_files_sub:"المساحة والتصدير",sound_short:"الصوت",lock_short:"القفل",
n_master:"إشعارات الرسايل الجديدة",n_master_h:"ينبّهك لما رسالة توصل من جهازك التاني",n_preview:"اعرض محتوى الرسالة",n_preview_h:"لو اتقفل هيظهر «رسالة جديدة» بس",n_focus:"حتى والتطبيق مفتوح",n_focus_h:"وصّل إشعار حتى لو انت قدام التطبيق",n_sound_h:"نغمة قصيرة لما رسالة توصل",n_test:"جرّب إشعار",n_test_b:"الإشعارات شغّالة ✓",
n_status_push:"شغّالة حتى والتطبيق مقفول",n_status_local:"شغّالة والتطبيق مفتوح أو في الخلفية",n_status_off:"الإشعارات مقفولة",
n_blocked:"الإشعارات ممنوعة. فعّلها من إعدادات المتصفح للموقع ده.",n_unsupported:"المتصفح ده مش بيدعم الإشعارات.",n_on_push:"اتفعّلت، وهتوصلك حتى والتطبيق مقفول",n_on_local:"اتفعّلت، وهتوصلك والتطبيق مفتوح أو في الخلفية",n_new:"رسالة جديدة",n_voice:"رسالة صوتية",
pin_lock:"قفل التطبيق بـ PIN",pin_lock_h:"رمز من 4 أرقام عند فتح التطبيق",autolock:"اقفل بعد ما أسيبه",al_0:"فوراً",al_1:"دقيقة",al_5:"5 دقايق",al_15:"15 دقيقة",
lock_title:"التطبيق مقفول",lock_sub:"اكتب الرمز السري",pin_new:"اختار رمز سري",pin_new_s:"4 أرقام",pin_again:"أكّد الرمز",pin_again_s:"اكتبه تاني",pin_set:"اتفعّل القفل",pin_off:"اتقفل القفل",pin_enter:"اكتب الرمز الحالي",pin_enter_s:"علشان تقفل القفل",
play:"تشغيل",mic:"تسجيل صوتي",rec_cancel:"إلغاء التسجيل",rec_unsupported:"المتصفح ده مش بيدعم التسجيل الصوتي.",mic_denied:"مش قادر أوصل للميكروفون. اسمح بيه من إعدادات المتصفح.",
merge_q:"الجهاز اللي مسحته في مساحة تانية. تدمج مساحتك ({0} جهاز) معاه؟ رسايلك وملفاتك هتنضم له.",merge_done:"اتدمجت المساحتين ✓",merge_hint:"لو جهازين فتحوا مساحتين منفصلتين، اعرض QR على جهاز وامسحه من التاني، وهيتدمجوا في مساحة واحدة.",e_same:"الجهازين في نفس المساحة بالفعل."
});
Object.assign(T.en,{
sp_account:"My space",sp_devices:"Devices and linking",sp_notif:"Notifications",sp_look:"Look and language",sp_files:"Files and storage",sp_privacy:"Privacy and security",sp_about:"About",
on:"On",off:"Off",lock_on:"Lock is on",lock_off:"No lock",st_files_sub:"Storage and export",sound_short:"Sound",lock_short:"Lock",
n_master:"New message notifications",n_master_h:"Alerts you when a message arrives from your other device",n_preview:"Show message content",n_preview_h:"When off it just says “New message”",n_focus:"Even while the app is open",n_focus_h:"Notify even when you're looking at the app",n_sound_h:"A short tone when a message arrives",n_test:"Try a notification",n_test_b:"Notifications are working ✓",
n_status_push:"Works even when the app is closed",n_status_local:"Works while the app is open or in the background",n_status_off:"Notifications are off",
n_blocked:"Notifications are blocked. Allow them in your browser's site settings.",n_unsupported:"This browser doesn't support notifications.",n_on_push:"Enabled. You'll get them even when the app is closed",n_on_local:"Enabled while the app is open or in the background",n_new:"New message",n_voice:"Voice message",
pin_lock:"PIN lock",pin_lock_h:"A 4-digit code when opening the app",autolock:"Lock after I leave for",al_0:"Right away",al_1:"1 min",al_5:"5 min",al_15:"15 min",
lock_title:"SaveBox is locked",lock_sub:"Enter your PIN",pin_new:"Choose a PIN",pin_new_s:"4 digits",pin_again:"Confirm the PIN",pin_again_s:"Enter it again",pin_set:"Lock enabled",pin_off:"Lock disabled",pin_enter:"Enter your current PIN",pin_enter_s:"To turn the lock off",
play:"Play",mic:"Record voice",rec_cancel:"Cancel recording",rec_unsupported:"This browser can't record audio.",mic_denied:"Can't reach the microphone. Allow it in your browser's site settings.",
merge_q:"The device you scanned is in a different space. Merge your space ({0} devices) into it? Your messages and files will join it.",merge_done:"Spaces merged ✓",merge_hint:"If two devices each created their own space, show a QR on one and scan it from the other to merge them into one space.",e_same:"Both devices are already in the same space."
});

let LANG=ls.get("lang",(navigator.language||"ar").toLowerCase().startsWith("ar")?"ar":"en");
const t=(k,...a)=>{let s=(T[LANG]&&T[LANG][k])||T.ar[k]||k;a.forEach((v,i)=>{s=s.replace("{"+i+"}",v)});return s};
function applyLang(){document.documentElement.lang=LANG;document.documentElement.dir=LANG==="ar"?"rtl":"ltr";const sp_=$("#spsub");if(sp_)sp_.textContent=t("tagline")}
function applyTheme(){const m=ls.get("theme","auto"),r=document.documentElement;if(m==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",m);const mt=$('meta[name=theme-color]');if(mt)mt.content=getComputedStyle(r).getPropertyValue("--bg").trim()||"#0A0F1A"}

/* ---------- أيقونات ---------- */
const P={attach:'<path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.9-8.9a3.4 3.4 0 014.8 4.8l-8.9 8.9a1.7 1.7 0 01-2.4-2.4l8-8"/>',send:'<path d="M3 11.5L21 3l-8.5 18-2.2-7.3L3 11.5z"/><path d="M10.3 13.7L21 3"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',dl:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',scan:'<path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2M4 12h16"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',file:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',laptop:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',open:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',pause:'<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M8.5 21h7"/>',back:'<path d="M21 5H9l-6 7 6 7h12z"/><path d="M13 9.5l5 5M18 9.5l-5 5"/>',bell:'<path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15z"/><path d="M10 21a2 2 0 004 0"/>',moon:'<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',half:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17" /><path d="M12 3.5a8.5 8.5 0 010 17z" fill="currentColor"/>',devices:'<rect x="3" y="5" width="13" height="9" rx="1.6"/><path d="M1.5 17.5h16"/><rect x="16.5" y="9" width="5" height="9.5" rx="1.4"/>',palette:'<path d="M12 3a9 9 0 100 18c1.3 0 2-.8 2-1.8 0-1.2-1-1.4-1-2.5 0-.9.7-1.5 1.7-1.5H17a4 4 0 004-4A8.5 8.5 0 0012 3z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7.5" r="1.1"/><circle cx="15.5" cy="8" r="1.1"/>',folder:'<path d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V17a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/><circle cx="12" cy="15.5" r="1.3" fill="currentColor"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',vol:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 010 6M18 6.5a8 8 0 010 11"/>',tag:'<path d="M3 12V4.5A1.5 1.5 0 014.5 3H12l9 9-9 9z"/><circle cx="8" cy="8" r="1.3"/>',scale:'<path d="M4 20l6-6M20 4l-6 6M14 10l-4 4M4 14v6h6M20 10V4h-6"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',img:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',vid:'<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3z"/>',note:'<path d="M5 4h14v16H5z"/><path d="M8.5 9h7M8.5 13h7M8.5 17h4"/>',chev:'<path d="M9 5l7 7-7 7"/>',link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||""}</svg>`;
const LOGO=`<svg class="lg" viewBox="0 0 64 64" fill="none" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#121A2B"/><g stroke="#EAF0FF" stroke-width="3"><path d="M14 26l18-9 18 9v20l-18 9-18-9z"/><path d="M14 26l18 9 18-9M32 35v20"/></g><circle cx="32" cy="35" r="4.6" fill="#FF8A3D"/></svg>`;

/* ---------- حالة التطبيق ---------- */
const S={sb:null,uid:null,space:null,items:[],urls:{},urlAt:0,ch:null,online:false,more:true,pending:0,inst:null,timers:{},filter:"all",q:"",seq:0,mine:new Set(),tourI:0};
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
function errMsg(e){const m=String((e&&(e.message||e.error_description||e.error))||e||"").toLowerCase();for(const k of ["phone","invalid","already","limit","nospace","busy","storage_full","same"])if(m.includes(k)&&(k!=="invalid"||!m.includes("jwt")))return t("e_"+k);if(m.includes("fetch")||m.includes("network")||m.includes("failed"))return t("e_net");return t("e_generic")}
async function call(fn,args){const r=await sb.rpc(fn,args||{});if(r.error)throw r.error;return r.data}
function ask(msg,danger){return new Promise(res=>{const o=document.createElement("div");o.className="ov mid";o.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><p>${esc(msg)}</p><div class="row"><button class="btn ghost" data-v="0">${t("no")}</button><button class="btn ${danger?"bad":""}" data-v="1">${t("yes")}</button></div></div>`;o.addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(b||e.target===o){o.remove();res(!!b&&b.dataset.v==="1")}});$("#ovs").appendChild(o);$("[data-v='1']",o).focus()})}
function closeOv(){$("#ovs").innerHTML="";stopScan();clearInterval(S.timers.inv);clearInterval(S.timers.invcd)}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#ovs").children.length)closeOv();else if($(".viewer"))closeViewer()}});

/* ---------- الإقلاع ---------- */
async function boot(){
 applyLang();applyTheme();applyPrefs();
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
 if(sp&&hasPin())await lockNow();
 if(sp)enterApp(sp);else if(!ls.get("tour",false))tour(0);else welcome();
}
function hideSplash(){const s=$("#splash");s.classList.add("out");setTimeout(()=>s.remove(),600)}

/* ---------- شاشة البداية ---------- */
function welcome(msg){
 leaveApp();stopScan();
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
function formLink(mode){
 mode=mode||"show";S.joinMode=mode;stopScan();
 const seg=`<div class="seg" role="group"><button data-act="lmode2" data-v="show" aria-pressed="${mode==="show"}">${esc(t("l_show"))}</button><button data-act="lmode2" data-v="scan" aria-pressed="${mode==="scan"}">${esc(t("l_scan"))}</button></div>`;
 if(mode==="show"){
  $("#root").innerHTML=`<div class="screen"><div class="wrap">
   <div class="brand">${LOGO}<b>${esc(t("link_title"))}</b></div>${seg}
   <div class="card">
    <label class="f">${esc(t("link_phone"))}<input class="in" id="fp" inputmode="tel" dir="ltr" placeholder="${esc(t("phone_ph"))}" autocomplete="tel"></label>
    <label class="f">${esc(t("device_name"))}<input class="in" id="fd" maxlength="40" value="${esc(defaultDevice())}"></label>
    <div class="msg" id="m"></div>
    <button class="btn" data-act="qr">${esc(t("show_qr"))}</button>
   </div>
   <button class="lnk" data-act="home">${esc(t("back"))}</button></div></div>`;
  $("#fp").focus();return;
 }
 $("#root").innerHTML=`<div class="screen"><div class="wrap">
  <div class="brand">${LOGO}<b>${esc(t("l_join"))}</b></div>${seg}
  <div class="card">
   <p style="margin:0;color:var(--mu)">${esc(t("l_join_hint"))}</p>
   <label class="f">${esc(t("device_name"))}<input class="in" id="fd" maxlength="40" value="${esc(defaultDevice())}"></label>
   <div class="scan" id="scanbox"><video id="sv" playsinline muted></video></div>
   <div class="msg" id="m"></div>
   <label class="f">${esc(t("manual_code"))}<div class="row"><input class="in" id="mc" dir="ltr" maxlength="9" autocapitalize="characters" autocomplete="off" placeholder="ABCD 2345"><button class="btn" data-act="joingo">${esc(t("approve"))}</button></div></label>
  </div>
  <button class="lnk" data-act="home">${esc(t("back"))}</button></div></div>`;
 startScan($("#scanbox"),async txt=>{const p=parseQR(txt);if(!p)return;if(p.type!=="sbi"){$("#m").textContent=t("l_wrong_new");return}await joinWith(p.code)},()=>{const b=$("#scanbox");if(b)b.remove();$("#m").textContent=t("no_cam")});
}
async function joinWith(code){
 const m=$("#m"),d=($("#fd")&&$("#fd").value.trim())||defaultDevice();
 try{const sp=await call("redeem_invite",{p_code:code,p_device:d});stopScan();enterApp(sp)}
 catch(e){if(m)m.textContent=errMsg(e)}
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
 S.space=sp;S.more=true;S.filter="all";S.q="";S.items=[];S.urls={};
 $("#root").innerHTML=`
 <header class="top">${LOGO}<div class="tt"><b id="sn">${esc(sp.name)}</b><small><span class="dot" id="dot"></span><span id="st">${esc(t("connecting"))}</span><span id="dn"></span></small></div>
  <button class="ib" data-act="search" aria-label="${esc(t("search"))}" title="${esc(t("search"))}">${ic("search")}</button>
  <button class="ib" data-act="scan" aria-label="${esc(t("link_device"))}" title="${esc(t("link_device"))}">${ic("qr")}</button>
  <button class="ib" data-act="settings" aria-label="${esc(t("settings"))}" title="${esc(t("settings"))}">${ic("gear")}</button></header>
 <div id="sbar" class="hide"><input id="sq" class="in" type="search" placeholder="${esc(t("search_ph"))}" aria-label="${esc(t("search"))}" autocomplete="off"></div>
 <nav class="tabs" role="tablist" aria-label="${esc(t("search"))}">${TABS.map(k=>`<button role="tab" data-act="tab" data-v="${k}" aria-pressed="${k==="all"}">${esc(t("tab_"+(k==="all"?"all":k)))}</button>`).join("")}</nav>
 <main id="feed" style="position:relative"><div class="inner" id="inner"></div></main>
 <button id="newpill" class="hide" data-act="bottom">${esc(t("newer"))}</button>
 <footer class="comp"><button class="rb att" data-act="pick" aria-label="${esc(t("attach"))}" title="${esc(t("attach"))}">${ic("attach")}</button>
  <textarea id="ta" rows="1" dir="auto" placeholder="${esc(t("msg_ph"))}" aria-label="${esc(t("msg_ph"))}" enterkeyhint="send"></textarea>
  <button class="rb mic" id="micb" data-act="mic" aria-label="${esc(t("mic"))}" title="${esc(t("mic"))}">${ic("mic")}</button>
  <button class="rb snd hide" id="sendb" data-act="send" aria-label="${esc(t("send"))}" title="${esc(t("send"))}" disabled>${ic("send")}</button>
  <div id="recbar" class="recbar hide"><button class="rb rc" data-act="reccancel" aria-label="${esc(t("rec_cancel"))}" title="${esc(t("rec_cancel"))}">${ic("trash")}</button><span class="rdot"></span><span id="rect" class="rect">0:00</span><canvas id="recwave"></canvas><button class="rb snd" data-act="recsend" aria-label="${esc(t("send"))}" title="${esc(t("send"))}">${ic("send")}</button></div>
  <input type="file" id="fi" multiple class="hide"></footer>`;
 devCount();
 const ta=$("#ta");
 ta.addEventListener("input",grow);
 ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&ls.get("enter",true)&&!matchMedia("(pointer:coarse)").matches){e.preventDefault();sendText()}});
 $("#fi").addEventListener("change",e=>{sendFiles([...e.target.files]);e.target.value=""});
 $("#feed").addEventListener("scroll",()=>{if(nearBottom())$("#newpill").classList.add("hide")},{passive:true});
 await loadItems(true);
 subscribe();
 S.timers.touch=setInterval(()=>{if(!document.hidden)call("touch_device").catch(()=>{})},120000);
 call("touch_device").catch(()=>{});
 S.timers.sync=setInterval(()=>{if(!S.online&&!document.hidden)syncNew()},8000);
 consumeShare();
 installBtn();
 if(nOn())pushSubscribe();
}
function grow(){const ta=$("#ta");if(!ta)return;ta.style.height="auto";ta.style.height=Math.min(150,ta.scrollHeight)+"px";const has=!!ta.value.trim();$("#sendb").disabled=!has;$("#sendb").classList.toggle("hide",!has);$("#micb").classList.toggle("hide",has)}
const nearBottom=()=>{const f=$("#feed");return !f||f.scrollHeight-f.scrollTop-f.clientHeight<160};
function devCount(){const n=(S.space.devices||[]).length;const e=$("#dn");if(e)e.textContent=n>1?" · "+t("devices_n",n):""}
function setStatus(on){S.online=on;const d=$("#dot"),s=$("#st");if(d)d.classList.toggle("on",on);if(s)s.textContent=on?t("connected"):t("connecting")}

/* ---------- الرسائل ---------- */
const KG={all:null,links:["link"],images:["image"],videos:["video"],files:["file","audio"],notes:["text"]};
const TABS=["all","links","images","videos","files","notes"];
const vis=it=>{
 const k=KG[S.filter];if(k&&!k.includes(it.kind))return false;
 if(S.q){const s=S.q.toLowerCase();return ((it.body||"")+" "+(it.file_name||"")).toLowerCase().includes(s)}
 return true;
};
const shown=()=>S.items.filter(vis);
function qItems(){
 let q=sb.from("items").select("*").eq("space_id",S.space.id);
 const k=KG[S.filter];if(k)q=q.in("kind",k);
 if(S.q){const e=S.q.replace(/[%,()*\\]/g," ");q=q.or(`body.ilike.%${e}%,file_name.ilike.%${e}%`)}
 return q;
}
function mergeRows(rows){
 rows.forEach(r=>{if(!S.items.some(x=>x.id===r.id))S.items.push(r)});
 S.items.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
}
async function loadItems(first,older){
 const mySeq=++S.seq;
 let q=qItems().order("created_at",{ascending:false}).limit(60);
 if(older){const vs=shown().filter(i=>!i.pending);if(vs.length)q=q.lt("created_at",vs[0].created_at)}
 const {data,error}=await q;
 if(mySeq!==S.seq)return;
 if(error){toast(errMsg(error));return}
 const rows=(data||[]).slice().reverse();
 if(rows.length<60)S.more=false;
 const f=$("#feed"),h=f?f.scrollHeight:0;
 mergeRows(rows);renderFeed();
 if(f){f.style.scrollBehavior="auto";f.scrollTop=older?f.scrollHeight-h:f.scrollHeight;f.style.scrollBehavior=""}
 mediaUrls(rows);
}
async function syncNew(){
 if(!S.space)return;const last=S.items.filter(i=>!i.pending).slice(-1)[0];
 let q=sb.from("items").select("*").eq("space_id",S.space.id).order("created_at",{ascending:true}).limit(100);
 if(last)q=q.gt("created_at",last.created_at);
 const {data}=await q;(data||[]).forEach(r=>addItem(r));
}
function emptyHtml(){
 if(S.q)return `<div class="empty">${ic("search")}<b>${esc(t("no_results"))}</b><span>${esc(t("no_results_s"))}</span></div>`;
 if(S.filter!=="all")return `<div class="empty">${ic(S.filter==="images"?"img":S.filter==="links"?"link":S.filter==="videos"?"vid":S.filter==="notes"?"note":"file")}<b>${esc(t("empty_"+S.filter))}</b><span>${esc(t("empty_s"))}</span></div>`;
 return `<div class="empty">${ic("file")}<b>${esc(t("empty_t"))}</b><span>${esc(t("empty_s"))}</span></div>`;
}
function tileHtml(it){
 const u=S.urls[it.file_path]&&S.urls[it.file_path].u;
 return `<button class="tile" data-act="view" data-id="${it.id}" aria-label="${esc(it.file_name||"")}">${u?`<img src="${esc(u)}" alt="${esc(it.file_name||"")}" loading="lazy">`:`<span class="sk" style="width:100%;height:100%;margin:0;border-radius:0"></span>`}</button>`;
}
function renderFeed(){
 const inner=$("#inner");if(!inner)return;
 const vs=shown();
 inner.classList.toggle("gal",S.filter==="images"&&!S.q);
 if(!vs.length){inner.innerHTML=emptyHtml();return}
 const more=S.more?`<button class="more" data-act="older">${esc(t("older"))}</button>`:"";
 if(S.filter==="images"&&!S.q){inner.innerHTML=more+vs.filter(i=>!i.pending).map(tileHtml).join("");return}
 inner.innerHTML=more+vs.map(itemHtml).join("");
 fixDays();
}
function fixDays(){let prev="";$$("#inner .it").forEach(a=>{const d=$(".day",a),k=a.dataset.day;d.classList.toggle("hide",k===prev);prev=k})}
function linkify(s){return s.replace(/(https?:\/\/[^\s<]+)/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`)}
function host(u){try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return u}}
function mediaHtml(it){
 if(isVoice(it))return voiceHtml(it);
 const u=S.urls[it.file_path]&&S.urls[it.file_path].u;
 if(it.kind==="image")return u?`<button class="im" data-act="view" data-id="${it.id}" aria-label="${esc(it.file_name||"")}"><img data-p="${esc(it.file_path)}" src="${esc(u)}" alt="${esc(it.file_name||"")}" loading="lazy"></button>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 if(it.kind==="video")return u?`<video data-p="${esc(it.file_path)}" src="${esc(u)}" controls preload="metadata" playsinline></video>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 if(it.kind==="audio")return u?`<audio data-p="${esc(it.file_path)}" src="${esc(u)}" controls preload="metadata"></audio>`:`<div class="sk" data-p="${esc(it.file_path)}"></div>`;
 return `<div class="fl"><span class="fi">${ic("file")}</span><div><b dir="auto">${esc(it.file_name||"")}</b><small>${esc(fmtSize(it.size))}</small></div></div>`;
}
function itemHtml(it){
 let body="";
 if(it.pending)body=`<div class="fl"><span class="fi"><span class="pulse" style="margin:0"></span></span><div><b dir="auto">${esc(it.file_name||"")}</b><small>${esc(t("uploading"))}</small></div></div>`;
 else if(it.kind==="text")body=`<p class="tx" dir="auto">${linkify(esc(it.body))}</p>`;
 else if(it.kind==="link"&&/^https?:\/\//i.test(it.body||""))body=`<a class="lk" href="${esc(it.body)}" target="_blank" rel="noopener noreferrer"><b>${esc(host(it.body))}</b><span>${esc(it.body)}</span></a>`;
 else if(it.kind==="link")body=`<p class="tx" dir="auto">${esc(it.body)}</p>`;
 else body=mediaHtml(it);
 const acts=it.pending?"":`${it.kind==="text"||it.kind==="link"?`<button data-act="copy" data-id="${it.id}" aria-label="${esc(t("copy"))}" title="${esc(t("copy"))}">${ic("copy")}</button>`:""}${it.kind==="link"&&/^https?:\/\//i.test(it.body||"")?`<a href="${esc(it.body)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t("open"))}" title="${esc(t("open"))}" style="width:30px;height:28px;display:grid;place-items:center;color:var(--mu)">${ic("open")}</a>`:""}${it.file_path?`<button data-act="dl" data-id="${it.id}" aria-label="${esc(t("download"))}" title="${esc(t("download"))}">${ic("dl")}</button>`:""}<button data-act="del" data-id="${it.id}" aria-label="${esc(t("del"))}" title="${esc(t("del"))}">${ic("trash")}</button>`;
 return `<article class="it" data-id="${it.id}" data-day="${new Date(it.created_at).toDateString()}"><div class="day">${esc(dayLabel(it.created_at))}</div><div class="bub">${body}<div class="meta"><span class="dv" style="--h:${hue(it.device)}"><i></i>${esc(it.device||"")}</span><time>${hhmm(it.created_at)}</time><span class="acts">${acts}</span></div></div></article>`;
}
function addItem(it,mine){
 if(S.items.some(x=>x.id===it.id))return;
 const wasNear=nearBottom();
 S.items.push(it);S.items.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
 if(!vis(it))return;
 const inner=$("#inner");if(!inner)return;
 const simple=S.filter==="all"&&!S.q&&!$("#inner .empty");
 if(simple){
  const tpl=document.createElement("template");tpl.innerHTML=itemHtml(it).trim();
  const vs=shown(),idx=vs.indexOf(it),next=vs[idx+1];
  const nextEl=next&&$(`#inner .it[data-id="${next.id}"]`);
  inner.insertBefore(tpl.content.firstChild,nextEl||null);fixDays();
 }else renderFeed();
 if(it.file_path&&!it.pending)mediaUrls([it]);
 if(mine||wasNear){const f=$("#feed");f.scrollTop=f.scrollHeight}else $("#newpill").classList.remove("hide");
}
function removeItem(id){
 S.items=S.items.filter(x=>x.id!==id);const el=$(`#inner .it[data-id="${id}"],#inner .tile[data-id="${id}"]`);
 if(el&&!shown().length)renderFeed();else if(el){el.remove();if(S.filter==="all")fixDays()}
}
async function mediaUrls(rows){
 const need=rows.filter(r=>r.file_path&&["image","video","audio"].includes(r.kind)&&!(S.urls[r.file_path]&&S.urls[r.file_path].e>Date.now()));
 if(!need.length)return;
 const paths=[...new Set(need.map(r=>r.file_path))];
 const {data,error}=await sb.storage.from("savebox").createSignedUrls(paths,21600);
 if(error||!data)return;
 S.urlAt=Date.now();
 data.forEach(d=>{if(d.signedUrl)S.urls[d.path]={u:d.signedUrl,e:Date.now()+21000e3}});
 if(S.filter==="images"&&!S.q){renderFeed();return}
 need.forEach(r=>{const el=$(`#inner .it[data-id="${r.id}"] .bub`);if(!el)return;const old=el.firstElementChild;if(old&&old.classList.contains("sk"))paint(r,el,old)});
}
function paint(r,el,old){const tpl=document.createElement("template");tpl.innerHTML=mediaHtml(r).trim();if(tpl.content.firstChild)old.replaceWith(tpl.content.firstChild)}
async function refreshMedia(){
 if(Date.now()-S.urlAt<5*3600e3)return;
 const media=S.items.filter(r=>r.file_path&&["image","video","audio"].includes(r.kind));
 S.urls={};
 const paths=media.map(r=>r.file_path);if(!paths.length)return;
 const {data}=await sb.storage.from("savebox").createSignedUrls(paths,21600);if(!data)return;
 S.urlAt=Date.now();
 data.forEach(d=>{if(d.signedUrl){S.urls[d.path]={u:d.signedUrl,e:Date.now()+21000e3};$$(`[data-p="${CSS.escape(d.path)}"]`).forEach(e=>{if(e.tagName!=="DIV")e.src=d.signedUrl})}});
 if(S.filter==="images"&&!S.q)renderFeed();
}
function setFilter(f){
 if(S.filter===f)return;
 S.filter=f;S.more=true;
 $$("[data-act=tab]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===f));
 const act=$("[data-act=tab][aria-pressed=true]");if(act)act.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
 renderFeed();const fd=$("#feed");if(fd)fd.scrollTop=fd.scrollHeight;
 loadItems(true);
}
function toggleSearch(on){
 const bar=$("#sbar");if(!bar)return;
 const show=on==null?bar.classList.contains("hide"):on;
 bar.classList.toggle("hide",!show);
 if(show)$("#sq").focus();else if(S.q){$("#sq").value="";S.q="";S.more=true;renderFeed();loadItems(true)}
}

/* ---------- الإرسال ---------- */
async function insertItem(row){
 const {data,error}=await sb.from("items").insert({space_id:S.space.id,device:S.space.device,...row}).select().single();
 if(error){toast(errMsg(error));return null}
 S.mine.add(data.id);addItem(data,true);return data;
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
  .on("postgres_changes",{event:"INSERT",schema:"public",table:"items",filter:"space_id=eq."+sid},p=>{if(p.new){const fresh=!S.mine.has(p.new.id)&&!S.items.some(x=>x.id===p.new.id);addItem(p.new);if(fresh){beep();notifyIncoming(p.new)}}})
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
  if(sp.id!==S.space.id){toast(t("merge_done"));enterApp(sp);return}
  const before=(S.space.devices||[]).length;S.space=Object.assign(S.space,sp);devCount();
  const nm=$("#sn");if(nm)nm.textContent=sp.name;
  if(sp.devices.length>before){
   const nw=sp.devices.find(d=>p.new&&d.user_id===p.new.user_id&&!d.me);
   if(nw)toast(t("new_dev",nw.device));
   S.items=[];S.more=true;loadItems(true);
  }
  if($("#setbox")&&S.setPage&&S.setPage!=="home")setRender(S.setPage,"nofx");
 }catch(e){}
}
async function checkKicked(){
 try{const sp=await call("my_space");if(sp){if(S.space&&sp.id!==S.space.id){enterApp(sp)}return}}catch(e){return}
 await sb.auth.signOut();const r=await sb.auth.signInAnonymously();if(r.data&&r.data.session)S.uid=r.data.session.user.id;
 closeOv();welcome(t("kicked"));
}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden||!S.space)return;
 syncNew();refreshMedia();checkKicked();
});
addEventListener("online",()=>{if(S.space)syncNew()});

/* ---------- مسح QR + ربط الأجهزة (أي جهاز يقدر يعرض أو يمسح) ---------- */
let scanStream=null,scanRAF=0;
function stopScan(){cancelAnimationFrame(scanRAF);scanRAF=0;if(scanStream){scanStream.getTracks().forEach(x=>x.stop());scanStream=null}}
function parseQR(txt){const m=/^(savebox|sbi):([A-Z2-9]{8})$/i.exec(String(txt||"").trim());return m?{type:m[1].toLowerCase(),code:m[2].toUpperCase()}:null}
async function startScan(box,onQR,onFail){
 stopScan();
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("nocam");
  scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
  const v=$("video",box);v.srcObject=scanStream;await v.play();
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
    if(txt&&txt!==last){last=txt;setTimeout(()=>{last=""},3000);await onQR(txt)}
   }
   scanRAF=requestAnimationFrame(tick);
  };
  tick();
 }catch(e){onFail&&onFail()}
}
function qrSvg(payload){const q=qrcode(0,"M");q.addData(payload);q.make();return q.createSvgTag({scalable:true,cellSize:4,margin:0})}
function openLink(mode){
 stopScan();clearInterval(S.timers.inv);clearInterval(S.timers.invcd);
 mode=mode||"scan";S.linkMode=mode;
 const o=document.createElement("div");o.className="ov";
 o.innerHTML=`<div class="sheet" id="lkbox" role="dialog" aria-modal="true"><h2>${esc(t("scan_title"))}<button class="ib" data-act="closeov" aria-label="${esc(t("cancel"))}">${ic("x")}</button></h2>
  <div class="seg" role="group"><button data-act="lmode" data-v="scan" aria-pressed="${mode==="scan"}">${esc(t("l_scan"))}</button><button data-act="lmode" data-v="show" aria-pressed="${mode==="show"}">${esc(t("l_show"))}</button></div>
  <div id="lkbody" style="display:grid;gap:14px"></div></div>`;
 $("#ovs").innerHTML="";$("#ovs").appendChild(o);
 o.addEventListener("click",e=>{if(e.target===o)closeOv()});
 mode==="scan"?linkScan():linkShow();
}
function linkScan(){
 $("#lkbody").innerHTML=`<p style="margin:0;color:var(--mu)">${esc(t("scan_hint"))}</p>
  <div class="scan" id="scanbox"><video id="sv" playsinline muted></video></div><div class="msg" id="sm"></div>
  <label class="f">${esc(t("manual_code"))}<div class="row"><input class="in" id="mc" dir="ltr" maxlength="9" autocapitalize="characters" autocomplete="off" placeholder="ABCD 2345"><button class="btn" data-act="mcgo">${esc(t("approve"))}</button></div></label>`;
 startScan($("#scanbox"),async txt=>{const p=parseQR(txt);if(!p)return;if(p.type==="sbi"){await mergeFlow(p.code);return}await approve(p.code)},()=>{const b=$("#scanbox");if(b)b.remove();showSm(t("no_cam"))});
}
function showSm(m){const e=$("#sm");if(!e)return;e.textContent=m;clearTimeout(S.timers.sm);S.timers.sm=setTimeout(()=>{if(e)e.textContent=""},3500)}
async function approve(code){
 try{const dev=await call("approve_link",{p_code:code});stopScan();closeOv();toast(t("linked_ok",dev));await refreshSpace()}
 catch(e){if(/invalid/i.test(String(e&&e.message)))return mergeFlow(code);showSm(errMsg(e))}
}
let merging=false;
async function mergeFlow(code){
 if(merging)return;merging=true;
 try{
  const n=(S.space.devices||[]).length;
  if(!(await ask(t("merge_q",n),true)))return;
  try{const sp=await call("merge_into",{p_code:code});stopScan();closeOv();toast(t("merge_done"));enterApp(sp)}
  catch(e){showSm(errMsg(e))}
 }finally{merging=false}
}
async function linkShow(){
 stopScan();
 $("#lkbody").innerHTML=`<p style="margin:0;color:var(--mu)">${esc(t("l_show_hint"))}</p><div class="qrbox" id="qr"></div><div class="code" id="cc"></div>
  <div style="text-align:center;color:var(--mu)"><span class="pulse"></span>${esc(t("waiting_new"))} <small id="cd"></small></div><div class="msg" id="sm"></div>`;
 const base=(S.space.devices||[]).length;
 S.inv={code:"",exp:0};
 const renew=async()=>{
  try{const c=await call("create_invite");S.inv={code:c,exp:Date.now()+180000};const q=$("#qr");if(!q)return;q.innerHTML=qrSvg("sbi:"+c);$("#cc").textContent=c.slice(0,4)+" "+c.slice(4)}
  catch(e){showSm(errMsg(e))}
 };
 await renew();
 S.timers.invcd=setInterval(()=>{
  if(!S.inv)return;
  const left=Math.max(0,Math.round((S.inv.exp-Date.now())/1000));
  const el=$("#cd");if(el)el.textContent=t("expires",Math.floor(left/60)+":"+String(left%60).padStart(2,"0"));
  if(Date.now()>=S.inv.exp-1000)renew();
 },1000);
 S.timers.inv=setInterval(async()=>{
  try{const sp=await call("my_space");if(sp&&sp.devices.length>base){const nw=sp.devices[sp.devices.length-1];S.space=Object.assign(S.space,sp);devCount();closeOv();toast(t("new_dev",nw.device))}}catch(e){}
 },2000);
}
async function refreshSpace(){try{const sp=await call("my_space");if(sp){S.space=Object.assign(S.space,sp);devCount()}}catch(e){}}

/* ---------- الإعدادات ---------- */
const FONTS={s:".92rem",m:"1rem",l:"1.14rem",xl:"1.3rem"};
function applyPrefs(){
 document.documentElement.style.setProperty("--fs",FONTS[ls.get("font","m")]||"1rem");
 document.body.classList.toggle("nodev",!ls.get("showdev",true));
}
function beep(){
 if(!ls.get("sound",false))return;
 try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(880,c.currentTime);o.frequency.exponentialRampToValueAtTime(1320,c.currentTime+.12);g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.12,c.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.2);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.22);setTimeout(()=>c.close(),400)}catch(e){}
}
/* ---------- الإعدادات (نسخة أسهل ومتحركة) ---------- */
const SPAGES=[
 {k:"devices",i:"devices",c:"#3D7BFF"},{k:"notif",i:"bell",c:"#FF8A3D"},{k:"look",i:"palette",c:"#B879FF"},
 {k:"files",i:"folder",c:"#19D3A2"},{k:"privacy",i:"lock",c:"#FF5C7A"},{k:"about",i:"info",c:"#8FA0C4"}];
const spColor=k=>(SPAGES.find(p=>p.k===k)||{c:"#FF8A3D"}).c;
function rw(i,c,label,hint,ctl,n){return `<div class="rw" style="--n:${n||0};--c:${c}"><span class="ri">${ic(i)}</span><div class="rt"><b>${esc(label)}</b>${hint?`<small>${esc(hint)}</small>`:""}</div>${ctl||""}</div>`}
const tgb=(on,act,label)=>`<button class="tg" role="switch" aria-checked="${on}" data-act="${act}" aria-label="${esc(label)}"><i></i></button>`;
function subOf(k,sp){
 if(k==="devices")return t("devices_n",(sp.devices||[]).length);
 if(k==="notif")return nOn()?t("on"):t("off");
 if(k==="look")return t(ls.get("theme","auto"))+" · "+(LANG==="ar"?"العربية":"English");
 if(k==="files")return S.stats?fmtSize(S.stats.bytes||0):t("st_files_sub");
 if(k==="privacy")return hasPin()?t("lock_on"):t("lock_off");
 return t("version")+" "+VER;
}
function setHome(sp){
 const th=ls.get("theme","auto"),ini=(sp.name||"S").trim().slice(0,1).toUpperCase();
 const max=400*1048576,pct=S.stats?Math.min(100,Math.round((S.stats.bytes||0)/max*100)):0;
 return `<button class="prof" data-act="spage" data-v="account" style="--n:0"><span class="av">${esc(ini)}</span><span class="pt"><b>${esc(sp.name)}</b><small dir="ltr">${esc(sp.phone)}</small><span class="mini"><i style="width:${Math.max(pct,S.stats&&S.stats.bytes?3:0)}%"></i></span></span>${ic("chev","cv")}</button>
 <div class="quick" style="--n:1">
  <button class="qk" data-act="qtheme" aria-label="${esc(t("theme"))}"><span class="qi">${ic(th==="dark"?"moon":th==="light"?"sun":"half")}</span><small>${esc(t(th))}</small></button>
  <button class="qk ${nOn()?"on":""}" data-act="qnotif" aria-label="${esc(t("sp_notif"))}"><span class="qi">${ic("bell")}</span><small>${esc(t("sp_notif"))}</small></button>
  <button class="qk ${ls.get("sound",false)?"on":""}" data-act="qsound" aria-label="${esc(t("sound_short"))}"><span class="qi">${ic("vol")}</span><small>${esc(t("sound_short"))}</small></button>
  <button class="qk ${hasPin()?"on":""}" data-act="qlock" aria-label="${esc(t("sp_privacy"))}"><span class="qi">${ic("lock")}</span><small>${esc(t("lock_short"))}</small></button>
 </div>
 <div class="list">${SPAGES.map((p,i)=>`<button class="nv" data-act="spage" data-v="${p.k}" style="--n:${i+2};--c:${p.c}"><span class="ri">${ic(p.i)}</span><span class="rt"><b>${esc(t("sp_"+p.k))}</b><small>${esc(subOf(p.k,sp))}</small></span>${ic("chev","cv")}</button>`).join("")}</div>`;
}
function setPageHtml(k,sp){
 const c=spColor(k);
 if(k==="account"){
  const st=S.stats;
  return `<div class="grp"><label class="fld" style="--n:0"><span>${esc(t("space_name"))}</span><div class="row"><input class="in" id="spn" maxlength="40" value="${esc(sp.name)}"><button class="btn ghost" data-act="svspace">${esc(t("save"))}</button></div></label>
   <label class="fld" style="--n:1"><span>${esc(t("phone"))}</span><input class="in" dir="ltr" value="${esc(sp.phone)}" readonly></label>
   <label class="fld" style="--n:2"><span>${esc(t("s_this"))}</span><div class="row"><input class="in" id="dvn" maxlength="40" value="${esc(sp.device)}"><button class="btn ghost" data-act="svdev">${esc(t("save"))}</button></div></label></div>
   <p class="hint" style="--n:3">${esc(t("sync_hint"))}</p>`;
 }
 if(k==="devices"){
  const devs=(sp.devices||[]).map((d,i)=>`<div class="dev" style="--h:${hue(d.device)};--n:${i}"><span class="di">${ic(isPhoneDev(d.device)?"phone":"laptop")}</span><div><b>${esc(d.device)}${d.me?` <small>(${esc(t("this_dev"))})</small>`:""}</b><small>${d.me?esc(t("connected")):esc(t("last_seen",rel(d.last_seen)))}</small></div>${d.me?"":`<button class="btn ghost" style="padding:6px 12px" data-act="rmdev" data-id="${d.user_id}" data-n="${esc(d.device)}">${esc(t("remove"))}</button>`}</div>`).join("");
  const n=(sp.devices||[]).length;
  return `<div class="grp">${devs}</div>
   <div class="grp two" style="--n:${n+1}"><button class="btn" data-act="linkshow">${ic("qr")}${esc(t("l_show"))}</button><button class="btn ghost" data-act="scan">${ic("scan")}${esc(t("l_scan"))}</button></div>
   <p class="hint" style="--n:${n+2}">${esc(t("merge_hint"))}</p>
   ${n>1?`<button class="btn ghost" style="--n:${n+3}" data-act="rmothers">${esc(t("remove_others"))}</button>`:""}`;
 }
 if(k==="notif"){
  const pushok=ls.get("pushok",false),on=nOn();
  const stat=on?(pushok?t("n_status_push"):t("n_status_local")):t("n_status_off");
  return `<div class="stat ${on?(pushok?"good":"mid"):"off"}" style="--n:0"><i></i>${esc(stat)}</div>
   <div class="grp">${rw("bell",c,t("n_master"),t("n_master_h"),tgb(on,"nmaster",t("n_master")),1)}
   ${rw("eye",c,t("n_preview"),t("n_preview_h"),tgb(ls.get("npreview",true),"npreview",t("n_preview")),2)}
   ${rw("phone",c,t("n_focus"),t("n_focus_h"),tgb(ls.get("nfocus",false),"nfocus",t("n_focus")),3)}
   ${rw("vol",c,t("sound"),t("n_sound_h"),tgb(ls.get("sound",false),"sound",t("sound")),4)}</div>
   <button class="btn ghost" style="--n:5" data-act="ntest">${ic("bell")}${esc(t("n_test"))}</button>`;
 }
 if(k==="look"){
  const th=ls.get("theme","auto"),fs=ls.get("font","m");
  const thm=(v,lab)=>`<button class="thm ${v}" data-act="theme" data-v="${v}" aria-pressed="${th===v}"><span class="pv"><i></i><i></i><i></i></span><b>${esc(lab)}</b></button>`;
  return `<div class="lbl" style="--n:0">${esc(t("theme"))}</div><div class="thms" style="--n:1">${thm("auto",t("auto"))}${thm("light",t("light"))}${thm("dark",t("dark"))}</div>
   <div class="lbl" style="--n:2">${esc(t("lang"))}</div><div class="seg big" style="--n:3" role="group"><button data-act="lang" data-v="ar" aria-pressed="${LANG==="ar"}">العربية</button><button data-act="lang" data-v="en" aria-pressed="${LANG==="en"}">English</button></div>
   <div class="lbl" style="--n:4">${esc(t("font"))}</div><div class="fonts" style="--n:5">${["s","m","l","xl"].map(f=>`<button class="ft" data-act="font" data-v="${f}" aria-pressed="${fs===f}"><span style="font-size:${{s:".9rem",m:"1.05rem",l:"1.3rem",xl:"1.6rem"}[f]}">${LANG==="ar"?"أب":"Aa"}</span><small>${esc(t("font_"+f))}</small></button>`).join("")}</div>
   <div class="grp" style="--n:6">${rw("tag",c,t("show_dev"),"",tgb(ls.get("showdev",true),"showdev",t("show_dev")),0)}${rw("send",c,t("enter_send"),"",tgb(ls.get("enter",true),"enter",t("enter_send")),1)}</div>`;
 }
 if(k==="files"){
  const st=S.stats,max=400*1048576,used=st?+st.bytes||0:0,pct=Math.min(100,Math.round(used/max*100));
  const kinds=st&&st.kinds?Object.entries(st.kinds).map(([x,n])=>`<span class="chip">${esc(t("k_"+x))} ${n}</span>`).join(""):"";
  const mx=ls.get("max",25);
  return `<div class="meter" style="--n:0"><div class="mt"><b id="mused">${esc(fmtSize(used))}</b><span>${esc(t("st_of"))}</span></div><div class="bar"><i id="mbar" style="width:${Math.max(pct,used?2:0)}%"></i></div><div class="chips" id="mchips">${kinds}</div></div>
   <div class="grp">${rw("scale",c,t("compress"),"",tgb(ls.get("compress",true),"cmp",t("compress")),1)}</div>
   <label class="fld" style="--n:2"><span id="mxl">${esc(t("max_size",mx))}</span><input type="range" id="mx" min="1" max="50" value="${mx}"></label>
   <button class="btn ghost" style="--n:3" data-act="export">${ic("dl")}${esc(t("export"))}</button>`;
 }
 if(k==="privacy"){
  const al=ls.get("autolock",1);
  return `<div class="grp">${rw("lock",c,t("pin_lock"),t("pin_lock_h"),tgb(hasPin(),"pin",t("pin_lock")),0)}</div>
   ${hasPin()?`<div class="lbl" style="--n:1">${esc(t("autolock"))}</div><div class="seg big" style="--n:2" role="group">${[0,1,5,15].map(m=>`<button data-act="alock" data-v="${m}" aria-pressed="${al===m}">${esc(t("al_"+m))}</button>`).join("")}</div>`:""}
   <div class="lbl" style="--n:3">${esc(t("s_danger"))}</div>
   <button class="btn ghost" style="--n:4" data-act="leave">${esc(t("leave"))}</button><button class="btn bad" style="--n:5" data-act="wipe">${esc(t("wipe"))}</button>`;
 }
 return `<div class="abt" style="--n:0">${LOGO}<div><b>SaveBox</b><small>${esc(t("version"))} ${VER}</small></div></div>
  <p class="hint" style="--n:1;font-size:1rem">${esc(t("about_desc"))}</p>
  <div class="grp" style="--n:2"><h4>${esc(t("how_title"))}</h4><ol class="how"><li>${esc(t("how1"))}</li><li>${esc(t("how2"))}</li><li>${esc(t("how3"))}</li><li>${esc(t("how4"))}</li></ol></div>
  <div class="grp" style="--n:3"><h4>${esc(t("shortcuts"))}</h4><div class="kb"><span><kbd>Enter</kbd>${esc(t("sc_send"))}</span><span><kbd>Shift</kbd>+<kbd>Enter</kbd>${esc(t("sc_nl"))}</span><span><kbd>Ctrl</kbd>+<kbd>V</kbd>${esc(t("sc_paste"))}</span><span><kbd>Esc</kbd>${esc(t("sc_esc"))}</span></div></div>
  ${S.inst?`<button class="btn" style="--n:4" data-act="install">${esc(t("install"))}</button>`:""}<button class="btn ghost" style="--n:5" data-act="replay">${esc(t("replay"))}</button><button class="btn ghost" style="--n:6" data-act="upd">${esc(t("update"))}</button>`;
}
function setRender(page,dir){
 const sp=S.space;S.setPage=page;
 const body=page==="home"?setHome(sp):setPageHtml(page,sp);
 const title=page==="home"?t("settings"):t("sp_"+page);
 const root=$("#setroot");if(!root)return;
 $("#sethead",root).innerHTML=`${page==="home"?"":`<button class="ib" data-act="sback" aria-label="${esc(t("back"))}">${ic("chev","bk")}</button>`}<h2>${esc(title)}</h2><button class="ib" data-act="closeov" aria-label="${esc(t("cancel"))}">${ic("x")}</button>`;
 const pg=$("#setpg",root);
 pg.className="spg "+(dir||"");pg.style.setProperty("--pc",page==="home"?"#FF8A3D":spColor(page));
 pg.innerHTML=body;
 void pg.offsetWidth;
 const mx=$("#mx");if(mx)mx.addEventListener("input",e=>{ls.set("max",+e.target.value);$("#mxl").textContent=t("max_size",e.target.value)});
 const sb2=$("#setbox");if(sb2)sb2.scrollTop=0;
}
async function openSettings(page,keep){
 await refreshSpace();
 const ov=$("#ovs");
 ov.innerHTML=`<div class="ov"><div class="sheet" id="setbox" role="dialog" aria-modal="true"><div id="setroot"><div class="shead" id="sethead"></div><div id="setpg"></div></div></div></div>`;
 const ovEl=ov.firstChild;ovEl.addEventListener("click",e=>{if(e.target===ovEl)closeOv()});
 setRender(page||"home","");
 call("space_stats").then(st=>{S.stats=st;if(!$("#setroot"))return;const p=S.setPage;if(p==="home"||p==="files"){const sc=$("#setbox").scrollTop;setRender(p,"nofx");$("#setbox").scrollTop=sc}}).catch(()=>{});
}

async function exportText(){
 const rows=[];let from=0;
 for(;;){const {data}=await sb.from("items").select("kind,body,device,created_at").eq("space_id",S.space.id).in("kind",["text","link"]).order("created_at",{ascending:true}).range(from,from+999);if(!data||!data.length)break;rows.push(...data);if(data.length<1000)break;from+=1000}
 if(!rows.length){toast(t("export_none"));return}
 const txt=rows.map(r=>`[${new Date(r.created_at).toLocaleString(LANG==="ar"?"ar-EG":"en-GB")}] ${r.device||""}\n${r.body}\n`).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"}));a.download="savebox-"+new Date().toISOString().slice(0,10)+".txt";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast(t("exported"));
}
async function updateApp(){
 toast(t("updating"));
 try{if(navigator.serviceWorker){for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister()}for(const k of await caches.keys())if(k!=="sb-share")await caches.delete(k)}catch(e){}
 location.reload();
}

/* ---------- رسائل صوتية (زي واتساب) ---------- */
const VBARS=34;
function vBars(seed){let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619);const r=[];for(let i=0;i<VBARS;i++){h=Math.imul(h^(h>>>13),1274126177);const v=((h>>>0)%1000)/1000;const env=.35+.65*Math.sin((i+2)/(VBARS+3)*Math.PI);r.push(Math.max(.16,Math.min(1,.18+v*.82*env)))}return r}
const isVoice=it=>it&&it.kind==="audio"&&/^voice-/.test(it.file_name||"");
const voiceSecs=it=>{const m=/-(\d+)s\.[a-z0-9]+$/i.exec(it.file_name||"");return m?+m[1]:0};
const fmtT=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
function voiceHtml(it){
 const bars=vBars(it.file_path||it.id).map((v,i)=>`<i style="height:${Math.round(v*100)}%"></i>`).join("");
 return `<div class="vo" data-id="${it.id}"><button class="vp" data-act="vplay" data-id="${it.id}" aria-label="${esc(t("play"))}">${ic("play")}</button><div class="vw" data-act="vseek" data-id="${it.id}">${bars}</div><span class="vt">${fmtT(voiceSecs(it))}</span><button class="vs" data-act="vspeed" data-id="${it.id}" aria-label="x">1×</button></div>`;
}
const VP={a:null,id:null,rate:1};
function voiceEl(id){return $(`.vo[data-id="${id}"]`)}
function voicePaint(id,p,playing){
 const el=voiceEl(id);if(!el)return;
 const bars=$$(".vw i",el),n=Math.round(p*bars.length);
 bars.forEach((b,i)=>b.classList.toggle("on",i<n));
 el.classList.toggle("playing",!!playing);
 const bt=$(".vp",el);if(bt)bt.innerHTML=ic(playing?"pause":"play");
}
function voiceStop(){if(VP.a){VP.a.pause();voicePaint(VP.id,0,false);VP.a=null;VP.id=null}}
async function voicePlay(id){
 if(VP.id===id&&VP.a){if(VP.a.paused)VP.a.play();else VP.a.pause();return}
 voiceStop();
 const it=S.items.find(x=>x.id===id);if(!it)return;
 let u=S.urls[it.file_path]&&S.urls[it.file_path].u;
 if(!u){const r=await sb.storage.from("savebox").createSignedUrl(it.file_path,21600);if(r.error||!r.data){toast(errMsg(r.error));return}u=r.data.signedUrl;S.urls[it.file_path]={u,e:Date.now()+21000e3}}
 const a=new Audio();a.preload="auto";a.src=u;a.playbackRate=VP.rate;VP.a=a;VP.id=id;
 const known=voiceSecs(it);
 const dur=()=>isFinite(a.duration)&&a.duration>0?a.duration:known||1;
 a.addEventListener("loadedmetadata",()=>{if(a.duration===Infinity){a.currentTime=1e101;a.addEventListener("timeupdate",function f(){a.removeEventListener("timeupdate",f);a.currentTime=0},{once:true})}});
 a.addEventListener("timeupdate",()=>{if(VP.a===a)voicePaint(id,Math.min(1,a.currentTime/dur()),!a.paused)});
 a.addEventListener("play",()=>voicePaint(id,a.currentTime/dur(),true));
 a.addEventListener("pause",()=>voicePaint(id,a.currentTime/dur(),false));
 a.addEventListener("ended",()=>{voicePaint(id,0,false);if(VP.a===a){VP.a=null;VP.id=null}});
 a.addEventListener("error",()=>{toast(t("e_generic"));voicePaint(id,0,false)});
 try{await a.play()}catch(e){}
}
function voiceSeek(id,ev){
 const el=voiceEl(id);if(!el)return;
 if(VP.id!==id||!VP.a){voicePlay(id);return}
 const r=$(".vw",el).getBoundingClientRect(),p=Math.min(1,Math.max(0,(ev.clientX-r.left)/r.width));
 const it=S.items.find(x=>x.id===id),d=isFinite(VP.a.duration)&&VP.a.duration>0?VP.a.duration:voiceSecs(it)||1;
 try{VP.a.currentTime=p*d}catch(e){}
}
function voiceSpeed(id){
 VP.rate=VP.rate===1?1.5:VP.rate===1.5?2:1;
 $$(".vs").forEach(b=>b.textContent=(VP.rate===1.5?"1.5":VP.rate)+"×");
 if(VP.a)VP.a.playbackRate=VP.rate;
}
/* التسجيل */
const REC={on:false};
async function startRec(){
 if(REC.on||!S.space)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast(t("rec_unsupported"));return}
 let stream;
 try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})}
 catch(e){toast(t("mic_denied"));return}
 voiceStop();
 const mime=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"].find(m=>MediaRecorder.isTypeSupported(m))||"";
 const rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined),chunks=[];
 rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
 Object.assign(REC,{on:true,rec,stream,chunks,mime:rec.mimeType||mime||"audio/webm",t0:Date.now(),bars:[],send:false});
 let ac=null,an=null;
 try{ac=new (window.AudioContext||window.webkitAudioContext)();const src=ac.createMediaStreamSource(stream);an=ac.createAnalyser();an.fftSize=256;src.connect(an)}catch(e){}
 REC.ac=ac;
 const bar=$("#recbar");bar.classList.remove("hide");$(".comp").classList.add("recording");
 const cv=$("#recwave"),cx=cv.getContext("2d"),buf=an?new Uint8Array(an.frequencyBinCount):null;
 const fit=()=>{const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d)};fit();
 let last=0;
 const draw=ts=>{
  if(!REC.on)return;
  if(ts-last>55){last=ts;let lv=.08;if(an){an.getByteTimeDomainData(buf);let m=0;for(let i=0;i<buf.length;i++)m=Math.max(m,Math.abs(buf[i]-128));lv=Math.min(1,m/90)}
   REC.bars.push(Math.max(.08,lv))}
  const w=cv.width,h=cv.height,bw=3*(devicePixelRatio||1),gap=3*(devicePixelRatio||1),n=Math.floor(w/(bw+gap));
  cx.clearRect(0,0,w,h);cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--ac").trim()||"#FF8A3D";
  const bs=REC.bars.slice(-n);
  bs.forEach((v,i)=>{const x=w-(bs.length-i)*(bw+gap),bh=Math.max(4,v*h);cx.beginPath();cx.roundRect?cx.roundRect(x,(h-bh)/2,bw,bh,bw/2):cx.rect(x,(h-bh)/2,bw,bh);cx.fill()});
  REC.raf=requestAnimationFrame(draw);
 };
 REC.raf=requestAnimationFrame(draw);
 const tick=()=>{const s=(Date.now()-REC.t0)/1000;const el=$("#rect");if(el)el.textContent=fmtT(s);if(s>=300)stopRec(true)};
 tick();REC.iv=setInterval(tick,250);
 rec.onstop=()=>finishRec();
 rec.start(250);
 if(navigator.vibrate)try{navigator.vibrate(18)}catch(e){}
}
function stopRec(send){
 if(!REC.on)return;
 REC.send=!!send;REC.on=false;
 clearInterval(REC.iv);cancelAnimationFrame(REC.raf);
 try{REC.rec.state!=="inactive"&&REC.rec.stop()}catch(e){finishRec()}
}
async function finishRec(){
 const secs=Math.max(1,Math.round((Date.now()-REC.t0)/1000));
 try{REC.stream.getTracks().forEach(x=>x.stop())}catch(e){}
 try{REC.ac&&REC.ac.close()}catch(e){}
 const bar=$("#recbar");if(bar)bar.classList.add("hide");const c=$(".comp");if(c)c.classList.remove("recording");
 if(!REC.send)return;
 if(secs<1||!REC.chunks.length)return;
 const type=(REC.mime||"audio/webm").split(";")[0];
 const ext=/mp4/.test(type)?"m4a":/ogg/.test(type)?"ogg":"webm";
 const d=new Date(),nm=`voice-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${secs}s.${ext}`;
 const f=new File([new Blob(REC.chunks,{type})],nm,{type});
 await sendFiles([f]);
}

/* ---------- الإشعارات (محلي + Web Push) ---------- */
const nSupported=()=>"Notification" in window;
const nPerm=()=>nSupported()?Notification.permission:"denied";
const nOn=()=>ls.get("notif",false)&&nPerm()==="granted";
function b64u(s){const p="=".repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,"+").replace(/_/g,"/"),r=atob(b),o=new Uint8Array(r.length);for(let i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o}
function ab2b64u(buf){let s="";new Uint8Array(buf).forEach(c=>s+=String.fromCharCode(c));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
async function swReg(){if(!("serviceWorker" in navigator))return null;try{return await Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(()=>r(null),1500))])}catch(e){return null}}
async function pushSubscribe(){
 try{
  if(!CFG.vapid||!("PushManager" in window))return false;
  const reg=await swReg();if(!reg)return false;
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(CFG.vapid)});
  const j=sub.toJSON();
  await call("save_push",{p_endpoint:j.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth,p_preview:ls.get("npreview",true)});
  ls.set("pushok",true);return true;
 }catch(e){ls.set("pushok",false);return false}
}
async function pushUnsubscribe(){
 try{const reg=await swReg();const sub=reg&&await reg.pushManager.getSubscription();if(sub)await sub.unsubscribe();await call("remove_push")}catch(e){}
 ls.set("pushok",false);
}
async function enableNotif(){
 if(!nSupported()){toast(t("n_unsupported"));return false}
 let p=Notification.permission;
 if(p==="default")p=await Notification.requestPermission();
 if(p!=="granted"){ls.set("notif",false);toast(t("n_blocked"));return false}
 ls.set("notif",true);
 const ok=await pushSubscribe();
 toast(ok?t("n_on_push"):t("n_on_local"));
 return true;
}
async function disableNotif(){ls.set("notif",false);await pushUnsubscribe()}
async function showLocal(title,body,tag){
 try{
  const reg=await swReg();
  const opts={body,tag:tag||"sb",icon:"icon-192.png",badge:"icon-192.png",renotify:true,dir:"auto"};
  if(reg&&reg.showNotification)await reg.showNotification(title,opts);else new Notification(title,opts);
 }catch(e){}
}
function notifBody(it){
 if(!ls.get("npreview",true))return t("n_new");
 if(it.kind==="text")return String(it.body||"").slice(0,140);
 if(it.kind==="link")return "🔗 "+String(it.body||"").slice(0,120);
 if(it.kind==="image")return "📷 "+t("tab_images");
 if(it.kind==="video")return "🎬 "+t("tab_videos");
 if(it.kind==="audio")return isVoice(it)?"🎤 "+t("n_voice"):"🎵 "+(it.file_name||"");
 return "📎 "+(it.file_name||"");
}
function notifyIncoming(it){
 if(!nOn())return;
 const active=!document.hidden&&document.hasFocus();
 if(active&&!ls.get("nfocus",false))return;
 showLocal(it.device||"SaveBox",notifBody(it),"sb-"+(S.space&&S.space.id));
}
/* ---------- قفل التطبيق بـ PIN ---------- */
async function pinHash(p){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("sb|"+p));return ab2b64u(d)}
const hasPin=()=>!!ls.get("pin",null);
function pinPad(title,sub,onDone,opts){
 opts=opts||{};
 const o=document.createElement("div");o.className="pinov"+(opts.full?" full":"");
 o.innerHTML=`<div class="pin" role="dialog" aria-modal="true"><div class="pinlogo">${LOGO}</div><h2>${esc(title)}</h2><p>${esc(sub||"")}</p><div class="pdots"><i></i><i></i><i></i><i></i></div>
  <div class="pkeys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}">${n}</button>`).join("")}<button class="pk2" data-k="x" aria-label="${esc(t("cancel"))}">${opts.full?"":ic("x")}</button><button data-k="0">0</button><button class="pk2" data-k="b" aria-label="⌫">${ic("back")}</button></div></div>`;
 let v="";
 const dots=()=>$$(".pdots i",o).forEach((d,i)=>d.classList.toggle("on",i<v.length));
 const press=async k=>{
  if(k==="x"){if(!opts.full){o.remove();onDone(null)}return}
  if(k==="b")v=v.slice(0,-1);else if(v.length<4)v+=k;
  dots();
  if(v.length===4){
   const r=await onDone(v,o);
   if(r===false){const p=$(".pin",o);p.classList.remove("shake");void p.offsetWidth;p.classList.add("shake");if(navigator.vibrate)try{navigator.vibrate(60)}catch(e){}setTimeout(()=>{v="";dots()},380)}
   else{o.classList.add("ok");setTimeout(()=>o.remove(),380)}
  }
 };
 o.addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(b)press(b.dataset.k)});
 o._key=e=>{if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==="Backspace")press("b");else if(e.key==="Escape")press("x")};
 document.body.appendChild(o);
 const kh=e=>{if(!o.isConnected){document.removeEventListener("keydown",kh);return}o._key(e)};document.addEventListener("keydown",kh);
 return o;
}
function lockNow(){
 if(!hasPin()||$(".pinov.full"))return Promise.resolve();
 return new Promise(res=>{
  pinPad(t("lock_title"),t("lock_sub"),async v=>{if((await pinHash(v))===ls.get("pin")){S.unlockedAt=Date.now();res();return true}return false},{full:true});
 });
}
async function setPin(){
 const a=await new Promise(r=>pinPad(t("pin_new"),t("pin_new_s"),v=>{r(v);return true}));
 if(!a)return false;
 const b=await new Promise(r=>pinPad(t("pin_again"),t("pin_again_s"),v=>{if(v===null){r(null);return true}if(v===a){r(v);return true}return false}));
 if(!b)return false;
 ls.set("pin",await pinHash(a));S.unlockedAt=Date.now();toast(t("pin_set"));return true;
}
async function clearPin(){
 const ok=await new Promise(r=>pinPad(t("pin_enter"),t("pin_enter_s"),async v=>{if(v===null){r(false);return true}if((await pinHash(v))===ls.get("pin")){r(true);return true}return false}));
 if(ok){ls.set("pin",null);toast(t("pin_off"))}
 return ok;
}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden){S.hiddenAt=Date.now();return}
 const mins=ls.get("autolock",1);
 if(hasPin()&&S.space&&S.hiddenAt&&(Date.now()-S.hiddenAt)>=mins*60000)lockNow();
});

/* ---------- شاشة الترحيب المتحركة ---------- */
const SCN=[
`<svg viewBox="0 0 320 240" class="scn s1" aria-hidden="true"><defs><linearGradient id="tg1" x1="0" x2="1"><stop offset="0" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FFC24B"/></linearGradient></defs>
 <path d="M80 142C118 36 192 36 228 130" fill="none" stroke="#3A5290" stroke-width="2" stroke-dasharray="3 8" class="flow"/>
 <g class="dv"><rect x="18" y="96" width="62" height="112" rx="13" fill="#121A2B" stroke="#EAF0FF" stroke-width="3"/><rect x="29" y="116" width="40" height="9" rx="4.5" fill="#243255"/><rect x="29" y="131" width="28" height="9" rx="4.5" fill="url(#tg1)"/><rect x="29" y="146" width="36" height="9" rx="4.5" fill="#243255"/><circle cx="49" cy="194" r="3" fill="#3A5290"/></g>
 <g class="dv d2"><rect x="228" y="104" width="84" height="56" rx="6" fill="#121A2B" stroke="#EAF0FF" stroke-width="3"/><path d="M216 176h108l-9-16h-90z" fill="#1A2540" stroke="#EAF0FF" stroke-width="3" stroke-linejoin="round"/><rect x="238" y="116" width="44" height="8" rx="4" fill="#243255"/><rect x="238" y="130" width="30" height="8" rx="4" fill="url(#tg1)"/><rect x="238" y="144" width="38" height="8" rx="4" fill="#243255"/></g>
 <circle class="hit" cx="228" cy="130" r="8" fill="none" stroke="#FF8A3D" stroke-width="2"/>
 <g transform="translate(144 20)"><g class="core1" fill="none" stroke-linejoin="round" stroke-linecap="round"><rect width="64" height="64" rx="16" fill="#121A2B" stroke="#243255" stroke-width="1.5"/><g stroke="#EAF0FF" stroke-width="3"><path d="M14 26l18-9 18 9v20l-18 9-18-9z"/><path d="M14 26l18 9 18-9M32 35v20"/></g><circle cx="32" cy="35" r="4.6" fill="#FF8A3D"/></g></g>
 ${[0,.9,1.8].map((d,i)=>`<g><rect x="-9" y="-5.5" width="18" height="11" rx="5" fill="${i===1?"#4DF0B2":"url(#tg1)"}"><animateMotion dur="2.7s" begin="${d}s" repeatCount="indefinite" path="M80 142C118 36 192 36 228 130" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .6 1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="2.7s" begin="${d}s" repeatCount="indefinite"/></rect></g>`).join("")}
</svg>`,
(()=>{const P="1011010011101100101101011001101010011010110010110011101001101011010011011100101011100101101001110100101";
 let cells="";for(let r=0;r<11;r++)for(let c=0;c<11;c++){const fin=(r<3&&c<3)||(r<3&&c>7)||(r>7&&c<3);const mid=(r==1&&(c==1||c==9))||(r==9&&c==1);
  const on=fin?!mid:P[(r*11+c)%P.length]==="1";
  if(on)cells+=`<rect x="${86+c*13.4}" y="${42+r*13.4}" width="11.6" height="11.6" rx="2.4" style="--i:${r+c}" class="q"/>`}
 return `<svg viewBox="0 0 320 240" class="scn s2" aria-hidden="true"><rect x="74" y="30" width="172" height="172" rx="20" fill="#0E1626" stroke="#243255" stroke-width="2"/>${cells}
 <g class="brk" fill="none" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round"><path d="M66 56V42a12 12 0 0112-12h14"/><path d="M228 30h14a12 12 0 0112 12v14"/><path d="M254 176v14a12 12 0 01-12 12h-14"/><path d="M92 202H78a12 12 0 01-12-12v-14"/></g>
 <rect class="ln" x="80" y="40" width="160" height="4" rx="2" fill="#FF8A3D"/>
 <g class="ok"><circle cx="236" cy="190" r="26" fill="#0FA37A" stroke="#070B14" stroke-width="5"/><path d="M224 190l8 8 15-17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`})(),
`<svg viewBox="0 0 320 240" class="scn s3" aria-hidden="true">
 <g class="chips">${[[34,"#FF8A3D"],[98,"#3D7BFF"],[162,"#19D3A2"],[226,"#B879FF"]].map(([x,c],i)=>`<rect x="${x}" y="16" width="56" height="20" rx="10" fill="${c}" style="--k:${i}"/>`).join("")}</g>
 <g class="cd" style="--x:-80px;--y:-40px;--n:0"><rect x="30" y="50" width="122" height="78" rx="14" fill="#121A2B" stroke="#3D7BFF" stroke-width="2.5"/><path d="M62 90a10 10 0 010-14l8-8a10 10 0 0114 14m-6 4a10 10 0 010 14l-8 8a10 10 0 01-14-14" transform="translate(6 -4) scale(.9)" fill="none" stroke="#3D7BFF" stroke-width="3" stroke-linecap="round"/><rect x="44" y="108" width="60" height="6" rx="3" fill="#243255"/></g>
 <g class="cd" style="--x:80px;--y:-40px;--n:1"><rect x="168" y="50" width="122" height="78" rx="14" fill="#121A2B" stroke="#FF8A3D" stroke-width="2.5"/><path d="M180 116l24-30 18 22 12-14 26 22z" fill="#FF8A3D" opacity=".85"/><circle cx="260" cy="72" r="7" fill="#FFC24B"/></g>
 <g class="cd" style="--x:-80px;--y:40px;--n:2"><rect x="30" y="140" width="122" height="78" rx="14" fill="#121A2B" stroke="#19D3A2" stroke-width="2.5"/><path d="M76 162h30l14 14v32H76z" fill="none" stroke="#19D3A2" stroke-width="3" stroke-linejoin="round"/><path d="M106 162v14h14" fill="none" stroke="#19D3A2" stroke-width="3" stroke-linejoin="round"/><rect x="44" y="204" width="50" height="6" rx="3" fill="#243255"/></g>
 <g class="cd" style="--x:80px;--y:40px;--n:3"><rect x="168" y="140" width="122" height="78" rx="14" fill="#121A2B" stroke="#B879FF" stroke-width="2.5"/><rect x="184" y="158" width="90" height="7" rx="3.5" fill="#B879FF"/><rect x="184" y="174" width="70" height="7" rx="3.5" fill="#243255"/><rect x="184" y="190" width="80" height="7" rx="3.5" fill="#243255"/></g></svg>`,
`<svg viewBox="0 0 320 240" class="scn s4" aria-hidden="true"><defs><linearGradient id="tg4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D2B4F"/><stop offset="1" stop-color="#0E1626"/></linearGradient></defs>
 <circle class="rg" cx="160" cy="120" r="50" fill="none" stroke="#FF8A3D" stroke-width="2"/><circle class="rg r2" cx="160" cy="120" r="50" fill="none" stroke="#FF8A3D" stroke-width="2"/><circle class="rg r3" cx="160" cy="120" r="50" fill="none" stroke="#FF8A3D" stroke-width="2"/>
 <g class="orb"><circle cx="160" cy="28" r="6" fill="#3D7BFF"/><circle cx="262" cy="150" r="5" fill="#19D3A2"/><circle cx="70" cy="170" r="5.5" fill="#B879FF"/></g>
 <path class="sh" d="M160 46l56 20v56c0 40-26 68-56 80-30-12-56-40-56-80V66z" fill="url(#tg4)" stroke="#EAF0FF" stroke-width="3.4" stroke-linejoin="round"/>
 <rect class="lk" x="140" y="108" width="40" height="32" rx="7" fill="#FF8A3D"/><path class="lk" d="M148 108v-9a12 12 0 0124 0v9" fill="none" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round"/><circle class="lk" cx="160" cy="124" r="4" fill="#1a1206"/></svg>`
];
function tour(i0){
 leaveApp();stopScan();stopLink();
 const n=SCN.length;let i=i0||0;S.tourI=i;
 const parts=Array.from({length:16},(_,k)=>`<u style="--x:${(k*37+11)%100}%;--d:${6+(k*5)%9}s;--z:${3+(k%4)}px;--w:${-(k*1.3)}s"></u>`).join("");
 const slides=Array.from({length:n},(_,k)=>{
  const h=t("t"+(k+1)+"h").split(" ").map((w,j)=>`<span style="--w:${j}">${esc(w)}</span>`).join(" ");
  return `<section class="sl" data-i="${k}" aria-roledescription="slide" aria-label="${k+1}/${n}"><div class="art">${SCN[k]}</div><h1 class="hw">${h}</h1><p class="sub">${esc(t("t"+(k+1)+"s"))}</p></section>`}).join("");
 $("#root").innerHTML=`<div class="tour" dir="${LANG==="ar"?"rtl":"ltr"}"><div class="bg"><i></i><i></i><i></i>${parts}</div>
  <div class="tt-top"><button class="lgb" data-act="tlang" aria-label="Language">${LANG==="ar"?"EN":"عربي"}</button><button class="skp" data-act="tskip">${esc(t("skip"))}</button></div>
  <div class="stage">${slides}</div>
  <div class="tt-bot"><div class="dots" role="tablist">${Array.from({length:n},(_,k)=>`<button data-act="tdot" data-i="${k}" aria-label="${k+1}"></button>`).join("")}</div><button class="tn" data-act="tnext"></button></div></div>`;
 const root=$(".tour");
 const show=(k,dir)=>{
  i=Math.max(0,Math.min(n-1,k));S.tourI=i;
  $$(".sl",root).forEach(s=>{const j=+s.dataset.i;s.classList.toggle("on",j===i);s.classList.toggle("before",j<i);s.classList.toggle("after",j>i)});
  $$(".dots button",root).forEach((b,j)=>b.classList.toggle("on",j===i));
  const b=$(".tn",root);b.textContent=i===n-1?t("go"):t("next");b.classList.toggle("last",i===n-1);
  $(".skp",root).classList.toggle("hide",i===n-1);
 };
 S.tourShow=show;show(i);
 let sx=null;
 root.addEventListener("pointerdown",e=>{sx=e.clientX});
 root.addEventListener("pointerup",e=>{if(sx==null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50){const fwd=LANG==="ar"?dx>0:dx<0;show(i+(fwd?1:-1))}});
 S.tourKey=e=>{if(!$(".tour"))return;if(e.key==="ArrowRight")show(i+(LANG==="ar"?-1:1));else if(e.key==="ArrowLeft")show(i+(LANG==="ar"?1:-1));else if(e.key==="Enter"&&e.target.tagName!=="BUTTON")tourNext()};
}
function tourNext(){const i=S.tourI||0;if(i>=SCN.length-1)tourDone();else S.tourShow(i+1)}
function tourDone(){ls.set("tour",true);S.tourShow=null;welcome()}
document.addEventListener("keydown",e=>{if(S.tourKey)S.tourKey(e)});

/* ---------- الإجراءات ---------- */
function closeViewer(){const v=$(".viewer");if(v)v.remove()}
function installBtn(){}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();S.inst=e});
function viewList(){return S.items.filter(i=>i.kind==="image"&&i.file_path&&S.urls[i.file_path]&&!i.pending)}
function openViewer(id){
 const list=viewList(),k=list.findIndex(x=>x.id===id);if(k<0)return;
 closeViewer();S.vid=id;
 const it=list[k],u=S.urls[it.file_path].u;
 const v=document.createElement("div");v.className="viewer";
 v.innerHTML=`<div class="vb"><button class="ib" data-act="closeviewer" aria-label="${esc(t("cancel"))}">${ic("x")}</button><span class="vc">${k+1} / ${list.length}</span><span style="display:flex;gap:6px"><button class="ib" data-act="dl" data-id="${id}" aria-label="${esc(t("download"))}">${ic("dl")}</button><button class="ib" data-act="vdel" data-id="${id}" aria-label="${esc(t("del"))}">${ic("trash")}</button></span></div>
  <img src="${esc(u)}" alt="${esc(it.file_name||"")}">
  ${k>0?`<button class="vn vl" data-act="vnav" data-d="-1" aria-label="${esc(t("view_prev"))}">${ic("chev")}</button>`:""}${k<list.length-1?`<button class="vn vr" data-act="vnav" data-d="1" aria-label="${esc(t("view_next"))}">${ic("chev")}</button>`:""}`;
 v.addEventListener("click",e=>{if(e.target===v||e.target.tagName==="IMG")closeViewer()});
 document.body.appendChild(v);
}
function vnav(d){const list=viewList(),k=list.findIndex(x=>x.id===S.vid);const n=list[k+d];if(n)openViewer(n.id)}
async function doDelete(id){
 const it=S.items.find(x=>x.id===id);if(!it)return false;
 const {error}=await sb.from("items").delete().eq("id",id);if(error){toast(errMsg(error));return false}
 if(it.file_path)await sb.storage.from("savebox").remove([it.file_path]);
 removeItem(id);return true;
}
function relang(){
 if($(".tour")){tour(S.tourI);return}
 if(S.space){const pg=S.setPage;enterApp(S.space).then(()=>openSettings(pg&&pg!=="home"?pg:"look"))}else welcome();
}
const flip=(k,d)=>{const v=!ls.get(k,d);ls.set(k,v);return v};
const A={
 spage(b){setRender(b.dataset.v,"fwd")},sback(){setRender("home","bwd")},
 qtheme(b){const o=["auto","light","dark"],n=o[(o.indexOf(ls.get("theme","auto"))+1)%3];ls.set("theme",n);applyTheme();setRender("home","nofx")},
 async qnotif(){if(nOn())await disableNotif();else await enableNotif();setRender("home","nofx")},
 qsound(){const v=flip("sound",false);if(v)beep();setRender("home","nofx")},
 async qlock(){if(hasPin())await clearPin();else await setPin();setRender("home","nofx")},
 async nmaster(b){if(nOn())await disableNotif();else await enableNotif();setRender("notif","nofx")},
 async npreview(b){const v=flip("npreview",true);b.setAttribute("aria-checked",v);if(ls.get("pushok",false))pushSubscribe()},
 nfocus(b){b.setAttribute("aria-checked",flip("nfocus",false))},
 ntest(){if(nPerm()!=="granted"){enableNotif().then(ok=>ok&&showLocal("SaveBox",t("n_test_b"),"sb-test"));return}showLocal("SaveBox",t("n_test_b"),"sb-test")},
 async pin(){if(hasPin())await clearPin();else await setPin();setRender("privacy","nofx")},
 alock(b){ls.set("autolock",+b.dataset.v);$$("[data-act=alock]").forEach(x=>x.setAttribute("aria-pressed",x===b))},
 vplay(b){voicePlay(b.dataset.id)},vspeed(b){voiceSpeed(b.dataset.id)},
 mic(){startRec()},recsend(){stopRec(true)},reccancel(){stopRec(false)},
 new(){formNew()},home(){welcome()},linkv(){formLink("show")},mk(b){mkSpace(b)},qr(b){showQR(b)},cancellink(){cancelLink()},
 lmode2(b){formLink(b.dataset.v)},joingo(){const v=($("#mc").value||"").replace(/\s/g,"").toUpperCase();if(v.length===8)joinWith(v);else $("#m").textContent=t("e_invalid")},
 lang(b){LANG=b.dataset.v;ls.set("lang",LANG);applyLang();relang()},
 tlang(){LANG=LANG==="ar"?"en":"ar";ls.set("lang",LANG);applyLang();tour(S.tourI)},
 tskip(){tourDone()},tnext(){tourNext()},tdot(b){S.tourShow&&S.tourShow(+b.dataset.i)},
 replay(){closeOv();tour(0)},
 theme(b){ls.set("theme",b.dataset.v);applyTheme();$$("[data-act=theme]").forEach(x=>x.setAttribute("aria-pressed",x===b))},
 font(b){ls.set("font",b.dataset.v);applyPrefs();$$("[data-act=font]").forEach(x=>x.setAttribute("aria-pressed",x===b))},
 cmp(b){b.setAttribute("aria-checked",flip("compress",true))},
 showdev(b){b.setAttribute("aria-checked",flip("showdev",true));applyPrefs()},
 enter(b){b.setAttribute("aria-checked",flip("enter",true))},
 sound(b){const v=flip("sound",false);b.setAttribute("aria-checked",v);if(v)beep()},
 settings(){openSettings()},scan(){openLink("scan")},linkshow(){openLink("show")},lmode(b){openLink(b.dataset.v)},
 closeov(){closeOv()},
 mcgo(){const v=($("#mc").value||"").replace(/\s/g,"").toUpperCase();if(v.length===8)approve(v);else showSm(t("e_invalid"))},
 pick(){$("#fi").click()},send(){sendText()},bottom(){const f=$("#feed");f.scrollTop=f.scrollHeight;$("#newpill").classList.add("hide")},
 older(){loadItems(false,true)},
 tab(b){setFilter(b.dataset.v)},search(){toggleSearch()},
 view(b){openViewer(b.dataset.id)},closeviewer(){closeViewer()},vnav(b){vnav(+b.dataset.d)},
 async vdel(b){if(!(await ask(t("c_del_one"),true)))return;const list=viewList(),k=list.findIndex(x=>x.id===b.dataset.id);const ok=await doDelete(b.dataset.id);if(!ok)return;const n=viewList();closeViewer();if(n.length)openViewer(n[Math.min(k,n.length-1)].id)},
 async copy(b){const it=S.items.find(x=>x.id===b.dataset.id);if(!it)return;try{await navigator.clipboard.writeText(it.body);toast(t("copied"))}catch(e){const ta=document.createElement("textarea");ta.value=it.body;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(t("copied"))}catch(x){}ta.remove()}},
 async dl(b){const it=S.items.find(x=>x.id===b.dataset.id);if(!it||!it.file_path)return;
  const {data,error}=await sb.storage.from("savebox").createSignedUrl(it.file_path,120,{download:it.file_name||true});
  if(error||!data){toast(errMsg(error));return}const a=document.createElement("a");a.href=data.signedUrl;a.download=it.file_name||"";document.body.appendChild(a);a.click();a.remove()},
 async del(b){
  if(!b.classList.contains("sure")){$$(".acts .sure").forEach(x=>{x.classList.remove("sure");x.innerHTML=ic("trash")});b.classList.add("sure");b.textContent=t("sure");clearTimeout(S.timers.sure);S.timers.sure=setTimeout(()=>{if(b.isConnected){b.classList.remove("sure");b.innerHTML=ic("trash")}},3000);return}
  await doDelete(b.dataset.id);
 },
 async svspace(){const v=$("#spn").value.trim();if(!v)return;try{await call("rename_space",{p_name:v});S.space.name=v;$("#sn").textContent=v;toast(t("saved"))}catch(e){toast(errMsg(e))}},
 async svdev(){const v=$("#dvn").value.trim();if(!v)return;try{await call("rename_device",{p_name:v});S.space.device=v;toast(t("saved"))}catch(e){toast(errMsg(e))}},
 async rmdev(b){if(!(await ask(t("c_remove",b.dataset.n),true)))return;try{await call("remove_device",{p_user:b.dataset.id});await openSettings("devices")}catch(e){toast(errMsg(e))}},
 async rmothers(){if(!(await ask(t("c_others"),true)))return;try{await call("remove_other_devices");await openSettings("devices")}catch(e){toast(errMsg(e))}},
 async leave(){if(!(await ask(t("c_leave"),true)))return;try{await call("leave_space")}catch(e){toast(errMsg(e));return}await resetIdentity();welcome()},
 async wipe(){if(!(await ask(t("c_wipe"),true)))return;
  try{
   const paths=[];let from=0;for(;;){const {data}=await sb.from("items").select("file_path").eq("space_id",S.space.id).not("file_path","is",null).range(from,from+999);if(!data||!data.length)break;data.forEach(r=>paths.push(r.file_path));if(data.length<1000)break;from+=1000}
   for(let i=0;i<paths.length;i+=100)await sb.storage.from("savebox").remove(paths.slice(i,i+100));
   await call("delete_space");
  }catch(e){toast(errMsg(e));return}
  await resetIdentity();welcome()},
 export(){exportText()},upd(){updateApp()},
 async install(){if(!S.inst)return;S.inst.prompt();try{await S.inst.userChoice}catch(e){}S.inst=null;closeOv()}
};
async function resetIdentity(){closeOv();leaveApp();try{await sb.auth.signOut()}catch(e){}const r=await sb.auth.signInAnonymously();if(r.data&&r.data.session)S.uid=r.data.session.user.id}
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(!b)return;if(b.dataset.act==="vseek"){voiceSeek(b.dataset.id,e);return}const f=A[b.dataset.act];if(f){e.preventDefault();f(b)}});
document.addEventListener("keydown",e=>{
 if(e.key==="Enter"&&e.target.id==="mc"){e.preventDefault();if($("#lkbox"))A.mcgo();else A.joingo()}
 if(REC.on){if(e.key==="Escape")stopRec(false);else if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();stopRec(true)}}
 if($(".viewer")){if(e.key==="ArrowLeft")vnav(-1);else if(e.key==="ArrowRight")vnav(1)}
});
document.addEventListener("input",e=>{if(e.target.id==="sq"){clearTimeout(S.timers.q);S.timers.q=setTimeout(()=>{S.q=e.target.value.trim();S.more=true;renderFeed();loadItems(true)},300)}});

/* PWA */
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
boot();
