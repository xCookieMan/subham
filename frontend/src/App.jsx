import { useEffect, useMemo, useState, useRef } from 'react'
import LoadingScreen from './components/common/LoadingScreen'
import IntroScreen from './components/common/IntroScreen'
import Navbar from './components/layout/Navbar'
import HomePage from './components/sections/HomePage'
import Timeline from './components/sections/Timeline'
import Reel from './components/sections/Reel'
import Services from './components/sections/Services'
import About from './components/sections/About'
import Contact from './components/sections/Contact'
import Work from './components/sections/Work'
import VideoEditing from './components/services/VideoEditing'
import ColorGrading from './components/services/ColorGrading'
import Documentary from './components/services/Documentary'
import VisualEffects from './components/services/VisualEffects'
import GreenScreen from './components/services/GreenScreen'
import MultiCam from './components/services/MultiCam'
import ShortForm from './components/services/ShortForm'
import Storytelling from './components/services/Storytelling'
import ScrollToTop from './components/common/ScrollToTop'
import Footer from './components/layout/Footer'

import './styles/App.css'

const MIN_DURATION_MS = 1200
const MAX_DURATION_MS = 3000

function App() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading')
  const [selectedService, setSelectedService] = useState(null)
  const particlesRef = useRef(null);

  const startedAt = useMemo(() => Date.now(), [])

  // Generate global floating particles
  useEffect(() => {
    const particleContainer = particlesRef.current;
    const linesContainer = document.querySelector('.global-geo-lines');
    if (!particleContainer) return;

    particleContainer.innerHTML = '';
    if (linesContainer) linesContainer.innerHTML = '';

    // Particles
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'global-particle';
      const size = Math.random() * 3 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--duration', `${Math.random() * 15 + 10}s`);
      p.style.setProperty('--opacity', `${Math.random() * 0.4 + 0.1}`);
      p.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
      p.style.animationDelay = `-${Math.random() * 20}s`;
      particleContainer.appendChild(p);
    }

    // Geometric Lines
    if (linesContainer) {
      for (let i = 0; i < 10; i++) {
        const l = document.createElement('div');
        l.className = 'geo-line';
        l.style.setProperty('--x', `${Math.random() * 100}%`);
        l.style.setProperty('--y', `${Math.random() * 100}%`);
        l.style.setProperty('--r', `${Math.random() * 360}deg`);
        l.style.setProperty('--d', `${Math.random() * 10 + 10}s`);
        linesContainer.appendChild(l);
      }
    }
  }, []);

  // Mouse parallax and glow follow + Custom Cursor
  useEffect(() => {
    const glow = document.querySelector('.mouse-glow');
    const dot = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Update Mouse Glow Position
      if (glow) {
        glow.style.left = `${clientX}px`;
        glow.style.top = `${clientY}px`;
      }

      // Update Custom Cursor
      if (dot && follower) {
        dot.style.left = `${clientX}px`;
        dot.style.top = `${clientY}px`;
        follower.style.left = `${clientX}px`;
        follower.style.top = `${clientY}px`;
      }

      // Check for hoverable elements
      const target = e.target;
      if (target.closest('a, button, .service-card, .reel-card, .project-card')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }

      // Parallax for Mesh
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      const bgMesh = document.querySelector('.global-bg-mesh');
      if (bgMesh) {
        bgMesh.style.transform = `translate(${x * 20}px, ${y * 20}px) scale(1.05)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  useEffect(() => {
    let alive = true
    let target = 12

    const tick = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.max(1, (target - prev) * 0.18), 97)
        return Math.round(next)
      })
    }, 60)

    const preload = new Promise((resolve) => {
      const imagePaths = ['/img/loading.png', '/img/intro.png', '/img/logo_noborder.png', '/img/timeline-reference.png']
      let loaded = 0

      const done = () => {
        loaded += 1
        if (loaded >= imagePaths.length) resolve(true)
      }

      imagePaths.forEach((path) => {
        const img = new Image()
        img.src = path
        if (img.complete) {
          done()
          return
        }
        img.onload = done
        img.onerror = done
      })
    })

    const hardStop = new Promise((resolve) => setTimeout(resolve, MAX_DURATION_MS))

    Promise.race([Promise.all([preload]), hardStop]).then(() => {
      target = 100
      const elapsed = Date.now() - startedAt
      const waitMore = Math.max(0, MIN_DURATION_MS - elapsed)

      setTimeout(() => {
        if (!alive) return
        setProgress(100)
        setTimeout(() => {
          if (alive) setPhase('intro')
        }, 220)
      }, waitMore)
    })

return () => {
      alive = false
      clearInterval(tick)
    }
  }, [startedAt])

  const scrollToTimeline = () => {
    const section = document.getElementById('timeline-section')
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSelectService = (serviceType) => {
    setSelectedService(serviceType)
    // Scroll to details section
    setTimeout(() => {
      const detailsSection = document.getElementById('details-section')
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleCloseDetails = () => {
    setSelectedService(null)
  }

  const handleNavNavigate = (href) => {
    setSelectedService(null)
    setTimeout(() => {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const element = document.querySelector(href)
      if (element) {
        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0
        const targetTop = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      }
    }, 200)
  }

  const detailComponents = {
    'video-editing': VideoEditing,
    'color-grading': ColorGrading,
    'documentary': Documentary,
    'vfx': VisualEffects,
    'green-screen': GreenScreen,
    'multicam': MultiCam,
    'short-form': ShortForm,
    'storytelling': Storytelling,
  }

  const SelectedDetail = selectedService ? detailComponents[selectedService] : null

  return (
    <>
      {/* Global Advanced Background Effects */}
      <div className="custom-cursor" />
      <div className="cursor-follower" />
      <div className="editor-scanline" />
      <div className="global-noise-overlay" />
      <div className="mouse-glow" />
      <div className="global-bg-mesh" />
      <div className="global-grid-overlay" />
      <div className="global-geo-lines" />
      <div className="global-particles" ref={particlesRef} />
      <ScrollToTop />

      {phase === 'loading' ? (
        <LoadingScreen progress={progress} />
      ) : phase === 'intro' ? (
        <IntroScreen onEnter={() => setPhase('home')} />
      ) : (
        <>
          <Navbar onNavigate={handleNavNavigate} />
          {SelectedDetail ? (
            <section id="details-section">
              <SelectedDetail onClose={handleCloseDetails} />
            </section>
          ) : (
            <>
              <section id="home"><HomePage onOpenTimeline={scrollToTimeline} /></section>
              <div style={{ marginTop: '0px', position: 'relative', zIndex: 10 }}>
                <Timeline embedded />
              </div>
              <section id="work"><Work /></section>
              <section id="reel" style={{ marginTop: '0px', position: 'relative', zIndex: 10 }}>
                <Reel />
              </section>
              <section id="about"><About /></section>
              <section id="services"><Services onSelectService={handleSelectService} /></section>
              <section id="contact"><Contact /></section>
            </>
          )}
          <section id="footer"><Footer /></section>
        </>



      )}
    </>
  )
}

export default App
