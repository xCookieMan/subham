import { useEffect, useMemo, useRef, useState } from "react";
import '../../styles/Timeline.css';
const CFG = { duration: 35, fps: 30, width: 870, sidebar: 120 };
const CLIP_COUNT = 10;
const CLIP_GAP = 2;

// ✅ Working sample videos (replace with your own later)
const SAMPLE_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
];

// ✅ Random thumbnail seeds for variety
const THUMB_SEEDS = [
  "nature",
  "city",
  "tech",
  "ocean",
  "mountain",
  "forest",
  "sunset",
  "space",
  "abstract",
  "urban",
];

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const f = Math.floor((sec % 1) * CFG.fps);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

function wavePath() {
  const w = CFG.width,
    h = 24;
  let d = `M0 ${h / 2}`;
  for (let x = 0; x <= w; x += 3) {
    const t = x / w;
    const y =
      h / 2 +
      (Math.sin(t * 30) * 4 + Math.sin(t * 70) * 2) * Math.sin(t * Math.PI);
    d += ` L${x} ${Math.max(3, Math.min(h - 3, y))}`;
  }
  return `${d} L${w} ${h} L0 ${h} Z`;
}

function gradePaths() {
  const w = CFG.width,
    h = 42;
  const pts = [
    { x: 0, y: 0.8 },
    { x: 0.3, y: 0.4 },
    { x: 0.6, y: 0.7 },
    { x: 1, y: 0.2 },
  ];
  let line = `M${pts[0].x * w} ${pts[0].y * h}`;
  let fill = `M${pts[0].x * w} ${h} L${pts[0].x * w} ${pts[0].y * h}`;
  for (let i = 1; i < pts.length; i += 1) {
    const p0 = pts[i - 1],
      p1 = pts[i];
    const cx = ((p0.x + p1.x) / 2) * w;
    const cy = ((p0.y + p1.y) / 2) * h;
    line += ` Q${cx} ${cy} ${p1.x * w} ${p1.y * h}`;
    fill += ` Q${cx} ${cy} ${p1.x * w} ${p1.y * h}`;
  }
  fill += ` L${pts[pts.length - 1].x * w} ${h} Z`;
  return { line, fill };
}

// ✅ Generate realistic clip data with RANDOM widths (not proportional)
function generateRealisticClips(count, totalWidth, totalDuration) {
  const clips = [];
  let remainingWidth = totalWidth - (count - 1) * CLIP_GAP;
  let remainingDuration = totalDuration;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;

    // Random duration: 1.5s to 6s (realistic edit lengths)
    const minDur = 1.5,
      maxDur = 6;
    const duration = isLast
      ? remainingDuration
      : Math.min(
          remainingDuration,
          +(minDur + Math.random() * (maxDur - minDur)).toFixed(2),
        );

    // Random width: NOT strictly proportional - simulates trimmed/extended clips
    // Width can vary ±40% from proportional value for realistic look
    const baseWidth = (duration / totalDuration) * remainingWidth;
    const variance = 0.4; // ±40% variance
    const randomFactor = 1 + (Math.random() * variance * 2 - variance);
    let width = Math.round(baseWidth * randomFactor);

    // Ensure minimum width and fit remaining space
    if (isLast) {
      width = remainingWidth; // Last clip takes remaining space
    } else {
      width = Math.max(
        24,
        Math.min(width, remainingWidth - (count - i - 1) * 24),
      );
    }

    clips.push({
      id: `clip-${i + 1}`,
      duration: +duration.toFixed(2),
      width,
      videoSrc: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
      thumbnail: `https://picsum.photos/seed/${THUMB_SEEDS[i]}/320/180`,
      label: `CLIP-${String(i + 1).padStart(2, "0")}`,
      color: `hsl(${(i * 37) % 360}, 60%, 45%)`, // Unique color per clip
    });

    remainingWidth -= width + CLIP_GAP;
    remainingDuration -= duration;
  }

  return clips;
}

