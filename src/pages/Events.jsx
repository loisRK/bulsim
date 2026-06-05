import { useState } from 'react'
import PageBanner from '../components/PageBanner'
import NewsModal  from '../components/NewsModal'
import { useNotion } from '../hooks/useNotion'

export default function Events() {
  const { data: news, loading } = useNotion('/api/notion/news', null)
  const [selectedYear, setSelectedYear] = useState('전체')
  const [selected, setSelected] = useState(null)

  const list = news || []

  // 연도 목록 추출
  const years = ['전체', ...Array.from(new Set(list.map(n => String(n.year)))).sort((a, b) => b - a)]

  // 연도 필터 적용
  const filtered = selectedYear === '전체'
    ? list
    : list.filter(n => String(n.year) === selectedYear)

  return (
    <>
      <PageBanner title="주요 행사" breadcrumb="사찰 소식" />

      <div className="events-layout">

        {/* 사이드바 — 연도 필터 */}
        <aside className="events-sidebar">
          <ul className="year-filter">
            {years.map(y => (
              <li key={y}>
                <button
                  className={`year-btn${selectedYear === y ? ' active' : ''}`}
                  onClick={() => setSelectedYear(y)}
                >
                  {selectedYear === y && <span className="year-dot">•</span>}
                  {y}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="events-main">
          {loading && (
            <p className="events-empty">불러오는 중...</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="events-empty">등록된 행사가 없습니다.</p>
          )}
          <div className="events-list">
            {filtered.map((item, i) => (
              <EventCard key={i} item={item} onClick={() => setSelected(item)} />
            ))}
          </div>
        </main>

      </div>

      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

function EventCard({ item, onClick }) {
  return (
    <div className="event-card-row" onClick={onClick}>
      {/* 썸네일 */}
      <div className="event-thumb">
        {item.cover
          ? <img src={item.cover} alt={item.title} />
          : <div className="event-thumb-placeholder">🪷</div>
        }
      </div>

      {/* 내용 */}
      <div className="event-card-info">
        <div className="event-card-meta">
          {item.badge && <span className="event-badge">{item.badge}</span>}
          <span className="event-card-date">{item.month}</span>
        </div>
        <h3 className="event-card-title">{item.title}</h3>
        {item.desc && <p className="event-card-desc">{item.desc}</p>}
        <span className="event-more">더보기</span>
      </div>
    </div>
  )
}
