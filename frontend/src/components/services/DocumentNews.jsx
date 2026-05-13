import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../styles/DocumentNews.css';

function DocumentNews({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentSubject, setCurrentSubject] = useState(0);
  const playIntervalRef = useRef(null);

  const subjects = [
    { seed: 'docmain', name: 'MARTHA CHEN', role: 'Documenting the Unseen' },
    { seed: 'doc2', name: 'DR. JAMES WILSON', role: 'Historical Analyst' },
    { seed: 'doc5', name: 'ARCHIVAL FOOTAGE', role: '1968 — Civil Rights Era' },
    { seed: 'doc6', name: 'SARAH MITCHELL', role: 'Field Researcher' }
  ];

  const clipsData = [
    { seed: 'doc1', label: 'Martha Interview', dur: '04:23' },
    { seed: 'doc2', label: 'Archival 1960s', dur: '01:45' },
    { seed: 'doc3', label: 'On-location B-Roll', dur: '02:10' },
    { seed: 'doc4', label: 'Map Animation', dur: '00:30' },
    { seed: 'doc5', label: 'Historical Photos', dur: '01:15' },
    { seed: 'doc6', label: 'Expert Interview', dur: '03:42' },
    { seed: 'doc7', label: 'B-Roll Diverse', dur: '02:05' },
    { seed: 'doc8', label: 'Specific Graphics', dur: '00:45' },
    { seed: 'doc9', label: 'Nantucket Coast', dur: '01:50' },
    { seed: 'doc10', label: 'Lower Thirds Pack', dur: '00:20' },
  ];

  const trackData = [
    {
      name: 'Interview',
      color: '#6b4c3b',
      clips: [
        { start: 0, w: 40, label: 'Martha Chen Int.' },
        { start: 40, w: 25, label: 'Expert Interview' },
        { start: 65, w: 35, label: 'Martha Chen Int.' }
      ]
    },
    {
      name: 'B-Roll',
      color: '#3b5b4c',
      clips: [
        { start: 10, w: 20, label: 'Archival' },
        { start: 30, w: 15, label: 'Location' },
        { start: 50, w: 25, label: 'Historical' },
        { start: 80, w: 20, label: 'B-Roll' }
      ]
    },
    {
      name: 'Lower Thirds',
      color: '#3b4c5b',
      clips: [
        { start: 0, w: 8, label: 'LT: Martha' },
        { start: 40, w: 6, label: 'LT: Expert' },
        { start: 65, w: 8, label: 'LT: Martha' }
      ]
    },
    {
      name: 'Archival',
      color: '#4c3b5b',
      clips: [
        { start: 15, w: 15, label: '1960s Archive' },
        { start: 55, w: 20, label: 'Photos' }
      ]
    },
    {
      name: 'Score Track',
      color: '#5b3b4c',
      clips: [
        { start: 0, w: 100, label: '🎵 Score: Underscore' }
      ]
    },
    {
      name: 'Ambience',
      color: '#4b5563',
      clips: [
        { start: 0, w: 100, label: '🔊 Room Tone / Ambience' }
      ]
    }
  ];

  useEffect(() => {
    // Entrance animations on mount
    const timer = setTimeout(() => {
      document.getElementById('badge')?.classList.add('visible');
    }, 200);

    setTimeout(() => {
      document.getElementById('line1')?.classList.add('typed');
    }, 400);

    setTimeout(() => {
      document.getElementById('line1')?.classList.add('done');
      document.getElementById('line2')?.classList.add('typed');
    }, 1200);

    setTimeout(() => {
      document.getElementById('line2')?.classList.add('done');
    }, 2000);

    setTimeout(() => {
      document.getElementById('desc')?.classList.add('visible');
    }, 1400);

    document.querySelectorAll('.ftag').forEach((t, i) => {
      setTimeout(() => t.classList.add('visible'), 1600 + i * 80);
    });

    setTimeout(() => {
      document.getElementById('ctaBtn')?.classList.add('visible');
    }, 2000);

    setTimeout(() => {
      document.getElementById('docEditor')?.classList.add('visible');
    }, 600);

    // Film strip animation
    setTimeout(() => {
      document.querySelectorAll('.clip-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('film-in'), 1200 + i * 80);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatTC = (pct) => {
    const totalSec = 869;
    const sec = Math.floor((pct / 100) * totalSec);
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    const f = String(Math.floor((pct % 1) * 30)).padStart(2, '0');
    return `00:${m}:${s}:${f}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const next = prev + 0.06;
          if (next > 100) return 0;
          
          let idx = next < 25 ? 0 : next < 50 ? 1 : next < 75 ? 2 : 3;
          if (idx !== currentSubject) {
            setCurrentSubject(idx);
          }
          
          return next;
        });
      }, 100);
    } else {
      clearInterval(playIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => clearInterval(playIntervalRef.current);
  }, []);

  return (
    <motion.div
      className="document-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grain"></div>
      <canvas id="bg-canvas"></canvas>

      <main className="app">
        {/* LEFT */}
        <div className="left">
          <div className="badge" id="badge">
            <span className="pulse-dot"></span>
            Journalism & Documentary
          </div>
          <h1 className="title" id="title">
            <span className="line" id="line1"><span>DOCUMENTARY</span></span>
            <span className="line" id="line2"><span>& NEWS EDITOR</span></span>
          </h1>
          <p className="desc" id="desc">
            I produce impactful and compelling documentary narratives and news stories. My work focuses on rigorous
            journalistic integrity, thoughtful storytelling, and <span className="hl">precise editing</span> to uncover
            the truth and engage audiences. From feature documentaries to fast-paced segments, I craft narratives
            that inform, educate, and provoke thought.
          </p>
          <div className="ftags">
            <span className="ftag">Deep-Research</span>
            <span className="ftag">Interview Cutting</span>
            <span className="ftag">Story Arcs</span>
            <span className="ftag">Fact-Checked</span>
            <span className="ftag">Dynamic Pacing</span>
          </div>
          <button className="cta" id="ctaBtn" onClick={onBack}>
            <div className="fill"></div>
            <span>BACK TO SERVICES</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="doc-editor" id="docEditor">
            <div className="menu-bar">
              <div className="menu-item">File</div>
              <div className="menu-item">Edit</div>
              <div className="menu-item active">Documentary</div>
              <div className="menu-item">Archive</div>
              <div className="menu-item">View</div>
              <div className="menu-item">Export</div>
              <div className="menu-spacer"></div>
              <span className="menu-time">{formatTC(progress)}</span>
            </div>

            <div className="workspace">
              <div className="viewer-side">
                {/* Viewer */}
                <div className="viewer-area">
                  <div className="viewer-img-wrap">
                    <img 
                      src={`https://picsum.photos/seed/${subjects[currentSubject].seed}/1200/700`} 
                      alt="Documentary Interview"
                    />
                  </div>
                  <div className="viewer-overlay">
                    <div className="viewer-play" onClick={togglePlay}>
                      <svg viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  {/* Lower Third */}
                  <div className="lower-third visible">
                    <div className="lt-line"></div>
                    <div className="lt-name">{subjects[currentSubject].name}</div>
                    <div className="lt-role">{subjects[currentSubject].role}</div>
                  </div>
                  <div className="viewer-info">
                    <span className="rec-badge">REC</span>
                    <span>4K 24fps</span>
                    <span>LOG</span>
                  </div>
                </div>

                {/* Clips Strip */}
                <div className="clips-area">
                  <div className="clips-header">
                    <span>Interviews & B-Roll</span>
                    <span style={{ color: 'var(--accent)' }}>{clipsData.length} clips</span>
                  </div>
                  <div className="clips-scroll">
                    {clipsData.map((c, i) => (
                      <div className="clip-card" key={i}>
                        <div className="thumb">
                          <img src={`https://picsum.photos/seed/${c.seed}/200/130`} alt={c.label} />
                        </div>
                        <div className="clip-label">{c.label}</div>
                        <div className="clip-dur">{c.dur}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bin Panel */}
              <div className="bin-panel">
                <div className="panel-label">Project Bin</div>
                <div className="bin-list">
                  <div className="bin-item"><span className="icon video">🎬</span>Interviews<span className="count">12</span></div>
                  <div className="bin-item"><span className="icon video">🎬</span>B-Roll<span className="count">24</span></div>
                  <div className="bin-item"><span className="icon video">🎬</span>Archival Footage<span className="count">8</span></div>
                  <div className="bin-item"><span className="icon audio">🎵</span>Interview Audio<span className="count">12</span></div>
                  <div className="bin-item"><span className="icon audio">🎵</span>Score & Ambience<span className="count">6</span></div>
                  <div className="bin-item"><span className="icon graphic">📊</span>Graphics & Maps<span className="count">15</span></div>
                  <div className="bin-item"><span className="icon map">🗺️</span>Lower Thirds<span className="count">18</span></div>
                  <div className="bin-item"><span className="icon graphic">📊</span>On-Screen Text<span className="count">9</span></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-area">
              <div className="tl-toolbar">
                <div className={`tl-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>▶</div>
                <div className="tl-btn">⏮</div>
                <div className="tl-btn">⏭</div>
                <div className="tl-btn">↻</div>
                <span className="tl-time">{formatTC(progress)}</span>
                <div className="tl-spacer"></div>
                <span style={{ fontSize: '0.5rem', color: 'var(--muted)' }}>Seq: Martha_Chen_Doc_v3</span>
              </div>
              <div className="tl-tracks">
                <div className="tl-ruler">
                  {[...Array(11)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`tick ${i % 5 === 0 ? 'major' : ''}`}
                      style={{ left: `${i * 10}%` }}
                    ></div>
                  ))}
                </div>
                <div className="tl-tracks-inner">
                  {trackData.map((track, idx) => (
                    <div className="tl-track" key={idx}>
                      <div className="tl-track-label">
                        <span className="dot" style={{ backgroundColor: track.color }}></span>
                        {track.name}
                      </div>
                      <div className="tl-track-content">
                        {track.clips.map((clip, i) => {
                          const cls = track.name === 'Score Track' ? 'clip-score' :
                            track.name === 'Ambience' ? 'clip-audio' :
                              track.name === 'Lower Thirds' ? 'clip-lower' :
                                track.name === 'Archival' ? 'clip-archival' :
                                  track.name === 'B-Roll' ? 'clip-broll' : 'clip-interview';
                          return (
                            <div 
                              key={i} 
                              className={`tl-clip ${cls}`}
                              style={{ left: `${clip.start}%`, width: `${clip.w}%` }}
                            >
                              <span>{clip.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tl-playhead" style={{ left: `${progress}%` }}></div>
              </div>
            </div>

            <div className="status-bar">
              <div><span style={{ color: '#22c55e' }}>●</span> Online</div>
              <div>Tracks: {trackData.length}</div>
              <div>Dur: {formatTC(100)}</div>
              <div><span style={{ color: '#eab308' }}>●</span> Audio Peaks</div>
            </div>
          </div>
          
          <div className="carousel">
            <div className="c-arrow">‹</div>
            <div className="c-dots">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className={`c-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                ></div>
              ))}
            </div>
            <div className="c-arrow">›</div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default DocumentNews;
