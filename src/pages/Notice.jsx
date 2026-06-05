import { useState } from 'react'
import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'

export default function Notice() {
  const { data: notices, loading } = useNotion('/api/notion/notices', null)
  const [active, setActive] = useState(null)

  const list = notices || []
  const activeId = active || list[0]?.id

  return (
    <>
      <PageBanner title="공지사항" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 900 }}>
          {loading && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              불러오는 중...
            </p>
          )}
          {!loading && list.length === 0 && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              등록된 공지사항이 없습니다.
            </p>
          )}
          {!loading && list.length > 0 && (
            <>
              <div className="notice-tabs">
                {list.map(n => (
                  <div
                    key={n.id}
                    className={`notice-tab${activeId === n.id ? ' active' : ''}`}
                    onClick={() => setActive(n.id)}
                  >
                    {n.title}
                  </div>
                ))}
              </div>
              {list.map(n => (
                <div
                  key={n.id}
                  className={`notice-panel${activeId === n.id ? ' active' : ''}`}
                >
                  {n.items.map((item, i) => (
                    <div key={i} className="notice-row">{item.text}</div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  )
}
