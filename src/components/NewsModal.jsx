import { useEffect, useState, useRef } from 'react'

export default function NewsModal({ item, onClose }) {
  const [blocks,  setBlocks]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!item?.id) return
    setLoading(true)
    fetch(`/api/notion/blocks?pageId=${item.id}`)
      .then(r => r.json())
      .then(data => setBlocks(Array.isArray(data) ? data : []))
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false))
  }, [item?.id])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!item) return null

  // 이미지 블록과 텍스트 블록 분리
  const imageBlocks = blocks.filter(b => b.type === 'image')
  const textBlocks  = blocks.filter(b => b.type !== 'image')
  const hasInfo     = item.time || item.place || item.host

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>

        {/* 사진 슬라이더 */}
        {!loading && imageBlocks.length > 0 && (
          <PhotoSlider images={imageBlocks} />
        )}

        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-meta">
            {item.badge && <span className="event-badge">{item.badge}</span>}
            <span className="modal-date">{item.month}.{item.day}</span>
          </div>
          <h2 className="modal-title">{item.title}</h2>
          <div className="modal-divider" />
        </div>

        {/* 본문 */}
        <div className="modal-body">
          {loading ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center' }}>불러오는 중...</p>
          ) : textBlocks.length > 0 ? (
            <BlockRenderer blocks={textBlocks} />
          ) : item.desc ? (
            <p>{item.desc}</p>
          ) : null}

          {hasInfo && (
            <div className="modal-info-box">
              {item.time  && <div><strong>일시</strong>{item.time}</div>}
              {item.place && <div><strong>장소</strong>{item.place}</div>}
              {item.host  && <div><strong>주관</strong>{item.host}</div>}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

/* ── 사진 슬라이더 ── */
function PhotoSlider({ images }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  // 모바일 스와이프
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div
      className="photo-slider"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 슬라이드 이미지 */}
      <div className="photo-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((img, i) => (
          <div key={i} className="photo-slide">
            <img src={img.url} alt={img.caption || `사진 ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* 화살표 (2장 이상일 때만) */}
      {images.length > 1 && (
        <>
          <button className="slider-arrow left"  onClick={prev}>&#8249;</button>
          <button className="slider-arrow right" onClick={next}>&#8250;</button>

          {/* 닷 인디케이터 */}
          <div className="slider-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`slider-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>

          {/* 카운터 */}
          <div className="slider-counter">{current + 1} / {images.length}</div>
        </>
      )}
    </div>
  )
}

/* ── 블록 렌더링 ── */
function BlockRenderer({ blocks }) {
  return (
    <div className="block-content">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph':
            return b.text ? <p key={i}>{b.text}</p> : <br key={i} />
          case 'heading_1':
            return <h2 key={i} className="block-h1">{b.text}</h2>
          case 'heading_2':
            return <h3 key={i} className="block-h2">{b.text}</h3>
          case 'heading_3':
            return <h4 key={i} className="block-h3">{b.text}</h4>
          case 'bullet':
            return <div key={i} className="block-bullet"><span>·</span>{b.text}</div>
          case 'number':
            return <div key={i} className="block-number"><span>{i + 1}.</span>{b.text}</div>
          case 'divider':
            return <hr key={i} className="block-divider" />
          case 'quote':
            return <blockquote key={i} className="block-quote">{b.text}</blockquote>
          default:
            return null
        }
      })}
    </div>
  )
}
