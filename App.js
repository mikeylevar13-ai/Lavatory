Below is a complete Phase 2 upgrade (recording-first, iOS/web) that adds the “BandLab-like equipment” you asked for without more questions:
•	Metronome + BPM + count-in
•	Monitoring toggle (hear yourself while recording)
•	Mixer: volume, pan, mute, solo
•	Input meter + master meter (basic level meters)
•	FX rack per track: EQ (low/high shelf), Compressor, Reverb (simple), Delay
•	Better storage: audio blobs saved in IndexedDB (so you won’t hit localStorage limits quickly)
Paste/replace these files in your repo root:
•	index.html
•	styles.css
•	app.js
(Your manifest.webmanifest can stay the same.)
​
index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0b1220" />
  <title>Flow‑Lab DAW</title>
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <header class="topbar">
    <div class="brand">
      <div class="logo">FL</div>
      <div>
        <div class="title">Flow‑Lab DAW</div>
        <div class="subtitle" id="subtitle">Recording • Mixer • FX</div>
      </div>
    </div>

    <div class="actions">
      <button id="btnNewProject" class="btn ghost">New</button>
      <button id="btnSaveProject" class="btn">Save</button>
    </div>
  </header>

  <main class="wrap">
    <section class="card">
      <div class="row">
        <h2>Project</h2>
        <select id="projectSelect"></select>
      </div>
      <div class="hint">Use wired headphones to avoid echo/feedback. Bluetooth adds latency.</div>
    </section>

    <section class="card">
      <div class="row">
        <h2>Transport</h2>
        <div class="row">
          <button id="btnRecord" class="btn">● Record</button>
          <button id="btnStop" class="btn ghost" disabled>Stop</button>
          <button id="btnPlay" class="btn ghost" disabled>Play</button>
        </div>
      </div>

      <div class="transportGrid">
        <div class="transportCell">
          <div class="label">BPM</div>
          <input id="bpm" type="number" min="40" max="240" value="120">
        </div>
        <div class="transportCell">
          <div class="label">Count‑in</div>
          <select id="countIn">
            <option value="0">Off</option>
            <option value="1" selected>1 bar</option>
            <option value="2">2 bars</option>
          </select>
        </div>
        <div class="transportCell">
          <div class="label">Metronome</div>
          <button id="btnMet" class="btn ghost">Off</button>
        </div>
        <div class="transportCell">
          <div class="label">Master meter</div>
          <div class="meter"><div id="masterMeter" class="meterFill"></div></div>
        </div>
      </div>

      <div class="meta">
        <span id="recStatus">Idle</span>
        <span id="timeStatus">00:00</span>
      </div>
    </section>

    <section class="card">
      <div class="row">
        <h2>Tracks</h2>
        <button id="btnAddTrack" class="btn ghost">Add empty track</button>
      </div>
      <ul id="trackList" class="list"></ul>
    </section>

    <section class="card">
      <div class="row">
        <h2>Export</h2>
        <button id="btnExport" class="btn ghost" disabled>Mixdown (later)</button>
      </div>
      <div class="hint">WAV export + timeline editing comes next (Phase 3).</div>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
