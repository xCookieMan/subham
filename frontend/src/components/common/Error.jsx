import { useState, useEffect, useRef } from 'react';
import '../../styles/Error.css';

function Error() {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const totalFramesRef = useRef(Math.floor(Math.random() * 50000));
  const errorContainerRef = useRef(null);

  // Timecode animation
  useEffect(() => {
    const interval = setInterval(() => {
      totalFramesRef.current++;
      const f = totalFramesRef.current % 24;
      const s = Math.floor(totalFramesRef.current / 24) % 60;
      const m = Math.floor(totalFramesRef.current / (24 * 60)) % 60;
      const h = Math.floor(totalFramesRef.current / (24 * 60 * 60)) % 24;

      setTimecode(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
      );
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Random glitch burst effect
  useEffect(() => {
    const randomGlitchBurst = () => {
      const delay = Math.random() * 15000 + 8000;

      setTimeout(() => {
        if (errorContainerRef.current) {
          const duration = 200 + Math.random() * 300;
          const digits = errorContainerRef.current.querySelectorAll('.digit');
          digits.forEach((d) => {
            d.style.transform = `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 4}px)`;
            d.style.opacity = 0.7 + Math.random() * 0.3;
          });

          setTimeout(() => {
            digits.forEach((d) => {
              d.style.transform = '';
              d.style.opacity = '';
            });
          }, duration);
        }

        randomGlitchBurst();
      }, delay);
    };

    randomGlitchBurst();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      const bg = document.querySelector('.cinema-bg');
      if (bg) {
        bg.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }

      const digits = document.querySelectorAll('.digit');
      digits.forEach((d, i) => {
        const factor = (i - 1) * 3;
        d.style.margin = `${y * factor}px ${x * factor}px`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Button press effect
  const handleMouseDown = (e) => {
    e.currentTarget.style.transform = 'scale(0.96) translateY(0)';
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="cinema-bg" />
        <div className="grain" />
        <div className="scanlines" />
        <div className="scan-beam" />

        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />

        <div className="error-wrapper">
          <div className="error-code-container" ref={errorContainerRef}>
            <div className="glitch-layer glitch-layer-1">404</div>
            <div className="glitch-layer glitch-layer-2">404</div>
            <div className="glitch-layer glitch-layer-3">404</div>

            <div className="error-code">
              <span className="digit">4</span>
              <span className="digit">0</span>
              <span className="digit">4</span>
            </div>

            <div className="error-reflection">
              <div className="error-code">
                <span className="digit">4</span>
                <span className="digit">0</span>
                <span className="digit">4</span>
              </div>
            </div>
          </div>

          <div className="error-subtitle">Frame Not Found</div>
          <div className="divider" />
          <p className="error-desc">
            Looks like this scene doesn't exist.
            <span>Let's get you back on track.</span>
          </p>

          <a href="/" className="back-btn" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <span>Back to Home</span>
            <i className="ri-arrow-right-up-line" />
          </a>
        </div>

        <div className="bottom-bar">
          <div className="bottom-item rec">REC</div>
          <div className="separator" />
          <div className="bottom-item timecode">{timecode}</div>
          <div className="separator" />
          <div className="bottom-item err">ERR: 404</div>
        </div>
      </div>
    </div>
  );
}

export default Error;
