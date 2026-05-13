import '../../styles/LoadingScreen.css'

function LoadingScreen({ progress = 0 }) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <section className="loader" aria-label="Loading experience">
      <div className="entry-shell">
        <div className="entry-bg" style={{ backgroundImage: 'url(/img/loading.png)' }} />
        <div className="entry-tint" />
        <div className="entry-vignette" />
        <div className="entry-grain" />

        <div className="entry-content">
          <img className="entry-logo" src="/img/logo_noborder.png" alt="Subham logo" />

          <p className="entry-tagline">VISUAL STORIES. POWERFUL IMPACT.</p>

          <div className="entry-row">
            <span>LOADING EXPERIENCE</span>
            <span>{safeProgress}%</span>
          </div>

          <div className="entry-progress">
            <div className="entry-progress-fill" style={{ width: `${safeProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoadingScreen
