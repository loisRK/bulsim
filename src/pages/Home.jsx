import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import DharmaCard from '../components/DharmaCard'
import { useNotion } from '../hooks/useNotion'
import { QUICK_LINKS, NOTICES, SCHEDULE } from '../data/staticData'

export default function Home() {
  const { data: notices, loading: noticesLoading } = useNotion('/api/notion/notices', NOTICES)
  const { data: news,    loading: newsLoading }    = useNotion('/api/notion/news',    null)

  return (
    <>
      <HeroSlider />

      {/* 퀵 링크 */}
      <section id="quick">
        <div className="quick-inner">
          {QUICK_LINKS.map(q => (
            <Link key={q.href} to={q.href} className="quick-item">
              <div className="quick-icon">{q.icon}</div>
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
            <div className="notice-grid">
              {(notices || []).map(n => (
                <div key={n.id} className="notice-card">
                  <div className="notice-card-head">
                    <span className="notice-badge">{n.badge}</span>
                    <span>{n.title}</span>
                  </div>
                  <ul className="notice-list">
                    {n.items.map((item, i) => (
                      <li key={i}><Link to="/notice">{item.text}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 사찰 소식 */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">사찰 소식</h2>
            <Link to="/news" className="more-btn">더보기 +</Link>
          </div>
          {newsLoading ? (
            <p style={{ color: 'var(--gray)', padding: '20px 0' }}>불러오는 중...</p>
          ) : (
            <div className="news-list">
              {(news || []).map((n, i) => (
                <Link key={i} to="/news" className="news-item">
                  <div className="news-date">
                    <div className="day">{n.day}</div>
                    <div className="month">{n.month}</div>
                  </div>
                  <div className="news-content">
                    <h4>{n.title}</h4>
                    <p>{n.desc}</p>
                  </div>
                </Link>
              ))}
              {!news?.length && (
                <p style={{ color: 'var(--gray)', padding: '20px 0' }}>등록된 소식이 없습니다.</p>
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
