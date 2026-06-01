import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'
import { NEWS } from '../data/staticData'

export default function News() {
  const { data: news, loading } = useNotion('/api/notion/news', NEWS)
  const list = news || NEWS

  return (
    <>
      <PageBanner title="사찰 소식" breadcrumb="" />
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          {loading && <p style={{ color: 'var(--gray)', padding: '20px 0' }}>불러오는 중...</p>}
          <div className="news-list">
            {list.map((n, i) => (
              <div key={i} className="news-item">
                <div className="news-date">
                  <div className="day">{n.day}</div>
                  <div className="month">{n.month}</div>
                </div>
                <div className="news-content">
                  <h4>{n.title}</h4>
                  <p>{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
