/* Nyxen - the website's script. Everything is decoration over a page that
   reads fine without it: the tour, the weather and the themes start on their
   own, and stop when nobody is looking (hidden tab, scrolled away). */
(function(){
"use strict";
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
var $ = function(s, el){ return (el || document).querySelector(s); };
var $$ = function(s, el){ return [].slice.call((el || document).querySelectorAll(s)); };
var SHOT = function(n){ return "assets/shots/" + n + ".webp"; };
var loops = [];          // things that run every frame (one requestAnimationFrame for all)

/* Checkout links for Nyxen Eclipse. Empty until there is a payment account. */
var ECLIPSE_CHECKOUT = {monthly: "", quarterly: "", halfyear: "", annual: "", trial: ""};
$$("[data-checkout]").forEach(function(a){
  var url = ECLIPSE_CHECKOUT[a.dataset.checkout];
  if(url){ a.href = url; a.target = "_blank"; a.rel = "noopener"; }
});

/* ---- icons (24px line icons) ------------------------------------------- */
var I = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  pkg:'<path d="m21 8-9-5-9 5v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  blocks:'<rect x="3" y="12" width="8.5" height="8.5" rx="1.2"/><rect x="12.5" y="12" width="8.5" height="8.5" rx="1.2"/><rect x="7.7" y="3" width="8.5" height="8.5" rx="1.2"/>',
  pad:'<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-4 3.4l-.9 6.3a2.5 2.5 0 0 0 4.5 1.8L7.7 15h8.6l1.4 1.5a2.5 2.5 0 0 0 4.5-1.8l-.9-6.3a4 4 0 0 0-4-3.4Z"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  msg:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
  orbit:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/>',
  palette:'<circle cx="13.5" cy="6.5" r="1.3"/><circle cx="17.5" cy="10.5" r="1.3"/><circle cx="8.5" cy="7.5" r="1.3"/><circle cx="6.5" cy="12.5" r="1.3"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.7 5.7 0 0 0 22 9.7C22 5.4 17.5 2 12 2Z"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  camera:'<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="4"/>',
  cross:'<circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  refresh:'<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  invite:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  brick:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.3h18M3 14.7h18M9 4v5.3M15 9.3v5.4M9 14.7V20"/>',
  drive:'<rect x="2" y="13" width="20" height="8" rx="2"/><path d="M5 13 7.5 4h9L19 13M6 17h.01M10 17h.01"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
  alert:'<path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v4M12 18h.01"/>',
  flask:'<path d="M9 3h6M10 3v6L4 20a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 20l-6-11V3"/><path d="M7 15h10"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  win:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5c0-1-1-1.5-2.5-1.5s-2.5.7-2.5 1.7c0 2.6 5 1.4 5 4 0 1.1-1 1.8-2.5 1.8s-2.5-.6-2.5-1.5"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M9 9h12"/>',
  tray:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3.5-7Z"/>'
};
function icon(n, size){
  return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || "") + "</svg>";
}
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

/* ---- the belt of what it works with ------------------------------------- */
var NAMES = ["Steam","Steam Workshop","Thunderstore","Modrinth","GameBanana","Nexus Mods","CurseForge","Prism Launcher","MultiMC",
  "ATLauncher","GDLauncher","XMCL","Fabric","NeoForge","Quilt","Iris","RetroArch","RetroAchievements","libretro","Spotify","Apple Music","Tenor","GIPHY"];
var belt = $("#belt");
if(belt){
  var html = NAMES.map(function(n){ return "<span>" + esc(n) + "</span>"; }).join("");
  belt.innerHTML = html + html;          // two copies: translateX(-50%) loops seamlessly
}