​
styles.css
:root{
  --bg:#070b14;
  --card:#0b1220;
  --text:#e7eefc;
  --muted:#9fb0d0;
  --line:rgba(255,255,255,.08);
  --btn:#2c6fff;
  --btn2:#121c33;
  --bad:#ff4d4d;
  --good:#2bd576;
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: radial-gradient(1200px 800px at 20% 0%, #10204a 0%, var(--bg) 55%);
  color:var(--text);
}

.topbar{
  position: sticky; top:0; z-index:10;
  display:flex; justify-content:space-between; align-items:center;
  padding: 14px;
  background: rgba(7,11,20,.70);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}
.brand{ display:flex; align-items:center; gap:12px; }
.logo{
  width:38px; height:38px; display:grid; place-items:center;
  border-radius: 12px;
  background: linear-gradient(135deg, #2c6fff, #7b2cff);
  font-weight: 900;
}
.title{ font-weight:900; }
.subtitle{ color: var(--muted); font-size: 12px; margin-top:2px; }
.actions{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }

.wrap{ width:min(980px, 92vw); margin: 14px auto 40px; display:grid; gap: 14px; }
.card{ background: rgba(11,18,32,.88); border: 1px solid var(--line); border-radius: 16px; padding: 14px; }
.row{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
h2{ margin:0; font-size: 16px; }

.btn{
  border: 1px solid rgba(255,255,255,.10);
  background: var(--btn);
  color: white;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
}
.btn.ghost{ background: var(--btn2); color: var(--text); }
.btn:disabled{ opacity:.55; }

.meta{ display:flex; justify-content:space-between; margin-top:10px; color: var(--muted); font-size: 13px; }
.hint{ color: var(--muted); font-size: 13px; margin-top: 6px; }

select, input[type="number"]{
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #070e1f;
  color: var(--text);
  padding: 10px 12px;
  font-weight: 700;
}

.transportGrid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 10px;
}
.transportCell{
  border: 1px solid var(--line);
  background: rgba(7,14,31,.55);
  border-radius: 14px;
  padding: 10px;
}
.label{ color: var(--muted); font-size: 12px; font-weight: 800; margin-bottom: 8px; letter-spacing:.2px; }

.list{ list-style:none; padding:0; margin: 10px 0 0; display:grid; gap:10px; }

.track{
  border: 1px solid var(--line);
  background: rgba(7,14,31,.70);
  border-radius: 14px;
  padding: 12px;
  display:grid;
  gap:10px;
}
.trackTop{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.trackName{ font-weight: 900; }
.trackControls{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

.small{
  background: transparent;
  border: 1px solid rgba(255,255,255,.12);
  color: var(--text);
  padding: 8px 10px;
  border-radius: 12px;
  font-weight: 800;
}
.small.active{
  border-color: rgba(44,111,255,.7);
  background: rgba(44,111,255,.22);
}
.slider{ width: 160px; }

.fx{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 10px;
}
.fxBox{
  border: 1px solid var(--line);
  background: rgba(7,14,31,.55);
  border-radius: 14px;
  padding: 10px;
}
.fxRow{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  margin-top: 8px;
}
.fxRow input[type="range"]{ width: 160px; }

.meter{
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  overflow:hidden;
  border: 1px solid rgba(255,255,255,.08);
}
.meterFill{
  height:100%;
  width: 0%;
  background: linear-gradient(90deg, #2bd576, #ffd000, #ff4d4d);
  transform-origin: left center;
}
.bad{ color: var(--bad); font-weight: 900; }
.good{ color: var(--good); font-weight: 900; }
​
app.js
/* Flow‑Lab DAW (Phase 2)
   - iOS/web recording
   - IndexedDB audio storage (blobs)
   - Mixer: vol/pan/mute/solo + meters
   - Metronome + count-in
   - Monitoring toggle
   - Per-track FX: EQ (low/high shelf), Compressor, Delay, simple Reverb
*/

const $ = (s) => document.querySelector(s);

const META_KEY = "flowdaw.projects.meta.v2";
const DB_NAME = "flowdaw_db";
const DB_STORE = "audioBlobs";

let audioCtx = null;
let masterGain = null;
let masterAnalyser = null;

let mediaStream = null;
let mediaRecorder = null;
let recChunks = [];
let recStartAt = 0;
let clockTimer = null;

let metOn = false;
let metTimer = null;

let projects = loadMeta();
let currentProjectId = projects[0]?.id ?? null;

let playingNodes = []; // for stop playback

/* -------------------- Utilities -------------------- */
function uid(){ return crypto.randomUUID(); }
function now(){ return new Date().toISOString(); }

function fmtTime(ms){
  const s = Math.floor(ms/1000);
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

function setStatus(text, cls){
  const el = $("#recStatus");
  el.className = "";
  if (cls) el.classList.add(cls);
  el.textContent = text;
}

function updateClock(){
  $("#timeStatus").textContent = mediaRecorder ? fmtTime(Date.now() - recStartAt) : "00:00";
}

/* -------------------- IndexedDB -------------------- */
function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, blob){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDel(key){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* -------------------- Meta storage -------------------- */
function loadMeta(){
  try { return JSON.parse(localStorage.getItem(META_KEY) || "[]"); }
  catch { return []; }
}
function saveMeta(){
  localStorage.setItem(META_KEY, JSON.stringify(projects));
}

function ensureProject(){
  if (!projects.length){
    const p = { id: uid(), name: "My Project", updatedAt: now(), tracks: [] };
    projects.unshift(p);
    currentProjectId = p.id;
    saveMeta();
  }
}
ensureProject();

function cur(){
  return projects.find(p => p.id === currentProjectId);
}

/* -------------------- Audio graph -------------------- */
function initAudio(){
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 1;

  masterAnalyser = audioCtx.createAnalyser();
  masterAnalyser.fftSize = 2048;

  masterGain.connect(masterAnalyser);
  masterAnalyser.connect(audioCtx.destination);

  startMasterMeter();
}

async function resumeAudio(){
  initAudio();
  await audioCtx.resume();
}

async function getMic(){
  if (mediaStream) return mediaStream;
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return mediaStream;
}

/* -------------------- Metering -------------------- */
function analyserLevel(analyser){
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  // RMS 0..1
  let sum = 0;
  for (let i=0;i<data.length;i++){
    const v = (data[i] - 128) / 128;
    sum += v*v;
  }
  return Math.sqrt(sum / data.length);
}

function levelToPct(level){
  // simple mapping
  const pct = Math.min(1, Math.max(0, level * 2.5));
  return pct * 100;
}

function startMasterMeter(){
  const fill = $("#masterMeter");
  const tick = () => {
    if (!masterAnalyser) return;
    const lvl = analyserLevel(masterAnalyser);
    fill.style.width = `${levelToPct(lvl)}%`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* -------------------- Metronome -------------------- */
function metTick(accent=false){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "square";
  o.frequency.value = accent ? 1100 : 880;
  g.gain.value = 0.0001;
  o.connect(g).connect(masterGain);

  const t = audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

  o.start(t);
  o.stop(t + 0.07);
}

function startMetronome(){
  if (metTimer) return;
  const bpm = clampBpm(parseInt($("#bpm").value || "120", 10));
  const interval = 60000 / bpm;
  let beat = 0;
  metTick(true);
  metTimer = setInterval(() => {
    beat = (beat + 1) % 4;
    metTick(beat === 0);
  }, interval);
}

function stopMetronome(){
  if (!metTimer) return;
  clearInterval(metTimer);
  metTimer = null;
}

function clampBpm(v){
  if (!Number.isFinite(v)) return 120;
  return Math.min(240, Math.max(40, v));
}

$("#btnMet").onclick = async () => {
  await resumeAudio();
  metOn = !metOn;
  $("#btnMet").textContent = metOn ? "On" : "Off";
  $("#btnMet").classList.toggle("active", metOn);
  if (metOn) startMetronome();
  else stopMetronome();
};

/* -------------------- Track FX chain builder -------------------- */
function buildFxChain(track){
  // src -> inputGain -> EQ -> Comp -> Delay -> Reverb -> pan -> trackGain -> masterGain
  const inputGain = audioCtx.createGain();
  inputGain.gain.value = 1;

  // EQ
  const low = audioCtx.createBiquadFilter();
  low.type = "lowshelf";
  low.frequency.value = 180;

  const high = audioCtx.createBiquadFilter();
  high.type = "highshelf";
  high.frequency.value = 3500;

  // Compressor
  const comp = audioCtx.createDynamicsCompressor();

  // Delay
  const delay = audioCtx.createDelay(1.0);
  const delayFb = audioCtx.createGain();
  const delayMix = audioCtx.createGain();

  // Simple reverb (feedback network-ish, light)
  const reverbDelay = audioCtx.createDelay(0.25);
  const reverbFb = audioCtx.createGain();
  const reverbMix = audioCtx.createGain();

  // Pan + gain
  const pan = audioCtx.createStereoPanner();
  const gain = audioCtx.createGain();

  // analyser for track meter
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  // Defaults from track state
  const st = track.fx || {};
  const vol = track.volume ?? 1;
  const panVal = track.pan ?? 0;

  // EQ gains (dB)
  low.gain.value = st.eqLow ?? 0;
  high.gain.value = st.eqHigh ?? 0;

  // Compressor
  comp.threshold.value = st.compThresh ?? -24;
  comp.ratio.value = st.compRatio ?? 4;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;

  // Delay
  delay.delayTime.value = (st.delayTime ?? 0.18);
  delayFb.gain.value = (st.delayFb ?? 0.25);
  delayMix.gain.value = (st.delayMix ?? 0.0);

  // Reverb
  reverbDelay.delayTime.value = 0.12;
  reverbFb.gain.value = 0.55;
  reverbMix.gain.value = (st.revMix ?? 0.0);

  pan.pan.value = panVal;
  gain.gain.value = vol;

  // Delay routing
  // wet: ... -> delay -> mix -> ...
  // feedback: delay -> fb -> delay
  delay.connect(delayFb).connect(delay);
  delay.connect(delayMix);

  // Reverb routing (small echo loop)
  reverbDelay.connect(reverbFb).connect(reverbDelay);
  reverbDelay.connect(reverbMix);

  // Main chain
  inputGain
    .connect(low)
    .connect(high)
    .connect(comp)
    .connect(delay)
    .connect(reverbDelay)
    .connect(pan)
    .connect(gain)
    .connect(analyser)
    .connect(masterGain);

  // Add wet taps (mix gains) into pan stage (so they are audible)
  delayMix.connect(pan);
  reverbMix.connect(pan);

  return { inputGain, low, high, comp, delay, delayFb, delayMix, reverbDelay, reverbFb, reverbMix, pan, gain, analyser };
}

/* -------------------- Rendering UI -------------------- */
function renderProjects(){
  const sel = $("#projectSelect");
  sel.innerHTML = "";
  projects.forEach(p => {
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = `${p.name} • ${new Date(p.updatedAt).toLocaleString()}`;
    sel.appendChild(o);
  });
  sel.value = currentProjectId;
  sel.onchange = () => {
    currentProjectId = sel.value;
    renderTracks();
    updateTransportButtons();
  };
}

function anyAudioInProject(p){
  return p.tracks.some(t => !!t.audioKey);
}

function updateTransportButtons(){
  const p = cur();
  $("#btnPlay").disabled = !anyAudioInProject(p);
  $("#btnExport").disabled = true; // Phase 3
}

function startTrackMeterLoop(trackId, analyser){
  const fill = document.querySelector(`[data-meter="${trackId}"]`);
  if (!fill) return;

  let alive = true;
  const loop = () => {
    if (!alive) return;
    const lvl = analyserLevel(analyser);
    fill.style.width = `${levelToPct(lvl)}%`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return () => { alive = false; };
}

function renderTracks(){
  const p = cur();
  const ul = $("#trackList");
  ul.innerHTML = "";

  if (!p.tracks.length){
    const li = document.createElement("li");
    li.className = "hint";
    li.textContent = "No tracks yet. Record to create one, or tap Add empty track.";
    ul.appendChild(li);
    return;
  }

  const soloOn = p.tracks.some(t => t.solo);

  p.tracks.forEach((t, idx) => {
    const li = document.createElement("li");
    li.className = "track";

    const top = document.createElement("div");
    top.className = "trackTop";

    const name = document.createElement("div");
    name.className = "trackName";
    name.textContent = t.name || `Track ${idx+1}`;

    const controls = document.createElement("div");
    controls.className = "trackControls";

    const mute = document.createElement("button");
    mute.className = "small";
    mute.textContent = t.muted ? "Muted" : "Mute";
    mute.classList.toggle("active", !!t.muted);
    mute.onclick = () => { t.muted = !t.muted; p.updatedAt = now(); saveMeta(); renderTracks(); };

    const solo = document.createElement("button");
    solo.className = "small";
    solo.textContent = t.solo ? "Solo" : "Solo";
    solo.classList.toggle("active", !!t.solo);
    solo.onclick = () => { t.solo = !t.solo; p.updatedAt = now(); saveMeta(); renderTracks(); };

    const monitor = document.createElement("button");
    monitor.className = "small";
    monitor.textContent = t.monitor ? "Monitor" : "Monitor";
    monitor.classList.toggle("active", !!t.monitor);
    monitor.onclick = () => { t.monitor = !t.monitor; p.updatedAt = now(); saveMeta(); renderTracks(); };

    const vol = document.createElement("input");
    vol.type = "range"; vol.min = "0"; vol.max = "1"; vol.step = "0.01";
    vol.value = String(t.volume ?? 1);
    vol.className = "slider";
    vol.oninput = () => { t.volume = parseFloat(vol.value); p.updatedAt = now(); saveMeta(); };

    const pan = document.createElement("input");
    pan.type = "range"; pan.min = "-1"; pan.max = "1"; pan.step = "0.01";
    pan.value = String(t.pan ?? 0);
    pan.className = "slider";
    pan.oninput = () => { t.pan = parseFloat(pan.value); p.updatedAt = now(); saveMeta(); };

    const del = document.createElement("button");
    del.className = "small";
    del.textContent = "Delete";
    del.onclick = async () => {
      if (!confirm("Delete this track and its audio?")) return;
      if (t.audioKey) await idbDel(t.audioKey);
      p.tracks = p.tracks.filter(x => x.id !== t.id);
      p.updatedAt = now();
      saveMeta();
      renderTracks();
      updateTransportButtons();
    };

    controls.appendChild(mute);
    controls.appendChild(solo);
    controls.appendChild(monitor);
    controls.appendChild(vol);
    controls.appendChild(pan);
    controls.appendChild(del);

    top.appendChild(name);
    top.appendChild(controls);

    const meterRow = document.createElement("div");
    meterRow.className = "fxBox";
    meterRow.innerHTML = `
      <div class="label">Track meter</div>
      <div class="meter"><div class="meterFill" data-meter="${t.id}" style="width:0%"></div></div>
      <div class="hint">${t.audioKey ? "Has audio take" : "Empty (no audio recorded yet)"}</div>
      <div class="hint">${soloOn ? "Solo mode active" : ""}</div>
    `;

    const fx = document.createElement("div");
    fx.className = "fx";
    fx.innerHTML = `
      <div class="fxBox">
        <div class="label">EQ</div>
        <div class="fxRow"><span class="hint">Low</span><input data-fx="eqLow" type="range" min="-18" max="18" step="0.1"></div>
        <div class="fxRow"><span class="hint">High</span><input data-fx="eqHigh" type="range" min="-18" max="18" step="0.1"></div>
      </div>

      <div class="fxBox">
        <div class="label">Compressor</div>
        <div class="fxRow"><span class="hint">Thresh</span><input data-fx="compThresh" type="range" min="-60" max="0" step="1"></div>
        <div class="fxRow"><span class="hint">Ratio</span><input data-fx="compRatio" type="range" min="1" max="20" step="0.5"></div>
      </div>

      <div class="fxBox">
        <div class="label">Delay</div>
        <div class="fxRow"><span class="hint">Time</span><input data-fx="delayTime" type="range" min="0" max="0.6" step="0.01"></div>
        <div class="fxRow"><span class="hint">Mix</span><input data-fx="delayMix" type="range" min="0" max="0.9" step="0.01"></div>
      </div>

      <div class="fxBox">
        <div class="label">Reverb</div>
        <div class="fxRow"><span class="hint">Mix</span><input data-fx="revMix" type="range" min="0" max="0.9" step="0.01"></div>
        <div class="hint">Light reverb (Phase 3 will add real impulse responses).</div>
      </div>
    `;

    // wire FX sliders
    const fxState = (t.fx ||= {
      eqLow: 0, eqHigh: 0,
      compThresh: -24, compRatio: 4,
      delayTime: 0.18, delayMix: 0.0, delayFb: 0.25,
      revMix: 0.0
    });

    fx.querySelectorAll("input[data-fx]").forEach(inp => {
      const k = inp.dataset.fx;
      inp.value = String(fxState[k] ?? 0);
      inp.oninput = () => {
        fxState[k] = parseFloat(inp.value);
        p.updatedAt = now();
        saveMeta();
      };
    });

    li.appendChild(top);
    li.appendChild(meterRow);
    li.appendChild(fx);
    ul.appendChild(li);
  });
}

/* -------------------- Recording -------------------- */
async function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

async function doCountInIfNeeded(){
  const bars = parseInt($("#countIn").value, 10) || 0;
  if (!bars) return;

  await resumeAudio();
  const bpm = clampBpm(parseInt($("#bpm").value || "120", 10));
  const beatMs = 60000 / bpm;
  const beats = bars * 4;

  setStatus(`Count‑in: ${bars} bar(s)…`, "good");
  for (let i=0;i<beats;i++){
    metTick(i % 4 === 0);
    await wait(beatMs);
  }
}

function mimePick(){
  // Safari iOS usually supports audio/mp4; others often audio/webm.
  const cand = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus"
  ];
  for (const m of cand){
    if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return "";
}

async function startRecording(){
  await resumeAudio();
  await getMic();

  // optional count-in beeps (even if metronome is off)
  await doCountInIfNeeded();

  recChunks = [];
  const mimeType = mimePick();
  mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined);

  // monitoring (direct) routing
  const p = cur();
  const shouldMonitor = p.tracks.some(t => t.monitor);
  let monitorNodes = null;

  if (shouldMonitor){
    // simple monitor: mic -> analyser -> master
    const src = audioCtx.createMediaStreamSource(mediaStream);
    const g = audioCtx.createGain();
    g.gain.value = 0.9; // keep safe
    src.connect(g).connect(masterGain);
    monitorNodes = { src, g };
  }

  mediaRecorder.ondataavailable = (e) => { if (e.data.size) recChunks.push(e.data); };

  mediaRecorder.onstop = async () => {
    try{
      const blob = new Blob(recChunks, { type: mediaRecorder.mimeType || "audio/mp4" });
      const audioKey = uid();
      await idbSet(audioKey, blob);

      // Save as a new track take
      p.tracks.unshift({
        id: uid(),
        name: `Take ${p.tracks.length + 1}`,
        volume: 1,
        pan: 0,
        muted: false,
        solo: false,
        monitor: false,
        fx: {
          eqLow: 0, eqHigh: 0,
          compThresh: -24, compRatio: 4,
          delayTime: 0.18, delayMix: 0.0, delayFb: 0.25,
          revMix: 0.0
        },
        audioKey,
        createdAt: now()
      });

      p.updatedAt = now();
      saveMeta();

      setStatus("Saved take", "good");
      renderProjects();
      renderTracks();
      updateTransportButtons();
    } catch (err){
      console.error(err);
      alert("Failed saving take. Try again.");
      setStatus("Error", "bad");
    } finally {
      // cleanup
      if (monitorNodes){
        try{ monitorNodes.src.disconnect(); }catch{}
        try{ monitorNodes.g.disconnect(); }catch{}
      }
      mediaRecorder = null;
      recChunks = [];
      clearInterval(clockTimer);
      $("#btnStop").disabled = true;
      $("#btnRecord").disabled = false;
      $("#btnPlay").disabled = false;
      $("#timeStatus").textContent = "00:00";
    }
  };

  mediaRecorder.start();
  recStartAt = Date.now();
  clockTimer = setInterval(updateClock, 200);

  $("#btnRecord").disabled = true;
  $("#btnStop").disabled = false;
  $("#btnPlay").disabled = true;
  setStatus("Recording…", "bad");
}

function stopRecording(){
  if (!mediaRecorder) return;
  mediaRecorder.stop();
  setStatus("Processing…");
}

/* -------------------- Playback (mix) -------------------- */
async function stopPlayback(){
  for (const n of playingNodes){
    try{ n.src.stop(); } catch {}
    try{ n.src.disconnect(); } catch {}
    try{ n.gain.disconnect(); } catch {}
    try{ n.pan.disconnect(); } catch {}
  }
  playingNodes = [];
  setStatus("Idle");
}

async function playMix(){
  await resumeAudio();

  const p = cur();
  const soloOn = p.tracks.some(t => t.solo);

  const playable = p.tracks.filter(t => {
    if (!t.audioKey) return false;
    if (t.muted) return false;
    if (soloOn && !t.solo) return false;
    return true;
  });

  if (!playable.length) return;

  setStatus("Playing…", "good");
  await stopPlayback();

  // Decode and play in sync
  const decoded = await Promise.all(playable.map(async (t) => {
    const blob = await idbGet(t.audioKey);
    if (!blob) return null;
    const arr = await blob.arrayBuffer();
    const buf = await audioCtx.decodeAudioData(arr.slice(0));
    return { t, buf };
  }));

  const items = decoded.filter(Boolean);

  // start all sources together; apply FX as a chain per track
  const startAt = audioCtx.currentTime + 0.08;

  let longest = 0;

  for (const {t, buf} of items){
    const src = audioCtx.createBufferSource();
    src.buffer = buf;

    // build chain; connect src -> chain.inputGain
    const chain = buildFxChain(t);

    // apply current params
    const st = t.fx || {};
    chain.low.gain.value = st.eqLow ?? 0;
    chain.high.gain.value = st.eqHigh ?? 0;
    chain.comp.threshold.value = st.compThresh ?? -24;
    chain.comp.ratio.value = st.compRatio ?? 4;

    chain.delay.delayTime.value = st.delayTime ?? 0.18;
    chain.delayMix.gain.value = st.delayMix ?? 0.0;
    chain.delayFb.gain.value = st.delayFb ?? 0.25;

    chain.reverbMix.gain.value = st.revMix ?? 0.0;

    chain.pan.pan.value = t.pan ?? 0;
    chain.gain.gain.value = t.volume ?? 1;

    src.connect(chain.inputGain);

    // Track meter loop
    startTrackMeterLoop(t.id, chain.analyser);

    src.start(startAt);

    playingNodes.push({ src, gain: chain.gain, pan: chain.pan });
    longest = Math.max(longest, buf.duration);
  }

  // Stop status after playback
  setTimeout(() => setStatus("Idle"), Math.ceil(longest*1000) + 250);
}

/* -------------------- Buttons -------------------- */
$("#btnRecord").onclick = startRecording;
$("#btnStop").onclick = async () => {
  if (mediaRecorder) stopRecording();
  else await stopPlayback();
};
$("#btnPlay").onclick = playMix;

$("#btnAddTrack").onclick = () => {
  const p = cur();
  p.tracks.push({
    id: uid(),
    name: `Track ${p.tracks.length+1}`,
    volume: 1,
    pan: 0,
    muted:false,
    solo:false,
    monitor:false,
    fx: {
      eqLow: 0, eqHigh: 0,
      compThresh: -24, compRatio: 4,
      delayTime: 0.18, delayMix: 0.0, delayFb: 0.25,
      revMix: 0.0
    },
    audioKey:null,
    createdAt: now()
  });
  p.updatedAt = now();
  saveMeta();