function Timeline({ onBack, embedded = false }) {
  const rulerRef = useRef(null);
  const tracksRef = useRef(null);
  const previewVideoRef = useRef(null);
  const animRef = useRef(0);

  const [pos, setPos] = useState(CFG.width * 0.52);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoverPreview, setHoverPreview] = useState(null);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const wave = useMemo(() => wavePath(), []);
  const grade = useMemo(() => gradePaths(), []);

  // ✅ Generate clips with random realistic widths
  const clipData = useMemo(
    () => generateRealisticClips(CLIP_COUNT, CFG.width, CFG.duration),
    [],
  );

  const playheadLeft = CFG.sidebar + pos;
  const current = fmtTime((pos / CFG.width) * CFG.duration);

  const updatePlayhead = (px) => setPos(Math.max(0, Math.min(CFG.width, px)));
  const togglePlay = () => setPlaying((p) => !p);
  const zoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)));

  // Playback animation
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const animate = () => {
      setPos((prev) => (prev + 0.8 >= CFG.width ? 0 : prev + 0.8));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  // Drag handlers
  useEffect(() => {
    const move = (e) => {
      if (!dragging || !rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      updatePlayhead(e.clientX - rect.left - CFG.sidebar);
    };
    const up = () => setDragging(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && !dragging) {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dragging]);

  // Preview video handler - updates src when clip changes
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video || !hoverPreview) return;

    setPreviewLoading(true);
    setPreviewError(false);
    setPreviewTime(0);
    video.src = hoverPreview.clip.videoSrc;
    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;

    const onLoaded = () => {
      setPreviewLoading(false);
      video.play().catch(() => setPreviewError(true));
    };
    const onError = () => {
      setPreviewLoading(false);
      setPreviewError(true);
    };
    const onTime = () => setPreviewTime(video.currentTime || 0);
    const onEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
      video.pause();
      setPreviewTime(0);
    };
  }, [hoverPreview?.clip?.id]);

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    setPlaying(false);
  };

  const onRulerDown = (e) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    updatePlayhead(e.clientX - rect.left - CFG.sidebar);
    startDrag(e);
  };

  const onClipHover = (e, clip) => {
    if (!tracksRef.current) return;
    const rect = tracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const previewWidth = 280,
      previewHeight = 210;
    setHoverPreview({
      clip,
      x: Math.max(130, Math.min(rect.width - previewWidth + 10, x)),
      y: Math.max(20, Math.min(rect.height - previewHeight, y - 70)),
    });
  };

  const previewPct = hoverPreview
    ? Math.min(
        100,
        (previewTime / Math.max(hoverPreview.clip.duration, 0.01)) * 100,
      )
    : 0;

  return (
    <main className="timeline-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg:#050508; --panel:#0a0a0e; --track:#0e0e14; --border:#1a1a22;
          --text:#fff; --text-dim:#888; --text-muted:#555;
          --paused:#ff8c42; --paused-glow:rgba(255,140,66,.4);
          --playing:#2ecc71; --playing-glow:rgba(46,204,113,.5);
          --video:#4ecdc4; --audio:#2ecc71; --effects:#9b59b6;
          --transitions:#3498db; --accent:#ff8c42;
          --ease:cubic-bezier(.4,0,.2,1);
        }
        .timeline-shell { width:100%; min-height:100vh; background:var(--bg); font-family:'Inter',sans-serif; color:var(--text); }
        .timeline-container { width:100%; background:var(--panel); border:1px solid var(--border); overflow:hidden; border-radius:12px; }
        .tl-header { padding:12px 20px 10px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); }
        .tl-left { display:flex; align-items:center; gap:12px; }
        .tl-home { border:1px solid var(--border); background:var(--track); color:#bbb; border-radius:6px; padding:6px 10px; font-size:10px; cursor:pointer; transition:all .15s; }
        .tl-home:hover { border-color:var(--accent); color:var(--text); }
        .tl-header-title { font-size:10px; font-weight:700; color:var(--text-muted); letter-spacing:1.5px; text-transform:uppercase; }
        .tl-header-title span { color:var(--accent); }
        .status-badge { display:flex; align-items:center; gap:8px; padding:6px 14px; background:var(--track); border-radius:6px; border:1px solid var(--border); font-size:10px; font-weight:600; letter-spacing:.5px; transition:all .2s var(--ease); cursor:pointer; color:inherit; }
        .status-badge:hover { border-color:var(--accent); transform:translateY(-1px); }
        .status-dot { width:10px; height:10px; border-radius:50%; background:var(--paused); }
        .status-badge.playing .status-dot { background:var(--playing); box-shadow:0 0 0 6px var(--playing-glow); animation:pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { box-shadow:0 0 0 0 rgba(46,204,113,.5); } 50% { box-shadow:0 0 0 10px rgba(46,204,113,0); } }
        .status-text { color:var(--paused); } .status-badge.playing .status-text { color:var(--playing); }
        .ruler-area { height:48px; background:linear-gradient(180deg,#08080c,var(--panel)); border-top:1px solid var(--border); border-bottom:1px solid var(--border); display:flex; align-items:flex-end; padding-left:120px; position:relative; cursor:ew-resize; user-select:none; }
        .ruler-marks { display:flex; width:${CFG.width}px; height:32px; transform-origin:left center; transform:scaleX(${zoom}); }
        .ruler-mark { flex:0 0 24.857px; display:flex; flex-direction:column; align-items:center; font-family:'JetBrains Mono',monospace; font-size:9px; position:relative; }
        .ruler-mark.major { color:var(--paused); font-weight:600; } .ruler-mark.major::after { content:''; position:absolute; bottom:0; width:2px; height:18px; background:var(--paused); border-radius:1px; }
        .ruler-mark.minor { color:var(--text-dim); } .ruler-mark.minor::after { content:''; position:absolute; bottom:0; width:1px; height:10px; background:#333; }
        .time-label { margin-bottom:3px; white-space:nowrap; }
        .playhead-bubble { position:absolute; top:-38px; transform:translateX(-50%); z-index:200; pointer-events:none; transition:transform .15s; }
        .playhead-bubble.dragging { transform:translateX(-50%) scale(1.05); }
        .bubble-time { background:linear-gradient(135deg,var(--accent),#ff6b35); color:#fff; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; padding:5px 12px; border-radius:6px; white-space:nowrap; box-shadow:0 4px 20px rgba(255,140,66,.4); position:relative; }
        .bubble-time::after { content:''; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid var(--accent); }
        .playhead-line { position:absolute; top:0; bottom:0; width:2px; background:linear-gradient(180deg,var(--paused),transparent); z-index:150; pointer-events:none; transition:background .2s; }
        .playhead-line.playing { background:linear-gradient(180deg,var(--playing),transparent); box-shadow:0 0 15px var(--playing-glow); }
        .playhead-handle { position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:14px; height:14px; background:var(--panel); border:2px solid var(--paused); border-radius:50%; cursor:ew-resize; pointer-events:auto; transition:all .15s; }
        .playhead-handle.playing { border-color:var(--playing); } .playhead-handle:hover { transform:translateX(-50%) scale(1.2); background:var(--accent); }
        .tl-body { display:flex; min-height:260px; }
        .tl-sidebar { width:110px; flex-shrink:0; display:flex; flex-direction:column; justify-content:center; padding-top:4px; border-right:1px solid var(--border); }
        .tl-sb-item { height:50px; display:flex; align-items:center; padding:0 12px; gap:8px; position:relative; cursor:pointer; transition:background .15s; }
        .tl-sb-item:hover { background:rgba(255,255,255,.03); }
        .tl-sb-item::before { content:''; position:absolute; left:0; top:10px; bottom:10px; width:3px; border-radius:0 2px 2px 0; transition:background .15s; }
        .tl-sb-item.active::before { background:var(--accent); } .tl-sb-item.active .tl-sb-label { color:#ccc; } .tl-sb-item.active .tl-sb-icon { opacity:1; }
        .tl-sb-icon { width:16px; height:16px; opacity:.4; } .tl-sb-label { font-size:9px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); white-space:nowrap; } .tl-sb-arrow { margin-left:auto; color:#333; font-size:10px; }
        .si-video .tl-sb-icon { color:var(--video); } .si-audio .tl-sb-icon { color:var(--audio); } .si-effects .tl-sb-icon { color:var(--effects); } .si-transitions .tl-sb-icon { color:var(--transitions); } .si-color .tl-sb-icon { color:var(--accent); }
        .tl-tracks { flex:1; position:relative; overflow-x:auto; overflow-y:hidden; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
        .tl-tracks::-webkit-scrollbar { height:6px; } .tl-tracks::-webkit-scrollbar-track { background:transparent; } .tl-tracks::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
        .tl-track { height:50px; border-bottom:1px solid var(--border); position:relative; }
        .video-clips-row { display:flex; gap:${CLIP_GAP}px; padding:4px 0; height:100%; align-items:center; width:${CFG.width}px; transform-origin:left center; transform:scaleX(${zoom}); }
        .v-clip { height:42px; border-radius:5px; overflow:hidden; position:relative; flex-shrink:0; cursor:pointer; border:2px solid var(--border); transition:all .15s; }
        .v-clip:hover { border-color:#555; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.3); z-index:5; }
        .v-clip-img { width:100%; height:100%; object-fit:cover; }
        .v-clip-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.55) 100%); }
        .v-clip-label { position:absolute; bottom:3px; left:0; right:0; text-align:center; font-size:7px; font-weight:600; color:rgba(255,255,255,.85); letter-spacing:.8px; text-shadow:0 1px 4px rgba(0,0,0,.9); }
        .v-clip-duration { position:absolute; top:3px; right:5px; font-size:6px; color:rgba(255,255,255,.6); background:rgba(0,0,0,.4); padding:1px 4px; border-radius:3px; }
        .audio-row { height:100%; display:flex; align-items:center; }
        .audio-waveform { width:${CFG.width}px; height:24px; overflow:hidden; transform-origin:left center; transform:scaleX(${zoom}); }
        .audio-waveform svg { width:100%; height:100%; }
        .fx-row { display:flex; gap:16px; height:100%; align-items:center; width:${CFG.width}px; transform-origin:left center; transform:scaleX(${zoom}); }
        .fx-block { height:20px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:7px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; border:1px solid rgba(255,255,255,.08); cursor:pointer; transition:transform .15s; }
        .fx-block:hover { transform:translateY(-1px); }
        .fx-purple { background:linear-gradient(135deg,#6b2fa0,#4a1d70); color:#c9a0f0; }
        .tr-row { display:flex; gap:20px; height:100%; align-items:center; width:${CFG.width}px; transform-origin:left center; transform:scaleX(${zoom}); }
        .tr-block { height:18px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:6px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; border:1px solid; cursor:pointer; transition:transform .15s; }
        .tr-block:hover { transform:translateY(-1px); }
        .tr-purple { background:#3d1a5c; color:#b080e0; border-color:#5a2a80; } .tr-blue { background:#1a3a5c; color:#60a0d0; border-color:#2a5080; }
        .grade-row { height:100%; display:flex; align-items:center; padding:0 4px; }
        .grade-container { width:${CFG.width}px; height:42px; transform-origin:left center; transform:scaleX(${zoom}); }
        .grade-container svg { width:100%; height:100%; }
        .tl-bottom { height:36px; background:var(--track); border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 16px; }
        .bl-left { display:flex; align-items:center; }
        .snap-badge { font-size:9px; color:var(--text-muted); font-weight:600; letter-spacing:.5px; display:flex; align-items:center; gap:4px; }
        .snap-badge .val { color:var(--accent); } .snap-badge .state { color:var(--video); }
        .pause-indicator { font-size:10px; font-weight:600; color:var(--text-dim); letter-spacing:2px; display:flex; align-items:center; gap:5px; cursor:pointer; padding:4px 10px; border-radius:4px; transition:all .15s; }
        .pause-indicator:hover { background:var(--border); color:var(--text); } .pause-indicator.playing { color:var(--playing); }
        .pause-bars { width:8px; height:10px; display:flex; gap:2px; }
        .pause-bars span { width:2.5px; height:100%; background:currentColor; border-radius:1px; }
        .pause-indicator.playing .pause-bars span { animation:barsPulse .6s ease-in-out infinite alternate; }
        .pause-indicator.playing .pause-bars span:nth-child(2) { animation-delay:.1s; }
        @keyframes barsPulse { from { height:4px; opacity:.7; } to { height:10px; opacity:1; } }
        .br-right { display:flex; align-items:center; gap:10px; }
        .br-icon { width:14px; height:14px; color:var(--text-dim); cursor:pointer; transition:color .15s; padding:4px; border-radius:4px; }
        .br-icon:hover { color:var(--text); background:var(--border); }
        .zoom-ctrl { display:flex; align-items:center; gap:5px; }
        .zoom-btn { width:16px; height:16px; display:flex; align-items:center; justify-content:center; color:var(--text-dim); cursor:pointer; font-size:11px; border-radius:2px; transition:all .15s; background:var(--track); border:1px solid var(--border); }
        .zoom-btn:hover { color:var(--text); border-color:var(--accent); }
        .zoom-slider { width:44px; height:2px; background:#222; border-radius:1px; position:relative; }
        .zoom-slider::after { content:''; position:absolute; left:18px; top:-3px; width:8px; height:8px; background:#555; border-radius:50%; border:1px solid #666; }
        .hover-preview { position:absolute; width:280px; background:#0b0f17; border:1px solid #2a3342; border-radius:12px; box-shadow:0 14px 40px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.05); z-index:350; pointer-events:none; overflow:hidden; animation:previewFadeIn .15s ease-out; }
        @keyframes previewFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .hover-preview-head { padding:8px 10px; font-size:9px; letter-spacing:1px; color:#8ea2bd; text-transform:uppercase; border-bottom:1px solid #1f2937; display:flex; justify-content:space-between; align-items:center; }
        .hover-preview-clipname { color:var(--accent); font-weight:600; }
        .hover-preview-video { width:100%; height:150px; background:#02070f; object-fit:cover; display:block; }
        .hover-preview-placeholder { width:100%; height:150px; background:linear-gradient(135deg,#1a2a3a,#0a1a2a); display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:11px; }
        .hover-preview-loading { width:100%; height:150px; background:#02070f; display:flex; align-items:center; justify-content:center; }
        .spinner { width:24px; height:24px; border:2px solid rgba(255,255,255,.1); border-top-color:var(--accent); border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .hover-preview-foot { padding:8px 10px; }
        .hover-preview-time { display:flex; justify-content:space-between; font-size:10px; color:#b9c8dc; margin-bottom:6px; font-family:'JetBrains Mono',monospace; }
        .hover-preview-bar { height:3px; background:#1f2937; border-radius:2px; overflow:hidden; }
        .hover-preview-bar span { display:block; height:100%; background:linear-gradient(90deg,#ff8c42,#ff6b35); transition:width .1s linear; }
        .preview-error { width:100%; height:150px; background:#1a0a0a; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#ff6b6b; font-size:10px; gap:6px; }
        .preview-error svg { width:28px; height:28px; opacity:.7; }
      `}</style>

      <div className="timeline-container">
        {/* Header */}
        <div className="tl-header">
          <div className="tl-left">
            {!embedded && (
              <button className="tl-home" onClick={onBack}>
                HOME
              </button>
            )}
            <div className="tl-header-title">
              TIMELINE (<span>PRO</span>)
            </div>
          </div>
          <button
            className={`status-badge ${playing ? "playing" : ""}`}
            onClick={togglePlay}
            title="Play/Pause (Space)"
          >
            <div className="status-dot" />
            <span className="status-text">
              {playing ? "PLAYING" : "PAUSED"}
            </span>
          </button>
        </div>

        {/* Time Scale */}
        <div className="ruler-area" ref={rulerRef} onMouseDown={onRulerDown}>
          <div className="ruler-marks">
            {Array.from({ length: CFG.duration + 1 }).map((_, s) => (
              <div
                key={s}
                className={`ruler-mark ${s % 5 === 0 ? "major" : "minor"}`}
              >
                {s % 5 === 0 && (
                  <span className="time-label">{`00:${String(s).padStart(2, "0")}`}</span>
                )}
              </div>
            ))}
          </div>
          <div
            className={`playhead-bubble ${dragging ? "dragging" : ""}`}
            style={{ left: `${playheadLeft}px` }}
          >
            <div className="bubble-time">{current}</div>
          </div>
          <div
            className={`playhead-line ${playing ? "playing" : ""}`}
            style={{ left: `${playheadLeft}px` }}
          >
            <div
              className={`playhead-handle ${playing ? "playing" : ""}`}
              onMouseDown={(e) => {
                e.stopPropagation();
                startDrag(e);
              }}
              title="Drag to scrub"
            />
          </div>
        </div>

        {/* Body */}
        <div className="tl-body">
          {/* Sidebar */}
          <div className="tl-sidebar">
            <div className="tl-sb-item si-video active">
              <svg
                className="tl-sb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <span className="tl-sb-label">VIDEO</span>
              <span className="tl-sb-arrow">›</span>
            </div>
            <div className="tl-sb-item si-audio active">
              <svg
                className="tl-sb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span className="tl-sb-label">AUDIO</span>
              <span className="tl-sb-arrow">›</span>
            </div>
            <div className="tl-sb-item si-effects">
              <svg
                className="tl-sb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="tl-sb-label">EFFECTS</span>
            </div>
            <div className="tl-sb-item si-transitions">
              <svg
                className="tl-sb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <span className="tl-sb-label">TRANSITIONS</span>
            </div>
            <div className="tl-sb-item si-color">
              <svg
                className="tl-sb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span className="tl-sb-label">COLOR</span>
            </div>
          </div>

          {/* Tracks */}
          <div className="tl-tracks" ref={tracksRef}>
            {/* Video Track - Random Width Clips */}
            <div className="tl-track">
              <div className="video-clips-row">
                {clipData.map((clip) => (
                  <div
                    key={clip.id}
                    className="v-clip"
                    style={{
                      width: `${clip.width}px`,
                      borderColor: clip.color,
                    }}
                    onMouseEnter={(e) => onClipHover(e, clip)}
                    onMouseMove={(e) => onClipHover(e, clip)}
                    onMouseLeave={() => setHoverPreview(null)}
                    title={`${clip.label} • ${clip.duration}s • Hover for preview`}
                  >
                    <img
                      className="v-clip-img"
                      src={clip.thumbnail}
                      alt={clip.label}
                      loading="lazy"
                    />
                    <div className="v-clip-overlay" />
                    <div className="v-clip-label">{clip.label}</div>
                    <div className="v-clip-duration">{clip.duration}s</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div className="tl-track">
              <div className="audio-row">
                <div className="audio-waveform">
                  <svg viewBox="0 0 870 24" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0a3a2a" />
                        <stop offset="50%" stopColor="#2ecc71" />
                        <stop offset="100%" stopColor="#0a3a2a" />
                      </linearGradient>
                    </defs>
                    <path d={wave} fill="url(#waveGrad)" opacity="0.75" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="tl-track">
              <div className="fx-row">
                <div
                  className="fx-block fx-purple"
                  style={{ width: "65px" }}
                  title="Hue/Saturation"
                >
                  ✦ HS
                </div>
                <div
                  className="fx-block fx-purple"
                  style={{ width: "105px" }}
                  title="Glitch"
                >
                  ✦ GLITCH
                </div>
                <div
                  className="fx-block fx-purple"
                  style={{ width: "135px" }}
                  title="Lens Flare"
                >
                  ✦ FLARE
                </div>
              </div>
            </div>

            {/* Transitions */}
            <div className="tl-track">
              <div className="tr-row">
                <div
                  className="tr-block tr-blue"
                  style={{ width: "95px" }}
                  title="Crossfade"
                >
                  CROSSFADE
                </div>
                <div
                  className="tr-block tr-purple"
                  style={{ width: "55px" }}
                  title="Dip"
                >
                  DIP
                </div>
                <div
                  className="tr-block tr-purple"
                  style={{ width: "35px" }}
                  title="Wipe"
                >
                  WIPE
                </div>
              </div>
            </div>

            {/* Color Grade */}
            <div className="tl-track">
              <div className="grade-row">
                <div className="grade-container">
                  <svg viewBox="0 0 870 42" preserveAspectRatio="none">
                    <defs>
                      <linearGradient
                        id="gradeGrad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#1a4a8a" />
                        <stop offset="50%" stopColor="#2a6a6a" />
                        <stop offset="100%" stopColor="#cc4422" />
                      </linearGradient>
                    </defs>
                    <path d={grade.fill} fill="url(#gradeGrad)" opacity="0.2" />
                    <path
                      d={grade.line}
                      fill="none"
                      stroke="#3a8aaa"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Preview Popup */}
            {hoverPreview && (
              <div
                className="hover-preview"
                style={{
                  left: `${hoverPreview.x}px`,
                  top: `${hoverPreview.y}px`,
                }}
              >
                <div className="hover-preview-head">
                  <span>PREVIEW</span>
                  <span className="hover-preview-clipname">
                    {hoverPreview.clip.label}
                  </span>
                </div>
                {previewLoading ? (
                  <div className="hover-preview-loading">
                    <div className="spinner" />
                  </div>
                ) : previewError ? (
                  <div className="preview-error">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <span>Preview unavailable</span>
                  </div>
                ) : (
                  <video
                    ref={previewVideoRef}
                    className="hover-preview-video"
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}
                <div className="hover-preview-foot">
                  <div className="hover-preview-time">
                    <span>{fmtTime(previewTime)}</span>
                    <span>{fmtTime(hoverPreview.clip.duration)}</span>
                  </div>
                  <div className="hover-preview-bar">
                    <span style={{ width: `${previewPct}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="tl-bottom">
          <div className="bl-left">
            <div className="snap-badge">
              <span className="val">20</span> SNAP{" "}
              <span className="state">ON</span>
            </div>
          </div>
          <div className="bc-center">
            <button
              className={`pause-indicator ${playing ? "playing" : ""}`}
              onClick={togglePlay}
              title="Play/Pause (Space)"
            >
              <div className="pause-bars">
                <span />
                <span />
              </div>
              <span>{playing ? "PLAY" : "PAUSE"}</span>
            </button>
          </div>
          <div className="br-right">
            <svg
              className="br-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              title="Grid"
            >
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            <svg
              className="br-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              title="Snap"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <div className="zoom-ctrl">
              <button className="zoom-btn" onClick={zoomOut} title="Zoom Out">
                −
              </button>
              <div className="zoom-slider" title="Zoom Level" />
              <button className="zoom-btn" onClick={zoomIn} title="Zoom In">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Timeline;
