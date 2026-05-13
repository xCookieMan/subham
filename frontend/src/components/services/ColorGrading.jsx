import { useEffect, useRef, useState } from 'react'
import '../../styles/ColorGrading.css'

// Service-specific content
const serviceContent = {
  'video-editing': {
    title: 'Video Editing',
    subtitle: 'Precision Cutting & Pacing',
    description: 'Mastering the art of "The Invisible Cut". I craft seamless sequences that maintain viewer engagement and drive the narrative forward with perfect rhythmic pacing.',
    features: ['Dynamic Storytelling', 'Rhythmic Pacing', 'Advanced Sound Design', 'Seamless Transitions'],
    color: '#4a9eff',
    practiceLink: '/practice/videoservice.html',
    beforeImg: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'RAW CLIPS',
    afterLabel: 'FINAL CUT'
  },
  'color-grading': {
    title: 'Color Grading',
    subtitle: 'Cinematic Visual Science',
    description: 'Transforming flat digital data into emotive visual poetry. I specialize in color science that enhances mood, directs focus, and gives your project a premium look.',
    features: ['Custom LUT Creation', 'Skin Tone Recovery', 'Mood & Tone Shaping', 'Shot Matching'],
    color: '#c77dff',
    practiceLink: '/practice/colorgrading.html',
    beforeImg: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80&sat=-100',
    afterImg: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'LOG FOOTAGE',
    afterLabel: 'CINEMATIC GRADE'
  },
  'documentary': {
    title: 'Docu-Editing',
    subtitle: 'Narrative Truth & Impact',
    description: 'Sifting through hours of footage to find the heart of the story. I edit documentaries and news that resonate with authenticity and powerful pacing.',
    features: ['Interview Shaping', 'Archival Integration', 'Impactful Pacing', 'Authentic Voice'],
    color: '#ff6b6b',
    practiceLink: '/practice/documentnews.html',
    beforeImg: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'INTERVIEW RAW',
    afterLabel: 'STORY ARC'
  },
  'vfx': {
    title: 'Visual Effects',
    subtitle: 'Compositing & Magic',
    description: 'Adding layers of wonder to reality. From clean plate removals to complex 3D compositing, I enhance the visual world of your project.',
    features: ['Motion Tracking', 'Digital Compositing', 'Asset Integration', 'Clean-up'],
    color: '#5b8dee',
    practiceLink: '/practice/visuleffects.html',
    beforeImg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1449156001433-401f3089d895?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'PLATE',
    afterLabel: 'VFX COMP'
  },
  'green-screen': {
    title: 'Green Screen',
    subtitle: 'Chroma Key Mastery',
    description: 'Flawless keying and environment replacement. I ensure natural spill suppression and edge refinement for believable composite results.',
    features: ['Perfect Keying', 'Environment Lighting', 'Edge Refinement', 'Believable Integration'],
    color: '#44dd77',
    practiceLink: '/practice/greenscreen.html',
    beforeImg: 'https://images.unsplash.com/photo-1626379953822-baec19c3bbcd?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'CHROMA KEY',
    afterLabel: 'COMPOSITE'
  },
  'multicam': {
    title: 'Multi-Cam',
    subtitle: 'Synchronized Direction',
    description: 'Managing complex multi-angle productions. I handle live event editing and interview syncs with a focus on capturing every critical moment.',
    features: ['Angle Selection', 'Audio-Sync Master', 'Multi-View Workflow', 'Live Event Pace'],
    color: '#dd66aa',
    practiceLink: '/practice/multicamera.html',
    beforeImg: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'CAM A',
    afterLabel: 'SWITCHED EDIT'
  },
  'short-form': {
    title: 'Short Form',
    subtitle: 'Social Hook Mastery',
    description: 'Editing for the "Scroll-Stopping" effect. I create high-energy Reels, Shorts, and TikToks designed to hook viewers and boost retention.',
    features: ['Hook Optimization', 'Dynamic Captions', 'Trend Integration', 'Retention Edits'],
    color: '#9966ff',
    practiceLink: '/practice/shortform.html',
    beforeImg: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'RAW VIDEO',
    afterLabel: 'VIRAL REEL'
  },
  'storytelling': {
    title: 'Storytelling',
    subtitle: 'The Heart of Visuals',
    description: 'Beyond the technical cuts, I build emotional bridges. Every frame is chosen to evoke a specific feeling and connect with your audience.',
    features: ['Emotional Arc', 'Character Focus', 'Thematic Pacing', 'Visual Narrative'],
    color: '#ff9944',
    practiceLink: '/practice/storytelling.html',
    beforeImg: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?auto=format&fit=crop&w=1600&q=80',
    beforeLabel: 'FOOTAGE',
    afterLabel: 'EMOTION'
  }
};

