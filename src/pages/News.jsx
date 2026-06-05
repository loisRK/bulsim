import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'

export default function News() {
  const { data: news, loading } = useNotion('/api/notion/news', null)

  return (
    <>
      <PageBanner title="사찰 소식" breadcrumb="" />
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          {loading && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              불러오는 중...
            </p>
          )}
          {!loading && (!news || news.length === 0) && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              등록된 소식이 없습니다.
            </p>
          )}
          <div className="news-list">
            {(news || []).map((n, i) => (
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
