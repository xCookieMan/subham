import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('MISSION DISPATCHED: Your message is on its way! 🚀');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        alert('MISSION FAILED: ' + (data.error || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('COMMUNICATION ERROR: Could not reach the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="contact-page" id="contact">
      <div className="contact-container">
        <header className="contact-header">
          <motion.div 
            className="contact-kicker"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="dot"></span> READY TO START?
          </motion.div>
          <motion.h2 
            className="contact-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            LET'S <span className="accent">COLLABORATE</span>
          </motion.h2>
          <motion.p 
            className="contact-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Available for worldwide projects. Let's build something cinematic together.
          </motion.p>
        </header>

        <div className="contact-content">
          {/* Info Side */}
          <motion.div 
            className="contact-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="info-group">
              <label>INQUIRIES</label>
              <a href="mailto:hello@akeditor.com" className="info-link">shubhamkumarbhargav551@gmail.com
                
              </a>
            </div>
            <div className="info-group">
              <label>SOCIAL</label>
              <div className="social-links">
                <a href="https://www.instagram.com/shubhampandey_clicker?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-icon-link instagram">
                  <div className="icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <span>INSTAGRAM</span>
                </a>
                <a href="https://www.youtube.com/@subham-i1r" target="_blank" rel="noopener noreferrer" className="social-icon-link youtube">
                  <div className="icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </div>
                  <span>YOUTUBE</span>
                </a>
                <a href="https://linkedin.com/in/subham-kumar-bhargav-6107b43a8" target="_blank" rel="noopener noreferrer" className="social-icon-link linkedin">
                  <div className="icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <span>LINKEDIN</span>
                </a>
              </div>
            </div>
            <div className="info-group">
              <label>LOCATION</label>
              <p className="info-text">BASED IN INDIA • AVAILABLE WORLDWIDE</p>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            className="contact-form-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <form onSubmit={handleSubmit} className="cinematic-form">
              <div className="form-row">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="NAME"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <span className="bar"></span>
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="EMAIL"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="bar"></span>
                </div>
              </div>

              <div className="input-group">
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="General Inquiry">GENERAL INQUIRY</option>
                  <option value="Video Editing">VIDEO EDITING</option>
                  <option value="Color Grading">COLOR GRADING</option>
                  <option value="VFX/Green Screen">VFX / GREEN SCREEN</option>
                </select>
                <span className="bar"></span>
              </div>

              <div className="input-group">
                <textarea 
                  name="message" 
                  placeholder="TELL ME ABOUT YOUR PROJECT"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <span className="bar"></span>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                <div className="btn-ui-elements">
                  <span className="corner tl"></span>
                  <span className="corner tr"></span>
                  <span className="corner bl"></span>
                  <span className="corner br"></span>
                  <div className="scan-line"></div>
                </div>
                <div className="btn-content">
                  {isSubmitting ? (
                    <span className="loading-text">RENDERING...</span>
                  ) : (
                    <>
                      <div className="btn-text-wrapper">
                        <span className="btn-text" data-text="SEND MESSAGE">SEND MESSAGE</span>
                        <span className="btn-timecode">00:00:24:08</span>
                      </div>
                      <span className="btn-icon">
                        <span className="rec-dot"></span>
                        <span className="arrow">→</span>
                      </span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
