import { Link, useNavigate } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import DharmaCard from '../components/DharmaCard'
import Icon from '../components/Icon'
import { useNotion } from '../hooks/useNotion'
import { QUICK_LINKS, NOTICES, SCHEDULE } from '../data/staticData'

export default function Home() {
  const navigate = useNavigate()
  const { data: notices, loading: noticesLoading } = useNotion('/api/notion/notices', NOTICES)
  const { data: events,  loading: eventsLoading }  = useNotion('/api/notion/news',    null)

  return (
    <>
      <HeroSlider />

      {/* 퀵 링크 */}
      <section id="quick">
        <div className="quick-inner">
          {QUICK_LINKS.map(q => (
            <Link key={q.href} to={q.href} className="quick-item">
              <div className="quick-icon"><Icon name={q.icon} size="lg" /></div>
              <div className="quick-label">{q.label}</div>
              <div className="quick-sub">{q.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 오늘의 법문 */}
      <DharmaCard />

      {/* 공지사항 */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">공지사항</h2>
            <Link to="/notice" className="more-btn">더보기 +</Link>
          </div>
          {noticesLoading ? (
            <p style={{ color: 'var(--gray)', padding: '20px 0' }}>불러오는 중...</p>
          ) : (
            <div className="notice-board" style={{ marginBottom: 0 }}>
              {(notices || []).slice(0, 5).map((item, i) => (
                <Link key={i} to="/notice" className="notice-board-row" style={{ textDecoration: 'none' }}>
                  <span className={`notice-board-badge badge-${item.badge}`}>{item.badge}</span>
                  <span className="notice-board-text">{item.title}</span>
                  <span className="notice-board-date">{item.month}</span>
                  <span className="notice-board-arrow">›</span>
                </Link>
              ))}
              {(!notices || notices.length === 0) && (
                <p style={{ color: 'var(--gray)', padding: '20px 0', textAlign: 'center' }}>등록된 공지가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 사찰 소식 */}
      {/* 주요행사 요약 */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">주요 행사</h2>
            <Link to="/events" className="more-btn">더보기 +</Link>
          </div>
          {eventsLoading ? (
            <p style={{ color: 'var(--gray)', padding: '20px 0' }}>불러오는 중...</p>
          ) : (
            <div className="home-events-list">
              {(events || []).slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="home-event-card"
                  onClick={() => navigate(`/events/${item.id}`, { state: { item } })}
                >
                  <div className="home-event-thumb">
                    {item.cover
                      ? <img src={item.cover} alt={item.title} />
                      : <div className="home-event-placeholder"><Icon name="lotus" size="xl" /></div>
                    }
                  </div>
                  <div className="home-event-info">
                    <div className="home-event-meta">
                      {item.badge && <span className="event-badge">{item.badge}</span>}
                      <span style={{ fontSize: 12, color: 'var(--gray)' }}>{item.month}</span>
                    </div>
                    <h4 className="home-event-title">{item.title}</h4>
                    {item.desc && <p className="home-event-desc">{item.desc}</p>}
                  </div>
                </div>
              ))}
              {(!events || events.length === 0) && (
                <p style={{ color: 'var(--gray)', padding: '20px 0' }}>등록된 행사가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 법회 일정 미리보기 */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">법회 일정</h2>
            <Link to="/schedule" className="more-btn">전체 일정 보기 +</Link>
          </div>
          <ScheduleTable />
        </div>
      </section>
    </>
  )
}

function ScheduleTable() {
  const groups = [
    { label: '일일 예불',  items: SCHEDULE.filter(s => s.tag === 'tag-blue') },
    { label: '정기 법회',  items: SCHEDULE.filter(s => s.tag === 'tag-green') },
    { label: '재일기도',   items: SCHEDULE.filter(s => s.tag === 'tag-gold') },
  ]
  return (
    <table className="schedule-table">
      <thead>
        <tr><th>구분</th><th>요일 / 일자</th><th>시간</th><th>법회명</th></tr>
      </thead>
      <tbody>
        {groups.map(g => (
          <>
            <tr key={g.label}>
              <td colSpan={4} style={{ background: 'var(--bg)', fontWeight: 700, fontSize: 12, color: 'var(--gray)', padding: '10px 16px', letterSpacing: 1 }}>
                {g.label}
              </td>
            </tr>
            {g.items.map((s, i) => (
              <tr key={i}>
                <td><span className={`tag ${s.tag}`}>{s.label}</span></td>
                <td>{s.day}</td>
                <td>{s.time}</td>
                <td>{s.name}</td>
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  )
}
