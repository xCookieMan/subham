import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Work.css';


const projects = [
  {
    id: 1, num: "01", title: "CINEMATIC MASTER",
    desc: "Short Film Edit",
    cat: "film",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop",
    video: "https://youtu.be/MKhUrTuMur4"
  },
  {
    id: 2, num: "02", title: "URBAN BEATS",
    desc: "Music Video",
    cat: "music-video",
    img: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&h=380&fit=crop",
    video: "https://youtu.be/hPbkUaz_oZY"
  },
  {
    id: 3, num: "03", title: "COMMERCIAL AD",
    desc: "Brand Promotion",
    cat: "commercial",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=380&fit=crop",
    video: "https://youtu.be/V9otCdkT9Zs"
  },
  {
    id: 4, num: "04", title: "STORYTELLING",
    desc: "Documentary Piece",
    cat: "documentary",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=380&fit=crop",
    video: "https://youtu.be/SoPix5fK_Qw"
  },
  {
    id: 5, num: "05", title: "VISUAL POETRY",
    desc: "Cinematic Reel",
    cat: "film",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=380&fit=crop",
    video: "https://youtu.be/qO865BBWs68"
  },
  {
    id: 6, num: "06", title: "ACTION CUTS",
    desc: "High Pacing Edit",
    cat: "commercial",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=380&fit=crop",
    video: "https://youtu.be/lN0V29sP3zw"
  }
];

function Work() {
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return url; // Fallback to original if not a YT link
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;
  };

  const handleFilter = useCallback((newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.cat === newFilter));
    }
  }, []);

  const openModal = useCallback((videoUrl) => {
    setIsLoading(true);
    setSelectedVideo(videoUrl);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedVideo(null);
    setIsLoading(false);
    document.body.style.overflow = '';
  }, []);

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <motion.section 
      className="work-page reveal-on-scroll" 
      id="work"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.h1 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          MY WORK
        </motion.h1>
        <motion.div 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          SELECTED PROJECTS
        </motion.div>
      </motion.div>

      <motion.div 
        className="filter-bar"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilter('all')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          ALL
        </motion.button>
        <motion.button 
          className={`filter-btn ${filter === 'film' ? 'active' : ''}`}
          onClick={() => handleFilter('film')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          FILM
        </motion.button>
        <motion.button 
          className={`filter-btn ${filter === 'commercial' ? 'active' : ''}`}
          onClick={() => handleFilter('commercial')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          COMMERCIAL
        </motion.button>
        <motion.button 
          className={`filter-btn ${filter === 'music-video' ? 'active' : ''}`}
          onClick={() => handleFilter('music-video')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          MUSIC VIDEO
        </motion.button>
        <motion.button 
          className={`filter-btn ${filter === 'documentary' ? 'active' : ''}`}
          onClick={() => handleFilter('documentary')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          DOCUMENTARY
        </motion.button>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          className="grid"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="card"
              variants={cardVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              layout
              onClick={() => openModal(project.video)}
              whileHover={{
                y: -8,
                scale: 1.02,
                rotateX: 2,
                rotateY: -2
              }}
            >
              <div 
                className="card-bg" 
                style={{ backgroundImage: `url(${project.img})` }}
              />
              <div className="card-overlay" />
              <div className="top-accent" />
              <div className="play-btn">
                <svg viewBox="0 0 24 24">
                  <polygon points="6,3 20,12 6,21"/>
                </svg>
              </div>
              <div className="card-info">
                <div className="card-num">{project.num}</div>
                <div className="card-title">{project.title}</div>
                <div className="card-desc">{project.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content work-player-mode"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                className="modal-close"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
              >
                ✕
              </motion.button>
              
              <div className="video-container">
                {isLoading && (
                  <div className="work-loader">
                    <div className="loader-spinner"></div>
                    <span>LOADING PROJECT...</span>
                  </div>
                )}
                <iframe
                  key={selectedVideo}
                  src={getEmbedUrl(selectedVideo)}
                  title="Project Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className={`modal-video-iframe ${isLoading ? 'hidden' : 'visible'}`}
                  onLoad={() => setIsLoading(false)}
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default Work;

