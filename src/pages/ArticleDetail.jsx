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
  const fileBlocks  = blocks.filter(b => b.type === 'file')
  const textBlocks  = blocks.filter(b => b.type !== 'image' && b.type !== 'file')
  const hasInfo     = item?.time || item?.place || item?.host

  return (
    <div style={{ marginTop: 70 }}>

      {/* 상단 네비 바 */}
      <div className="article-nav-bar">
        <button className="article-back" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
      </div>

      <div className="article-container">

        {/* 헤더 */}
        <div className="article-header">
          <div className="article-meta">
            {item?.badge && <span className="event-badge">{item.badge}</span>}
            {item?.month && <span className="article-date">{item.month}.{item.day}</span>}
          </div>
          <h1 className="article-title">{item?.title ?? '소식'}</h1>
        </div>

        {/* 사진 슬라이더 */}
        {!loading && imageBlocks.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <PhotoSlider images={imageBlocks} />
          </div>
        )}

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

          {/* 첨부파일 — 프로퍼티 방식 + 페이지 내 file 블록 방식 통합 */}
          <AttachmentSection
            propFiles={item?.attachments ?? []}
            blockFiles={fileBlocks}
          />
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

/* ── 첨부파일 다운로드 섹션 ── */
function AttachmentSection({ propFiles, blockFiles }) {
  // 프로퍼티 방식 + 블록 방식 합산, 중복 URL 제거
  const all = [
    ...propFiles,
    ...blockFiles.map(b => ({ name: b.name, url: b.url })),
  ].filter((f, idx, arr) => f.url && arr.findIndex(x => x.url === f.url) === idx)

  if (all.length === 0) return null

  return (
    <div className="attachment-section">
      <div className="attachment-title">📎 첨부파일</div>
      <ul className="attachment-list">
        {all.map((f, i) => (
          <li key={i}>
            <a
              href={f.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="attachment-item"
            >
              <span className="attachment-icon">⬇</span>
              <span className="attachment-name">{f.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 인라인 세그먼트 렌더링 (링크·볼드·이탤릭 지원) ── */
function RichText({ segments, text }) {
  // 구버전 호환: segments 없으면 plain text fallback
  if (!segments || segments.length === 0) return <>{text}</>
  return (
    <>
      {segments.map((seg, i) => {
        let node = <>{seg.text}</>
        if (seg.bold)   node = <strong key={i}>{node}</strong>
        if (seg.italic) node = <em key={i}>{node}</em>
        if (seg.href) {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block-link"
            >
              {seg.text}
            </a>
          )
        }
        return <span key={i} style={seg.bold ? { fontWeight: 700 } : seg.italic ? { fontStyle: 'italic' } : undefined}>{seg.text}</span>
      })}
    </>
  )
}

/* ── 블록 렌더링 ── */
function BlockRenderer({ blocks }) {
  let numberIdx = 0
  return (
    <div className="block-content">
      {blocks.map((b, i) => {
        if (b.type !== 'number') numberIdx = 0
        switch (b.type) {
          case 'paragraph':
            return b.text ? (
              <p key={i}><RichText segments={b.segments} text={b.text} /></p>
            ) : <br key={i} />
          case 'heading_1':
            return <h2 key={i} className="block-h1"><RichText segments={b.segments} text={b.text} /></h2>
          case 'heading_2':
            return <h3 key={i} className="block-h2"><RichText segments={b.segments} text={b.text} /></h3>
          case 'heading_3':
            return <h4 key={i} className="block-h3"><RichText segments={b.segments} text={b.text} /></h4>
          case 'bullet':
            return (
              <div key={i} className="block-bullet">
                <span>·</span>
                <RichText segments={b.segments} text={b.text} />
              </div>
            )
          case 'number': {
            numberIdx++
            return (
              <div key={i} className="block-number">
                <span>{numberIdx}.</span>
                <RichText segments={b.segments} text={b.text} />
              </div>
            )
          }
          case 'divider':
            return <hr key={i} className="block-divider" />
          case 'quote':
            return (
              <blockquote key={i} className="block-quote">
                <RichText segments={b.segments} text={b.text} />
              </blockquote>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
