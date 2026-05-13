import { useEffect, useRef } from 'react'
import '../../styles/IntroScreen.css'

const PANEL_SLOTS = [
  { key: 'panel-1', image: '' },
  { key: 'panel-2', image: '' },
  { key: 'panel-3', image: '' },
  { key: 'panel-4', image: '' },
  { key: 'panel-5', image: '' },
  { key: 'panel-6', image: '' },
]

function IntroScreen({ onEnter }) {
  const movedRef = useRef(false)

  useEffect(() => {
    const enterHome = () => {
      if (movedRef.current) return
      movedRef.current = true
      onEnter?.()
    }

    const handleKeydown = () => enterHome()
    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) > 2 || Math.abs(event.deltaX) > 2) enterHome()
    }

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [onEnter])

  return (
    <section className="intro" aria-label="Cinematic intro">
      <div className="intro-scene" aria-hidden="true">
        <div className="intro-stage">
          <div className="intro-stage-image" />
          {PANEL_SLOTS.map((slot) => (
            <div key={slot.key} className={`panel-slot ${slot.key} ${slot.image ? 'has-image' : ''}`}>
              {slot.image ? <img src={slot.image} alt="" /> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="intro-tint" />
      <div className="intro-vignette" />
      <div className="intro-grain" />

      <div className="intro-content">
        <div className="intro-copy">
          <p className="intro-title">
            ENTER THE WORLD
            <br />
            OF VISUAL STORYTELLING
          </p>
          <span className="intro-divider" />
          <p className="intro-hint">
            <span className="intro-hint-icon">+</span>
            <span>SCROLL TO BEGIN</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default IntroScreen