/* ---- the tour ----------------------------------------------------------- */
var TOUR = [
  {t:"Home", i:"home", img:"home", h:"Everything at a glance",
   p:"The game you're in, this session, achievements, performance and quick tools — plus Tonight's pick, who's online and the song that's playing. Drag a card to rearrange it.",
   tags:["Tonight's pick","This session","Quick tools","Your week"]},
  {t:"Library", i:"grid", img:"library", h:"Your whole library",
   p:"Every game Steam has installed, with its art and your real play time. Click one and Steam starts it. Almost done and Never played show what's worth picking up.",
   tags:["Steam play times","Almost done","Never played","Invite to play"]},
  {t:"What to play", i:"dice", img:"pick", h:"What should I play?",
   p:"One click and Nyxen picks from your installed games — leaning towards the ones you nearly finished or haven't touched in a while. Play it, roll another, or invite friends.",
   tags:["One click","Another","Invite friends"]},
  {t:"Achievements", i:"trophy", img:"achievements", h:"Your collection, and what's close",
   p:"Everything you've earned across your library, sorted by how near you are to finishing. Hunt one for me picks an achievement in the game you're playing and finds guide videos for it.",
   tags:["Rarest","Nearly there","Hunt one for me","Per game"]},
  {t:"Mods", i:"pkg", img:"mods", h:"Mods for any installed game",
   p:"Thunderstore, GameBanana, Nexus Mods and the Steam Workshop, searched together. Tick several and install them in one go, turn one off without deleting it, and share your list with friends.",
   tags:["One search box","Install several","Turn off","Share a list"]},
  {t:"Minecraft", i:"blocks", img:"minecraft", h:"Whatever launcher you already use",
   p:"Your instances from eight launchers, wherever they already are. Mods, shaders, resource packs and data packs — checked against your loader before they download.",
   tags:["8 launchers","Shaders","Live map in 3D","Servers"]},
  {t:"Retro", i:"pad", img:"retro", h:"RetroArch and its achievements",
   p:"Finds RetroArch by itself and identifies your ROMs by hash against 141 systems. Cheats, box art, and your RetroAchievements progress using the login RetroArch already stores.",
   tags:["141 systems","Box art","Cheats","RetroAchievements"]},
  {t:"Social", i:"users", img:"socialhome", h:"A home for your friends",
   p:"Your game and your song at the top, the feed below, live rooms to jump into and people you may know. Message or call anyone in one click.",
   tags:["Feed","Live rooms","Now playing","Spotify & Apple Music"]},
  {t:"Messages", i:"msg", img:"messages", h:"Chats that do more",
   p:"Replies, reactions, edits, typing and seen. Send GIFs, and invites that start the game — one click on Play and Steam starts it, or offers to install it.",
   tags:["GIFs","Game invites","Calls","Screen share"]},
  {t:"Friends", i:"invite", img:"friends", h:"Who's in a game, who's online",
   p:"What every friend is playing and listening to, with Play too to join them. Leaderboards for achievements, rare unlocks, 100% games and day streaks.",
   tags:["Play too","Leaderboards","Requests","Invite link"]},
  {t:"Rooms", i:"mic", img:"rooms", h:"Rooms for your group",
   p:"Voice and screen sharing, chat, music anyone can DJ, game nights and modpacks — together in one place.",
   tags:["Voice","Music together","Game nights","Modpacks"]},
  {t:"Space", i:"orbit", img:"space", h:"Hang out in 3D",
   p:"Walk around with your friends as chrome figures, talk with voice that fades with distance, sit on the couch and watch a shared screen, play Coin rush and Tag, and build together.",
   tags:["Voice","Games","Weather","Build"]},
  {t:"Themes", i:"palette", img:"themestab", h:"A tab just for themes",
   p:"Every theme as a big live preview — hover one and the whole app wears it. Star your favourites and let Nyxen switch by itself: light by day, dark at night.",
   tags:["63 themes","23 animated","Favourites","Schedule"]},
  {t:"Tray", i:"tray", img:"tray", fit:"contain", h:"Nyxen in the tray",
   p:"Close the window and Nyxen waits by the clock, like Discord — messages and calls still reach you. Right-click for the song playing, your status, a screenshot, the Space and Quit.",
   tags:["Media controls","Status","Start with Windows","Quit"]}
];
var tour = $(".tour");
if(tour){
  var tabs = $(".tour-tabs", tour), imgs = $(".tour-images", tour), at = -1, tImgs = [], tStart = 0, paused = false, tourSeen = false;
  var DUR = 6500;
  TOUR.forEach(function(s, n){
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", "false");
    b.innerHTML = icon(s.i, 17) + "<span>" + esc(s.t) + "</span>";
    b.addEventListener("click", function(){ show(n, true); });
    tabs.appendChild(b);
    var im = document.createElement("img");
    im.alt = s.h; im.decoding = "async";
    im.dataset.src = SHOT(s.img);
    if(s.fit) im.style.objectFit = s.fit;
    imgs.appendChild(im); tImgs.push(im);
  });
  var tabBtns = $$("button", tabs);
  function load(n){ var im = tImgs[(n + TOUR.length) % TOUR.length]; if(!im.src) im.src = im.dataset.src; }
  function show(n, user){
    n = (n + TOUR.length) % TOUR.length;
    if(n === at) return;
    at = n; load(n); load(n + 1);
    tImgs.forEach(function(im, k){ im.classList.toggle("on", k === n); });
    tabBtns.forEach(function(b, k){ b.setAttribute("aria-selected", String(k === n)); b.style.setProperty("--k", 0); });
    var s = TOUR[n];
    $("[data-tour-title]").textContent = "Nyxen — " + s.t;
    var cap = $(".tour-caption .fade");
    cap.classList.remove("fade"); void cap.offsetWidth; cap.classList.add("fade");
    $("[data-tour-heading]").textContent = s.h;
    $("[data-tour-text]").textContent = s.p;
    $("[data-tour-tags]").innerHTML = s.tags.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("");
    if(user){ var b = tabBtns[n]; b.scrollIntoView({block:"nearest", inline:"center", behavior: reduce ? "auto" : "smooth"}); }
    tStart = performance.now();
  }
  show(0);
  $(".tour-window").addEventListener("click", function(){ openLb(SHOT(TOUR[at].img)); });
  tour.addEventListener("pointerenter", function(e){ if(e.pointerType === "mouse") paused = true; });
  tour.addEventListener("pointerleave", function(){ paused = false; tStart = performance.now() - (parseFloat(tabBtns[at].style.getPropertyValue("--k")) || 0) * DUR; });
  watch(tour, function(v){ tourSeen = v; if(v) tStart = performance.now(); });
  tabs.addEventListener("keydown", function(e){
    if(e.key === "ArrowRight"){ show(at + 1, true); tabBtns[at].focus(); }
    if(e.key === "ArrowLeft"){ show(at - 1, true); tabBtns[at].focus(); }
  });
  if(!reduce) loops.push(function(now){
    if(!tourSeen || paused) return;
    var k = (now - tStart) / DUR;
    if(k >= 1) show(at + 1); else tabBtns[at].style.setProperty("--k", k.toFixed(3));
  });
}

