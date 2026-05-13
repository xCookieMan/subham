import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../styles/About.css';

function About() {
  const [particles, setParticles] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const particleId = useRef(0);

  // Floating particles effect
  useEffect(() => {
    const colors = [
      'rgba(74, 158, 255, 0.6)',
      'rgba(255, 102, 68, 0.6)',
      'rgba(199, 125, 255, 0.6)',
      'rgba(68, 221, 119, 0.6)',
    ];

    const spawnParticle = () => {
      const id = particleId.current++;
      const x = Math.random() * window.innerWidth;
      const size = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 4 + 3;

      setParticles(prev => [...prev, { id, x, size, color, duration }]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, duration * 1000);
    };

    const interval = setInterval(spawnParticle, 300);

    // Initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnParticle, i * 100);
    }

    return () => clearInterval(interval);
  }, []);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { number: '6+', label: 'Years Experience', target: 6, suffix: '+' },
    { number: '200+', label: 'Projects Done', target: 200, suffix: '+' },
    { number: '50+', label: 'Happy Clients', target: 50, suffix: '+' },
    { number: '10M+', label: 'Views Generated', target: 10, suffix: 'M+' },
  ];

  return (
    <motion.div
      className="about-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="hero">
        {/* Background */}
        <div className="hero-bg" />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: `${particle.x}px`,
              bottom: '-10px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
              animation: `floatUp ${particle.duration}s linear forwards`,
            }}
          />
        ))}

        {/* Left Content */}
        <motion.div className="hero-content" variants={fadeInLeft}>
          <div className="about-label">
            <span className="arrow">▸</span>
            ABOUT ME
          </div>

          <h1 className="hero-heading">
            I DON'T JUST EDIT<br />
            VIDEOS, I <span className="highlight">CRAFT</span><br />
            EXPERIENCES
          </h1>

          <p className="hero-description">
            I'm a Video Editor & Post-Production Specialist with
            6+ years of experience. I help brands, filmmakers
            and creators turn raw footage into powerful
            visual stories that connect.
          </p>

          <motion.div className="stats-row" ref={statsRef} variants={fadeInUp}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">
                  {statsVisible ? stat.number : '0' + stat.suffix}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image - Camera Lens Design */}
        <motion.div
          className="hero-image-wrapper"
          variants={fadeInRight}
          transition={{ delay: 0.5 }}
        >
          <div className="camera-lens-container">
            <div className="lens-shutter"></div>
            <div className="lens-glass">
              <img
                src="/img/main.png"
                alt="Cinematic Professional"
                className="person-img-lens"
                onError={(e) => {
                  console.log("Image load failed, trying home.png fallback");
                  e.target.src = "/img/home.png";
                }}
              />
              <div className="lens-reflection"></div>
            </div>
            <div className="lens-ring outer"></div>
            <div className="lens-ring middle">
              <span className="lens-text">35MM F/1.4G</span>
              <span className="lens-text bottom">NANO CRYSTAL COAT</span>
            </div>
            <div className="lens-ring inner"></div>
            <div className="focus-brackets">
              <div className="bracket tl"></div>
              <div className="bracket tr"></div>
              <div className="bracket bl"></div>
              <div className="bracket br"></div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

export default About;
