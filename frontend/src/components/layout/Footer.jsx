 import { useEffect, useRef } from 'react';
import '../../styles/Footer.css';

function Footer() {
  const particlesRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const particleContainer = particlesRef.current;
    if (!particleContainer) return;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = (10 + Math.random() * 10) + 's';
      particleContainer.appendChild(p);
    }
  }, []);

  // Scroll to top
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mouse parallax on background mesh
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const bgMesh = document.querySelector('.bg-mesh');
      if (bgMesh) {
        bgMesh.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <footer className="footer">
      <div className="bg-mesh" />
      <div className="grid-overlay" />
      <div className="particles" ref={particlesRef} />

      <div className="footer-top">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/img/logo_noborder.png" alt="AK Logo" />
          </div>
          <p className="footer-tagline">
            I craft cinematic stories that connect, inspire and leave a lasting impact.
          </p>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <div className="footer-col-title">Explore</div>
          <a href="#home">Home</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Services */}
        <div className="footer-col">
          <div className="footer-col-title">Services</div>
          <a href="#services">Video Editing</a>
          <a href="#services">Color Grading</a>
          <a href="#services">Sound Design</a>
          <a href="#services">Visual Effects</a>
          <a href="#services">Short Form</a>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <div className="footer-col-title">Resources</div>
          <a href="#process">Process</a>
          <a href="#tools">Tools</a>
        </div>

        {/* Connect (Social Media) */}
        <div className="footer-col connect">
          <div className="footer-col-title">Connect</div>
          <a href="https://www.instagram.com/shubhampandey_clicker?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-link instagram">
            <div className="social-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            <span>Instagram</span>
          </a>
          <a href="https://www.youtube.com/@subham-i1r" target="_blank" rel="noopener noreferrer" className="social-link youtube">
            <div className="social-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </div>
            <span>YouTube</span>
          </a>
          <a href="https://linkedin.com/in/subham-kumar-bhargav-6107b43a8" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
            <div className="social-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-copyright">
© 2026 <span>Subham</span>. ALL RIGHTS RESERVED.
        </div>
        <div className="footer-legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