/* ---- the Space: weather you can feel ------------------------------------ */
var space = $("[data-space]");
if(space){
  var stage = $(".space-stage", space), cv = $("canvas", stage), cx = cv.getContext("2d");
  var weather = "clear", scene = "lobby", parts = [], spSeen = false, W = 0, H = 0;
  var spImgs = {};
  $$("img", stage).forEach(function(im){ spImgs[im.dataset.w] = im; });
  var LABEL = {clear:"clear", rain:"rain", snow:"snow", petals:"cherry petals", leaves:"autumn leaves"};
  var SCENE = {lobby:"Lobby", sunset:"Stage at sunset", night:"Campfire night"};
  function key(){ return scene === "lobby" ? weather : scene; }
  function paint(){
    var k = key(), im = spImgs[k];
    if(!im){
      im = document.createElement("img");
      im.src = SHOT("sp-" + k); im.alt = SCENE[scene] + ", " + LABEL[weather]; im.dataset.w = k;
      stage.insertBefore(im, cv); spImgs[k] = im;
    }
    var on = function(){ Object.keys(spImgs).forEach(function(n){ spImgs[n].classList.toggle("on", n === k); }); };
    if(im.complete) on(); else im.onload = on;
    $("[data-space-label]").textContent = SCENE[scene] + " · " + LABEL[weather];
    seed();
  }
  function pick(group, attr, set){
    $$("button", group).forEach(function(b){
      b.addEventListener("click", function(){
        $$("button", group).forEach(function(x){ x.setAttribute("aria-checked", String(x === b)); });
        set(b.dataset.v); paint();
      });
    });
  }
  pick($("[data-weather]", space), "v", function(v){ weather = v; });
  pick($("[data-scene]", space), "v", function(v){ scene = v; });
  stage.addEventListener("click", function(){ openLb(SHOT("sp-" + key())); });
  function size(){
    var r = stage.getBoundingClientRect(), d = Math.min(1.5, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); seed();
  }
  function seed(){
    parts = [];
    var n = {clear:0, rain:170, snow:120, petals:46, leaves:40}[weather] * Math.max(.4, W / 1100);
    for(var i = 0; i < n; i++) parts.push(spawn(true));
  }
  function spawn(any){
    var p = {x:Math.random() * W, y:any ? Math.random() * H : -20, z:.4 + Math.random() * .8, a:Math.random() * 6.28, s:Math.random() * 2 - 1};
    if(weather === "rain"){ p.vy = 11 + p.z * 9; p.vx = -2.2; }
    else if(weather === "snow"){ p.vy = .5 + p.z * .9; p.vx = 0; }
    else { p.vy = .8 + p.z * .8; p.vx = .6 + Math.random() * .8; }
    var pal = weather === "petals" ? ["#ffc4dc","#ffb0cf","#ffd6e6","#f9a8d4"] : ["#f59e0b","#ea580c","#dc2626","#ca8a04","#b45309"];
    p.c = pal[Math.floor(Math.random() * pal.length)];
    return p;
  }
  function frame(now){
    cx.clearRect(0, 0, W, H);
    if(weather === "clear") return;
    for(var i = 0; i < parts.length; i++){
      var p = parts[i];
      p.a += .02 * p.s + .01;
      if(weather === "rain"){
        p.x += p.vx; p.y += p.vy;
        // dark streaks on the white lobby, light ones at night
        cx.strokeStyle = (scene === "night" ? "rgba(210,225,255," : "rgba(84,104,150,") + (.22 + p.z * .3).toFixed(2) + ")"; cx.lineWidth = .7 + p.z * .8;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x + p.vx * 1.6, p.y + p.vy * 1.6); cx.stroke();
      } else if(weather === "snow"){
        p.x += Math.sin(p.a) * .45 * p.z; p.y += p.vy;
        cx.fillStyle = "rgba(255,255,255," + (.6 + p.z * .35).toFixed(2) + ")";
        cx.beginPath(); cx.arc(p.x, p.y, 1.2 + p.z * 2.2, 0, 6.283); cx.fill();
        if(scene !== "night"){ cx.strokeStyle = "rgba(120,130,170,.35)"; cx.lineWidth = .8; cx.stroke(); }
      } else {
        p.x += p.vx + Math.sin(p.a) * 1.1; p.y += p.vy + Math.cos(p.a * .7) * .4;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a * 1.6); cx.scale(1, Math.abs(Math.sin(p.a)) * .7 + .3);
        cx.fillStyle = p.c; cx.globalAlpha = .85;
        var r = weather === "petals" ? 3.2 + p.z * 3 : 4 + p.z * 4;
        cx.beginPath(); cx.ellipse(0, 0, r, r * .55, 0, 0, 6.283); cx.fill();
        cx.restore();
      }
      if(p.y > H + 20 || p.x > W + 30 || p.x < -30){ parts[i] = spawn(false); if(weather !== "rain") parts[i].x = Math.random() * W * 1.1 - W * .1; }
    }
  }
  addEventListener("resize", size);
  watch(stage, function(v){ spSeen = v; if(v && !W) size(); });
  if(!reduce) loops.push(function(now){ if(spSeen) frame(now); });
}

