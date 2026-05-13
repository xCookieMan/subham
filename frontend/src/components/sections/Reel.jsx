import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Reel.css';


const reelsData = [
  {
    id: 1,
    title: "Cinematic Reel 01",
    thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=700&fit=crop",
    views: "1.2M",
    duration: "0:15",
    video: "https://youtube.com/shorts/bXW3er0q8hA"
  },
  {
    id: 2,
    title: "Cinematic Reel 02",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=700&fit=crop",
    views: "2.5M",
    duration: "0:30",
    video: "https://youtube.com/shorts/OBVMawHbpH8"
  },
  {
    id: 3,
    title: "Cinematic Reel 03",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop",
    views: "845K",
    duration: "0:22",
    video: "https://youtube.com/shorts/br1Xyjf0icY"
  },
  {
    id: 4,
    title: "Cinematic Reel 04",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=700&fit=crop",
    views: "1.7M",
    duration: "0:45",
    video: "https://youtube.com/shorts/XAjtlCANRg0"
  },
  {
    id: 5,
    title: "Cinematic Reel 05",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=700&fit=crop",
    views: "3.2M",
    duration: "0:18",
    video: "https://youtube.com/shorts/52g7kD0mcz0"
  },
  {
    id: 6,
    title: "Cinematic Reel 06",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=700&fit=crop",
    views: "1.1M",
    duration: "0:25",
    video: "https://youtube.com/shorts/8QWO-wNLwwE"
  },
  {
    id: 7,
    title: "Cinematic Reel 07",
    thumbnail: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400&h=700&fit=crop",
    views: "920K",
    duration: "0:20",
    video: "https://youtube.com/shorts/-20ARJFmAV8"
  }
];

function Reel() {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef(null);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    // Enhanced regex to extract YouTube ID from Shorts, Watch, or youtu.be links
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return '';
    // Use mute=1 for reliable autoplay across all browsers
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;
  };

  const playReel = (index) => {
    setIsLoading(true);
    setCurrentIndex(index);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(null);
    setIsLoading(false);
  };

  const nextReel = (e) => {
    if (e) e.stopPropagation();
    if (currentIndex < reelsData.length - 1) {
      setIsLoading(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevReel = (e) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setIsLoading(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 240,
        behavior: 'smooth'
      });
    }
  };

  const animateTitle = (title) => {
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'char space' : char === '/' ? 'char slash' : 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${0.05 * index}s`;
      title.appendChild(span);
    });
  };

  useEffect(() => {
    const title = document.getElementById('animatedTitle');
    if (title) animateTitle(title);
  }, []);

  const cardVariants = {
    hidden: { y: 40, scale: 0.92, opacity: 0 },
    visible: (index) => ({
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1
      }
    }),
    hover: { 
      y: -10, 
      scale: 1.03,
      transition: { type: "spring", stiffness: 400 }
    }
  };

  return (
    <motion.div 
      className="reel-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="section-header"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          id="animatedTitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          REELS / SHORTS
        </motion.h2>
        <motion.div 
          className="subtitle"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Fast cuts. Big impact.
        </motion.div>
        <motion.div 
          className="underline"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
        <motion.div 
          className="decorations"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="line"></div>
          <div className="dot"></div>
          <div className="line" style={{transform: 'scaleX(-1)'}}></div>
        </motion.div>
      </motion.div>

      <div className="carousel-wrapper">
        <motion.button 
          className="nav-arrow prev" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollCarousel(-1)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </motion.button>

        <div className="carousel" ref={carouselRef}>
          {reelsData.map((reel, index) => (
            <motion.div
              key={reel.id}
              className="reel-card"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={index}
              onClick={() => playReel(index)}
              whileHover="hover"
            >
              <div 
                className="reel-thumbnail" 
                style={{backgroundImage: `url(${reel.thumbnail})`}}
              />
              <div className="reel-overlay" />
              
              <div className="duration">
                <span className="duration-label">HD</span>
                {reel.duration}
              </div>

              <div className="play-icon">
                <svg viewBox="0 0 24 24">
                  <polygon points="6,3 20,12 6,21"/>
                </svg>
              </div>

              <div className="reel-content-bottom">
                <h3 className="reel-title-text">{reel.title}</h3>
                <div className="view-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {reel.views}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button 
          className="nav-arrow next" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollCarousel(1)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {currentIndex !== null && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content reel-player-mode"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Arrows (Vertical Style) */}
              <button className="reel-nav-btn up" onClick={(e) => prevReel(e)} disabled={currentIndex === 0}>
                <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
              </button>
              <button className="reel-nav-btn down" onClick={(e) => nextReel(e)} disabled={currentIndex === reelsData.length - 1}>
                <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
              </button>

              <div className="video-container">
                {isLoading && (
                  <div className="reel-loader">
                    <div className="loader-spinner"></div>
                    <span>BUFFERING CINEMATIC...</span>
                  </div>
                )}
                <iframe
                  key={reelsData[currentIndex].video}
                  src={getEmbedUrl(reelsData[currentIndex].video)}
                  title={reelsData[currentIndex].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className={`modal-video-iframe ${isLoading ? 'hidden' : 'visible'}`}
                  onLoad={() => setIsLoading(false)}
                ></iframe>

                {/* Mobile UI Overlay */}
                <div className="reel-ui-overlay">
                  <div className="reel-info">
                    <h3 className="reel-title">{reelsData[currentIndex].title}</h3>
                    <p className="reel-tags">#edit #cinematic #vibes</p>
                    <a 
                      href={reelsData[currentIndex].video} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="yt-metrics-link"
                    >
                      VIEW REAL STATS ON YOUTUBE →
                    </a>
                  </div>

                  <div className="reel-actions">
                    <div className="action-item">
                      <div className="action-icon">❤</div>
                      <span>YT LIVE</span>
                    </div>
                    <div className="action-item">
                      <div className="action-icon">💬</div>
                      <span>YT LIVE</span>
                    </div>
                    <div className="action-item">
                      <div className="action-icon">↗</div>
                      <span>SHARE</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="modal-close" onClick={(e) => closeModal(e)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Reel;

