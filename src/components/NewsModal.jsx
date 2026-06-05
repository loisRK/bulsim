import { useEffect } from 'react'

export default function NewsModal({ item, onClose }) {
  // ESC 키로 닫기
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* 닫기 버튼 */}
        <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>

        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-date">{item.month}.{item.day}</div>
          <h2 className="modal-title">{item.title}</h2>
        </div>

        {/* 사진 */}
        {item.photo && (
          <div className="modal-photo">
            <img src={item.photo} alt={item.title} />
          </div>
        )}

        {/* 본문 */}
        <div className="modal-body">
          {item.body
            ? item.body.split('\n').map((line, i) => (
                line.trim()
                  ? <p key={i}>{line}</p>
                  : <br key={i} />
              ))
            : <p style={{ color: 'var(--gray)' }}>{item.desc}</p>
          }
        </div>

      </div>
    </div>
  )
}