/* ---- themes -------------------------------------------------------------- */
var THEMES = [
  {n:"Charcoal", img:"home", sw:"linear-gradient(135deg,#050505 0 50%,#f5f5f5 50%)", glow:"rgba(255,255,255,.16)"},
  {n:"Synthwave", img:"t-synthwave", sw:"linear-gradient(135deg,#2b0f45,#e0338f,#ffb86b)", glow:"rgba(236,72,153,.24)"},
  {n:"Deep sea", img:"t-deepsea", sw:"linear-gradient(135deg,#032027,#0e7490,#5eead4)", glow:"rgba(20,184,166,.22)"},
  {n:"Night city", img:"t-nightcity", sw:"linear-gradient(135deg,#0b1030,#4338ca,#f472b6)", glow:"rgba(99,102,241,.22)"},
  {n:"Halloween", img:"t-halloween", sw:"linear-gradient(135deg,#1c0a02,#c2410c,#fbbf24)", glow:"rgba(234,88,12,.22)"},
  {n:"Cherry blossom", img:"t-cherry", sw:"linear-gradient(135deg,#3b0a1f,#db2777,#fbcfe8)", glow:"rgba(244,114,182,.22)"},
  {n:"Daylight", img:"t-daylight", sw:"linear-gradient(135deg,#e5e7eb,#ffffff,#c7d2fe)", glow:"rgba(226,232,255,.22)"}
];
var tz = $("[data-themes]");
if(tz){
  var chips = $(".theme-chips", tz), timgs = $("[data-theme-images]", tz), tAt = -1, tUser = false, tSeen = false, tNext = 0, tEl = [];
  THEMES.forEach(function(t, n){
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
    b.innerHTML = '<i style="background:' + t.sw + '"></i>' + esc(t.n);
    b.addEventListener("click", function(){ tUser = true; tShow(n); });
    b.addEventListener("pointerenter", function(e){ if(e.pointerType === "mouse"){ tUser = true; tShow(n); } });
    chips.appendChild(b);
    var im = document.createElement("img"); im.alt = "Nyxen with the " + t.n + " theme"; im.dataset.src = SHOT(t.img);
    timgs.appendChild(im); tEl.push(im);
  });
  var tBtns = $$("button", chips);
  function tShow(n){
    n = (n + THEMES.length) % THEMES.length;
    if(n === tAt) return; tAt = n;
    [n, n + 1].forEach(function(k){ var im = tEl[k % THEMES.length]; if(!im.src) im.src = im.dataset.src; });
    tEl.forEach(function(im, k){ im.classList.toggle("on", k === n); });
    tBtns.forEach(function(b, k){ b.setAttribute("aria-checked", String(k === n)); });
    tz.style.setProperty("--tglow", THEMES[n].glow);
    $("[data-theme-title]", tz).textContent = "Nyxen — Home · " + THEMES[n].n + (n ? "" : " (the default)");
    tNext = performance.now() + 3800;
  }
  tShow(0);
  $(".window", $(".theme-demo", tz)).addEventListener("click", function(){ openLb(SHOT(THEMES[tAt].img)); });
  watch(tz, function(v){ tSeen = v; if(v) tNext = performance.now() + 2500; });
  if(!reduce) loops.push(function(now){ if(tSeen && !tUser && now > tNext) tShow(tAt + 1); });
}

