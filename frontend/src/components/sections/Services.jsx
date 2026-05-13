import { useRef } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Services.css';

function Services({ onSelectService }) {
  const cardRefs = useRef([]);

  const createParticles = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getComputedStyle(card).getPropertyValue('--color').trim();

    for (let i = 0; i < 8; i += 1) {
      const particle = document.createElement('div');
      particle.className = 'service-particle';
      particle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${color};
        --tx: ${Math.random() * 200 - 100}px;
        --ty: ${Math.random() * 200 - 100}px;
      `;
      card.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  };

  const handleCardClick = (serviceType) => {
    if (onSelectService) {
      onSelectService(serviceType);
    }
  };

  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] },
    },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut', delay: 0.2 } },
  };

  const cards = [
    {
      title: 'Video Editing',
      desc: 'Cutting, trimming & sequencing with precision.',
      color: '#4a9eff',
      hoverColor: '#60b0ff',
      glow: 'rgba(74, 158, 255, 0.5)',
      type: 'video-editing',
      practiceLink: '/practice/videoservice.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Color Grading',
      desc: 'Cinematic color correction & mood enhancement.',
      color: '#c77dff',
      hoverColor: '#df99ff',
      glow: 'rgba(199, 125, 255, 0.5)',
      type: 'color-grading',
      practiceLink: '/practice/colorgrading.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 12 2.1 12.05" />
          <path d="M12 12 9.5 19.5" />
        </svg>
      ),
    },
    {
      title: 'Documentary & News Editing',
      desc: 'Compelling narratives & fast-paced news content.',
      color: '#ff6b6b',
      hoverColor: '#ff8585',
      glow: 'rgba(255, 107, 107, 0.5)',
      type: 'documentary',
      practiceLink: '/practice/documentnews.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
          <circle cx="15" cy="15" r="3" />
          <path d="M15 12v6" />
          <path d="M12 15h6" />
        </svg>
      ),
    },
    {
      title: 'Visual Effects',
      desc: 'Transitions, VFX & compositing for impact.',
      color: '#5b8dee',
      hoverColor: '#7aaaff',
      glow: 'rgba(91, 141, 238, 0.5)',
      type: 'vfx',
      practiceLink: '/practice/visuleffects.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Green Screen',
      desc: 'Chroma key & background replacement.',
      color: '#44dd77',
      hoverColor: '#66ff99',
      glow: 'rgba(68, 221, 119, 0.5)',
      type: 'green-screen',
      practiceLink: '/practice/greenscreen.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Multi Camera Editing',
      desc: 'Multi-cam sync & professional editing.',
      color: '#dd66aa',
      hoverColor: '#ff88cc',
      glow: 'rgba(221, 102, 170, 0.5)',
      type: 'multicam',
      practiceLink: '/practice/multicamera.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
          <path d="M12 17v4" />
          <path d="M8 21h8" />
        </svg>
      ),
    },
    {
      title: 'Short Form Editing',
      desc: 'Reels, shorts & social media content that hooks.',
      color: '#9966ff',
      hoverColor: '#bb88ff',
      glow: 'rgba(153, 102, 255, 0.5)',
      type: 'short-form',
      practiceLink: '/practice/shortform.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <path d="M12 18h.01" />
          <path d="M9 6h6" />
          <path d="M9 10h6" />
          <path d="M9 14h6" />
        </svg>
      ),
    },
    {
      title: 'Storytelling',
      desc: 'Building emotions through powerful visual narrative.',
      color: '#ff9944',
      hoverColor: '#ffb377',
      glow: 'rgba(255, 153, 68, 0.5)',
      type: 'storytelling',
      practiceLink: '/practice/storytelling.html',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.5 1.5" />
          <path d="M7.11 7.11l5-5" />
          <path d="M11 11l5-5" />
        </svg>
      ),
    },
  ];

  return (
    <motion.section 
      className="services-page reveal-on-scroll" 
      id="services"
      variants={containerVariants} 
      initial="hidden" 
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="header">
        <motion.h1 variants={fadeInDown}>WHAT I DO</motion.h1>
        <motion.p variants={fadeInUp}>Professional post-production services</motion.p>
      </div>

      <div className="services-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.type}
            className="service-card"
            style={{
              '--color': card.color,
              '--hover-color': card.hoverColor,
              '--glow': card.glow,
            }}
            ref={(el) => (cardRefs.current[index] = el)}
            variants={cardVariants}
            onClick={(e) => {
              createParticles(e, e.currentTarget);
              handleCardClick(card.type);
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="service-icon-wrapper">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default Services;
