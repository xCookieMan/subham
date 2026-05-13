import '../../styles/HomePage.css';  

const NAV_ITEMS = ['HOME', 'WORK', 'ABOUT', 'SERVICES', 'CONTACT']

function HomePage({ onOpenTimeline }) {
  return (
    <main className="home-cinematic" aria-label="Home page">
      <div className="home-bg" style={{ backgroundImage: 'url(/img/intro.png)' }} />
      <div className="home-tint" />
      <div className="home-vignette" />

      <section className="home-part home-part-hero">
        <div className="hero-content-grid">
          <article className="hero-copy">
            <p className="hero-kicker">VIDEO EDITOR | COLORIST | POST PRODUCTION</p>
            <h1>
              <span className="line">I EDIT VISUALS</span>
              <br />
              <span className="line">THAT FEEL</span>
              <br />
              <span className="accent">CINEMATIC & SHARP</span>
            </h1>
            <p className="hero-desc">
              From reels and ads to long-form cuts, I craft pacing, transitions, sound and color that hold attention.
            </p>
            <div className="hero-actions">
<button type="button" className="primary-btn" onClick={() => {
                const reelSection = document.getElementById('reel');
                if (reelSection) {
                  reelSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                WATCH SHOWREEL
              </button>
              <button type="button" className="ghost-btn" onClick={() => {
                const workSection = document.getElementById('work');
                if (workSection) {
                  workSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                EXPLORE WORK
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default HomePage