/* ---- every feature, and the honest list ---------------------------------- */
var FEATURES = [
  ["orbit","Nyxen Space","A 3D place for friends: voice that fades with distance, a couch and a TV for shared screens, DJ decks, games, weather and building.",1],
  ["image","GIF profiles for everyone","An animated profile picture and banner, free. Nyxen's own GIF pack, plus any Tenor or GIPHY link in chat.",1],
  ["dice","What should I play?","One click picks from your installed games — the nearly finished and the long forgotten first.",0],
  ["target","Hunt one for me","Picks an achievement from the game you're playing, says how rare it is and finds guide videos.",0],
  ["invite","Invites that start the game","Invite friends to any Steam game or your space — they click Play and Steam starts it.",0],
  ["pkg","Mods in one search","Thunderstore, GameBanana, Nexus Mods and the Workshop together. Turn mods off without deleting them.",0],
  ["blocks","Minecraft, any launcher","Eight launchers read where they are. Instances, shaders, packs, servers and .mrpack exports.",0],
  ["blocks","Live map in 3D","Your Minecraft save as real cubes, friends on it, waypoints as beacons — even with the game closed.",0],
  ["pad","Retro achievements","RetroArch found by itself, ROMs identified against 141 systems, RetroAchievements progress.",0],
  ["trophy","Your collection","Rarest unlocks, nearly-there games and a running completion total across your library.",0],
  ["msg","Messages","Replies, reactions, edits, typing and seen, GIFs and game invites — with calls one click away.",0],
  ["mic","Calls and rooms","Voice, screen sharing and music anyone can DJ, game nights and modpack sharing.",0],
  ["music","Your song, everywhere","What you're listening to on Spotify or Apple Music, with its cover, on your profile and in the tray.",0],
  ["palette","63 themes","23 of them animated. Hover to try, star your favourites, and let them change by day and night.",0],
  ["layout","11 layouts","Sidebar, rail, top bar, floating glass, a dock, Hub with friends beside it, Couch for the TV and more.",0],
  ["spark","The assistant","Ask about the game you're in. It keeps notes between sessions and coaches you through a run.",0],
  ["mic","A natural voice","One download and the assistant speaks like a person — ten voices, on your PC, no key to paste.",0],
  ["tray","Lives in the tray","Close the window and Nyxen stays by the clock — music controls, status, screenshot and Quit.",0],
  ["refresh","Updates itself","Checks every half hour, downloads in the background, and installs when you restart.",0],
  ["camera","Screenshots","Hotkey captures with a gallery — and Space photos land there too.",0],
  ["cross","Crosshair overlay","Your own crosshair over any game.",0],
  ["clock","Session tools","Timers, a stopwatch, quick notes that stay with the game, and input statistics.",0],
  ["book","Guides","Videos and walkthroughs for the game you've loaded, and recommendations for your modpack.",0],
  ["drive","Yours, on your PC","Library, screenshots, notes and statistics stay on your PC. Mods come straight from the mod sites.",0]
];
var grid = $("[data-features]");
if(grid) grid.innerHTML = FEATURES.map(function(f){
  return '<article class="card feat reveal">' + (f[3] ? '<span class="new">New</span>' : "") + '<div class="ico">' + icon(f[0]) + "</div><h3>" + esc(f[1]) + "</h3><p>" + esc(f[2]) + "</p></article>";
}).join("");
var HONEST = [
  ["flask","It's in early access","Nyxen is 1.0 Early Access: everything on this page works today, and new builds arrive through the app on their own. The Space is still marked beta."],
  ["win","Windows only","Windows 10 and 11. There's no macOS or Linux build yet."],
  ["alert","Not code-signed yet","SmartScreen warns you the first time, as it does for any installer without a paid certificate. The SHA-256 lets you check the file instead."],
  ["user","You need a Nyxen account","It's free and you make it in the app in a few seconds. It keeps your friends, messages, the Space and your settings."],
  ["key","Some parts use logins you have","Changing your Minecraft skin needs your Microsoft sign-in. Retro progress reads the RetroAchievements login RetroArch stores — only after you switch it on."],
  ["trash","Uninstalls cleanly","Per-user install, an ordinary Add / Remove Programs entry, and your settings survive updates."]
];
var hon = $("[data-honest]");
if(hon) hon.innerHTML = HONEST.map(function(f){
  return '<article class="card feat reveal"><div class="ico">' + icon(f[0]) + "</div><h3>" + esc(f[1]) + "</h3><p>" + esc(f[2]) + "</p></article>";
}).join("");

