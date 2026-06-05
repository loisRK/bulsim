import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

export default function ArticleDetail() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const { state }     = useLocation()   // { item } passed via navigate
  const item          = state?.item

  const [blocks,  setBlocks]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/notion/blocks?pageId=${id}`)
      .then(r => r.json())
      .then(data => setBlocks(Array.isArray(data) ? data : []))
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false))
  }, [id])

  const imageBlocks = blocks.filter(b => b.type === 'image')
  const textBlocks  = blocks.filter(b => b.type !== 'image')
  const hasInfo     = item?.time || item?.place || item?.host

  return (
    <div style={{ marginTop: 70 }}>

      {/* 상단 네비 바 */}
      <div className="article-nav-bar">
        <button className="article-back" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
        {item?.badge && <span className="event-badge">{item.badge}</span>}
      </div>

      <div className="article-container">

        {/* 사진 슬라이더 */}
        {!loading && imageBlocks.length > 0 && (
          <PhotoSlider images={imageBlocks} />
        )}

        {/* 헤더 */}
        <div className="article-header">
          <div className="article-meta">
            {item?.month && <span className="article-date">{item.month}.{item.day}</span>}
          </div>
          <h1 className="article-title">{item?.title ?? '소식'}</h1>
          <div className="article-divider" />
        </div>

        {/* 본문 */}
        <div className="article-body">
          {loading ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px 0' }}>
              불러오는 중...
            </p>
          ) : textBlocks.length > 0 ? (
            <BlockRenderer blocks={textBlocks} />
          ) : item?.desc ? (
            <p>{item.desc}</p>
          ) : (
            <p style={{ color: 'var(--gray)' }}>내용이 없습니다.</p>
          )}

          {/* 행사 정보 박스 */}
          {hasInfo && (
            <div className="modal-info-box" style={{ marginTop: 32 }}>
              {item.time  && <div><strong>일시</strong>{item.time}</div>}
              {item.place && <div><strong>장소</strong>{item.place}</div>}
              {item.host  && <div><strong>주관</strong>{item.host}</div>}
            </div>
          )}
        </div>

        {/* 하단 목록으로 */}
        <div style={{ padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: 32 }}>
          <button className="article-back-bottom" onClick={() => navigate(-1)}>
            ← 목록으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  )
}

/* ── 사진 슬라이더 ── */
import { useRef } from 'react'
function PhotoSlider({ images }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="photo-slider full-width" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="photo-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((img, i) => (
          <div key={i} className="photo-slide">
            <img src={img.url} alt={img.caption || `사진 ${i + 1}`} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="slider-arrow left"  onClick={prev}>&#8249;</button>
          <button className="slider-arrow right" onClick={next}>&#8250;</button>
          <div className="slider-dots">
            {images.map((_, i) => (
              <button key={i} className={`slider-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)} />
            ))}
          </div>
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
