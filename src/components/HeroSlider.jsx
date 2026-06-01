import { useState, useEffect } from 'react'
import { SLIDES } from '../data/staticData'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = n => setCurrent((n + SLIDES.length) % SLIDES.length)

  return (
    <section id="hero">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`slide${i === current ? ' active' : ''}`}
          style={{ backgroundImage: `url('${s.img}')` }}
        >
          <div className="slide-overlay" />
          <div className="slide-text">
            <div className="en">{s.en}</div>
            <h2 dangerouslySetInnerHTML={{ __html: s.title.replace(/\n/g, '<br/>') }} />
            <p>{s.desc}</p>
          </div>
        </div>
      ))}

      <div className="slide-dots">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <button className="slide-arrow" id="prev-btn" onClick={() => goTo(current - 1)}>‹</button>
      <button className="slide-arrow" id="next-btn" onClick={() => goTo(current + 1)}>›</button>
    </section>
  )
}