/* ---- reveal, stagger and counters ------------------------------------------ */
var revealEls = $$(".reveal");
revealEls.forEach(function(el){
  var sibs = [].slice.call(el.parentNode.children).filter(function(n){ return n.classList.contains("reveal"); });
  el.style.setProperty("--d", Math.min(7, sibs.indexOf(el)));
});
function countUp(root){
  $$("[data-count]", root).forEach(function(el){
    var to = +el.dataset.count, t0 = performance.now();
    if(reduce){ el.textContent = to; return; }
    (function step(now){
      var k = Math.min(1, (now - t0) / 1400);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if(k < 1) requestAnimationFrame(step);
    })(t0);
  });
}
if(!("IntersectionObserver" in window) || reduce){
  revealEls.forEach(function(el){ el.classList.add("in"); });
}else{
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
      if(e.target.classList.contains("stats")) countUp(e.target);
    });
  }, {rootMargin:"0px 0px -6% 0px"});
  revealEls.forEach(function(el){ io.observe(el); });
}
function watch(el, cb){
  if(!("IntersectionObserver" in window)){ cb(true); return; }
  new IntersectionObserver(function(es){ cb(es[0].isIntersecting); }, {rootMargin:"120px 0px"}).observe(el);
}

/* ---- navigation ------------------------------------------------------------ */
var nav = $("#nav"), menu = $(".menu", nav), up = $("#up"), bar = $(".progress span");
menu.addEventListener("click", function(){
  var open = !nav.classList.contains("open");
  nav.classList.toggle("open", open); menu.setAttribute("aria-expanded", String(open));
});
$$(".links a", nav).forEach(function(a){ a.addEventListener("click", function(){ nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }); });
var links = $$('.links a[href^="#"]', nav);
if("IntersectionObserver" in window){
  var seen = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting) links.forEach(function(a){ a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); }); });
  }, {rootMargin:"-45% 0px -50% 0px"});
  links.forEach(function(a){ var t = document.getElementById(a.getAttribute("href").slice(1)); if(t) seen.observe(t); });
}
var scrollDirty = true;
addEventListener("scroll", function(){ scrollDirty = true; }, {passive:true});
function readScroll(){
  if(!scrollDirty) return; scrollDirty = false;
  var y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  nav.classList.toggle("float", y > 30);
  up.classList.toggle("on", y > 900);
  bar.style.transform = "scaleX(" + Math.min(1, y / max).toFixed(4) + ")";
}
up.addEventListener("click", function(){ scrollTo({top:0, behavior: reduce ? "auto" : "smooth"}); });