function Details({ serviceType, onClose }) {
  const sliderRef = useRef(null)
  const maskRef = useRef(null)
  const afterImgRef = useRef(null)
  const handleRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeCam, setActiveCam] = useState(0)

  const content = serviceContent[serviceType] || serviceContent['video-editing']

  // Visual Stage Components
  const SliderStage = () => (
    <div
      className="viewfinder-wrapper slider-mode"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="bracket b-tl"></div><div className="bracket b-tr"></div>
      <div className="bracket b-bl"></div><div className="bracket b-br"></div>
      <img src={content.beforeImg} className="img-before" alt="Original" />
      <div className="label-badge lbl-before">{content.beforeLabel}</div>
      <div className="img-after-mask" ref={maskRef}>
        <img ref={afterImgRef} src={content.afterImg} alt="Processed" />
        <div className="label-badge lbl-after">{content.afterLabel}</div>
      </div>
      <div className="slider-handle" ref={handleRef}>
        <div className="handle-circle"></div>
      </div>
    </div>
  )

  const MultiCamStage = () => {
    const [isSwitching, setIsSwitching] = useState(false);

    const handleCamSwitch = (i) => {
      if (i === activeCam) return;
      setIsSwitching(true);
      setActiveCam(i);
      setTimeout(() => setIsSwitching(false), 200);
    };

    return (
      <div className="viewfinder-wrapper multicam-mode">
        <div className="multicam-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`cam-feed ${activeCam === i ? 'active' : ''}`} onClick={() => handleCamSwitch(i)}>
              <img src={i === 0 ? content.afterImg : `https://images.unsplash.com/photo-${1500 + i * 100}?auto=format&fit=crop&w=400`} alt={`Cam ${i}`} />
              <div className="cam-label">CAM 0{i+1}</div>
            </div>
          ))}
        </div>
        <div className={`main-program ${isSwitching ? 'switching' : ''}`}>
          <img src={activeCam === 0 ? content.afterImg : `https://images.unsplash.com/photo-${1500 + activeCam * 100}?auto=format&fit=crop&w=800`} alt="Program" />
          <div className="program-label">LIVE • PROGRAM</div>
        </div>
      </div>
    );
  };

  const MobileStage = () => (
    <div className="viewfinder-wrapper mobile-mode">
      <div className="phone-frame">
        <div className="phone-screen">
          <img src={content.afterImg} alt="Short Form" />
          <div className="phone-ui">
            <div className="ui-side">
              <div className="ui-icon">❤</div>
              <div className="ui-icon">💬</div>
              <div className="ui-icon">↗</div>
            </div>
            <div className="ui-bottom">
              <div className="ui-user">@pro_editor</div>
              <div className="ui-desc">{content.subtitle} #editing #cinematic</div>
            </div>
          </div>
        </div>
      </div>
      <div className="label-badge">{content.afterLabel}</div>
    </div>
  )

  const TimelineStage = () => (
    <div className="viewfinder-wrapper timeline-mode">
      <div className="preview-monitor">
        <img src={content.afterImg} alt="Preview" />
        <div className="timecode">00:12:45:12</div>
      </div>
      <div className="mini-timeline">
        <div className="track video-track">
          <div className="clip" style={{ width: '30%', background: '#4a9eff' }}>Clip_01</div>
          <div className="clip" style={{ width: '40%', background: '#35a4ff' }}>Clip_02</div>
          <div className="clip" style={{ width: '20%', background: '#4a9eff' }}>Clip_03</div>
        </div>
        <div className="track audio-track">
          <div className="clip-audio" style={{ width: '100%' }}>Music_Bed.wav</div>
        </div>
        <div className="playhead"></div>
      </div>
    </div>
  )

  const VfxStage = () => (
    <div className="viewfinder-wrapper vfx-mode">
      <div className="vfx-canvas">
        <img src={content.afterImg} alt="VFX" />
        <div className="vfx-nodes">
          <div className="node" style={{ top: '20%', left: '10%' }}>Source</div>
          <div className="node" style={{ top: '40%', left: '30%' }}>Keyer</div>
          <div className="node" style={{ top: '30%', left: '55%' }}>Tracker</div>
          <div className="node" style={{ top: '50%', left: '80%' }}>Merge</div>
          <svg className="node-lines">
            <line x1="15%" y1="25%" x2="30%" y2="45%" stroke="white" strokeWidth="1" />
            <line x1="35%" y1="45%" x2="55%" y2="35%" stroke="white" strokeWidth="1" />
            <line x1="60%" y1="35%" x2="80%" y2="55%" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>
      <div className="label-badge">NODE GRAPH VIEW</div>
    </div>
  )

  const renderVisualStage = () => {
    switch(serviceType) {
      case 'multicam': return <MultiCamStage />;
      case 'short-form': return <MobileStage />;
      case 'video-editing': 
      case 'storytelling': 
      case 'documentary': return <TimelineStage />;
      case 'vfx': return <VfxStage />;
      default: return <SliderStage />;
    }
  }

  const updateSlider = (clientX) => {
    if (!sliderRef.current || !maskRef.current || !handleRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    let x = clientX - rect.left

    if (x < 0) x = 0
    if (x > rect.width) x = rect.width

    const percent = (x / rect.width) * 100

    maskRef.current.style.width = percent + '%'
    handleRef.current.style.left = percent + '%'

    if (afterImgRef.current) {
      afterImgRef.current.style.width = rect.width + 'px'
    }
  }

  // Handle drag
  const handleMouseDown = (e) => {
    setIsDragging(true)
    updateSlider(e.clientX)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) updateSlider(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Handle touch
  const handleTouchStart = (e) => {
    setIsDragging(true)
    updateSlider(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging) updateSlider(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current && afterImgRef.current) {
        afterImgRef.current.style.width = sliderRef.current.getBoundingClientRect().width + 'px'
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play animation on mount
  useEffect(() => {
    setTimeout(() => {
      if (!sliderRef.current || !maskRef.current || !handleRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      if (afterImgRef.current) {
        afterImgRef.current.style.width = rect.width + 'px'
      }

      // Auto-Play Animation
      let start = 20
      let end = 80
      let duration = 2000
      let startTime = null

      function animate(time) {
        if (!startTime) startTime = time
        let progress = (time - startTime) / duration

        if (progress < 1) {
          let ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
          let val = start + (end - start) * ease

          if (maskRef.current && handleRef.current) {
            maskRef.current.style.width = val + '%'
            handleRef.current.style.left = val + '%'
          }

          requestAnimationFrame(animate)
        } else {
          if (maskRef.current && handleRef.current) {
            // Reset to center smoothly
            maskRef.current.style.width = '50%'
            handleRef.current.style.left = '50%'
          }
        }
      }
      requestAnimationFrame(animate)
    }, 500)
  }, [])

// Dynamic styles based on service type
  const accentColor = content.color;

  return (
    <section className="details-section" style={{ '--accent-color': accentColor }}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="noise-overlay"></div>

      <div className="portfolio-stage">
        {/* Left Side */}
        <div className="text-content">
          <h1>
            {content.title}<br />
            <span>{content.subtitle}</span>
          </h1>
          <p>{content.description}</p>
          <div className="features-list">
            {content.features.map((feature, i) => (
              <span key={i} className="feature-tag">{feature}</span>
            ))}
          </div>
          <a 
            href={content.practiceLink} 
            className="cta-btn" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            GO TO PRACTICE
          </a>
        </div>

        {/* Right Side (Visual Stage) */}
        {renderVisualStage()}
      </div>
    </section>
  )
}

export default Details