/* ---- lightbox ----------------------------------------------------------------- */
var lb = $("#lightbox"), lbImg = $("img", lb), lbList = [], lbAt = 0;
function zoomList(){
  var l = [];
  TOUR.forEach(function(s){ l.push(SHOT(s.img)); });
  $$("[data-zoom]").forEach(function(el){ if(l.indexOf(el.dataset.zoom) < 0) l.push(el.dataset.zoom); });
  THEMES.forEach(function(t){ if(l.indexOf(SHOT(t.img)) < 0) l.push(SHOT(t.img)); });
  return l;
}
function lbPaint(){ lbImg.src = lbList[lbAt]; $("[data-lb-which]", lb).textContent = (lbAt + 1) + " of " + lbList.length; }
function openLb(src){
  lbList = zoomList(); lbAt = Math.max(0, lbList.indexOf(src));
  if(lbList.indexOf(src) < 0){ lbList.unshift(src); lbAt = 0; }
  lbPaint(); lb.classList.add("on"); document.body.style.overflow = "hidden";
}
function closeLb(){ lb.classList.remove("on"); document.body.style.overflow = ""; }
window.openLb = openLb;
$$("[data-zoom]").forEach(function(el){ el.addEventListener("click", function(){ openLb(el.dataset.zoom); }); });
lb.addEventListener("click", function(e){
  var b = e.target.closest("[data-lb]");
  if(b){ var a = b.dataset.lb; if(a === "close") closeLb(); else { lbAt = (lbAt + (a === "next" ? 1 : -1) + lbList.length) % lbList.length; lbPaint(); } return; }
  if(e.target === lb) closeLb();
});
addEventListener("keydown", function(e){
  if(!lb.classList.contains("on")) return;
  if(e.key === "Escape") closeLb();
  if(e.key === "ArrowRight"){ lbAt = (lbAt + 1) % lbList.length; lbPaint(); }
  if(e.key === "ArrowLeft"){ lbAt = (lbAt - 1 + lbList.length) % lbList.length; lbPaint(); }
});

/* ---- pointer: hero tilt, magnetic buttons, card light -------------------------- */
var hero = $("[data-tilt]"), pt = null, ptDirty = false;
addEventListener("pointermove", function(e){ if(e.pointerType !== "touch"){ pt = {x:e.clientX, y:e.clientY}; ptDirty = true; } }, {passive:true});
var magnets = $$(".magnetic");
function readPointer(){
  if(!ptDirty || !pt) return; ptDirty = false;
  if(hero){
    var r = hero.getBoundingClientRect();
    if(r.bottom > 0){
      hero.style.setProperty("--tx", Math.max(-1, Math.min(1, (pt.x - (r.left + r.width / 2)) / (innerWidth / 2))).toFixed(3));
      hero.style.setProperty("--ty", Math.max(-1, Math.min(1, (pt.y - (r.top + r.height / 2)) / (innerHeight / 2))).toFixed(3));
    }
  }
  magnets.forEach(function(el){
    var r = el.getBoundingClientRect(), dx = pt.x - (r.left + r.width / 2), dy = pt.y - (r.top + r.height / 2);
    var near = Math.abs(dx) < r.width / 2 + 60 && Math.abs(dy) < r.height / 2 + 40;
    el.style.setProperty("--mx", near ? (dx * .14).toFixed(1) + "px" : "0px");
    el.style.setProperty("--my", near ? (dy * .2).toFixed(1) + "px" : "0px");
  });
}
document.addEventListener("pointermove", function(e){
  var c = e.target.closest && e.target.closest(".card");
  if(!c || e.pointerType === "touch") return;
  var r = c.getBoundingClientRect();
  c.style.setProperty("--cx", (e.clientX - r.left) + "px"); c.style.setProperty("--cy", (e.clientY - r.top) + "px");
}, {passive:true});

/* ---- the night sky: stars, a constellation near the cursor, shooting stars ---- */
var sky = $("#sky"), sx = sky && sky.getContext("2d"), stars = [], shoots = [], sw = 0, sh = 0, nextShoot = 0;
function skySize(){
  var d = Math.min(1.5, devicePixelRatio || 1);
  sw = innerWidth; sh = innerHeight; sky.width = sw * d; sky.height = sh * d; sx.setTransform(d, 0, 0, d, 0, 0);
  var n = Math.round(Math.min(170, sw * sh / 9000));
  stars = [];
  for(var i = 0; i < n; i++) stars.push({x:Math.random() * sw, y:Math.random() * sh, r:Math.random() * 1.3 + .3,
    a:Math.random() * .6 + .2, t:Math.random() * 6.28, sp:.01 + Math.random() * .025, vy:-(Math.random() * .05 + .01),
    c:Math.random() < .3 ? "190,190,190" : "255,255,255"});
}
function skyFrame(now){
  sx.clearRect(0, 0, sw, sh);
  var par = scrollY * .04, i, s;
  for(i = 0; i < stars.length; i++){
    s = stars[i]; s.t += s.sp; s.y += s.vy;
    if(s.y < -4) s.y = sh + 4;
    var y = (s.y - par % sh + sh) % sh;
    sx.fillStyle = "rgba(" + s.c + "," + (s.a * (.55 + .45 * Math.sin(s.t))).toFixed(3) + ")";
    sx.beginPath(); sx.arc(s.x, y, s.r, 0, 6.283); sx.fill();
    s.py = y;
  }
  if(pt){
    sx.lineWidth = .8;
    var near = [];
    for(i = 0; i < stars.length; i++){ s = stars[i]; var dx = s.x - pt.x, dy = s.py - pt.y; if(dx * dx + dy * dy < 30000) near.push(s); }
    for(i = 0; i < near.length; i++) for(var j = i + 1; j < near.length; j++){
      var a = near[i], b = near[j], d2 = (a.x - b.x) * (a.x - b.x) + (a.py - b.py) * (a.py - b.py);
      if(d2 < 9000){ sx.strokeStyle = "rgba(255,255,255," + (.18 * (1 - d2 / 9000)).toFixed(3) + ")"; sx.beginPath(); sx.moveTo(a.x, a.py); sx.lineTo(b.x, b.py); sx.stroke(); }
    }
  }
  if(now > nextShoot){
    nextShoot = now + 3500 + Math.random() * 6000;
    shoots.push({x:Math.random() * sw * .8 + sw * .2, y:Math.random() * sh * .4, vx:-(6 + Math.random() * 4), vy:2.5 + Math.random() * 2, life:1});
  }
  for(i = shoots.length - 1; i >= 0; i--){
    var m = shoots[i]; m.x += m.vx; m.y += m.vy; m.life -= .022;
    if(m.life <= 0){ shoots.splice(i, 1); continue; }
    var g = sx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
    g.addColorStop(0, "rgba(255,255,255," + m.life.toFixed(2) + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
    sx.strokeStyle = g; sx.lineWidth = 1.6; sx.beginPath(); sx.moveTo(m.x, m.y); sx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); sx.stroke();
  }
}

/* ---- one loop for everything, ~30 fps for the sky, stopped when hidden ---------- */
var lastSky = 0;
function tick(now){
  requestAnimationFrame(tick);
  if(document.hidden) return;
  readScroll(); readPointer();
  if(sx && now - lastSky > 33){ lastSky = now; skyFrame(now); }
  for(var i = 0; i < loops.length; i++) loops[i](now);
}
if(reduce){
  readScroll();
  addEventListener("scroll", readScroll, {passive:true});
  if(sky) sky.style.display = "none";
}else{
  if(sx){ skySize(); addEventListener("resize", skySize); }
  requestAnimationFrame(tick);
}
})();
