import PageBanner from '../components/PageBanner'
import { EVENTS } from '../data/staticData'

export default function Events() {
  return (
    <>
      <PageBanner title="주요 행사" breadcrumb="사찰 소식" />
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          {EVENTS.map((e, i) => (
            <div key={i} className="event-card">
              <div className="event-photos">
                {e.photos.map((src, j) => (
                  <img key={j} src={src} alt={`행사 사진 ${j + 1}`} />
                ))}
              </div>
              <div className="event-body">
                <div className="event-meta">
                  <span className="event-badge">{e.badge}</span>
                  <span className="event-date">{e.date}</span>
                </div>
                <h2>{e.title}</h2>
                <div className="event-divider" />
                <p dangerouslySetInnerHTML={{ __html: e.desc.replace(/\n/g, '<br/>') }} />
                <div className="event-info-box">
                  {e.info.map(row => (
                    <span key={row.label} style={{ display: 'block' }}>
                      <strong style={{ color: 'var(--dark)', marginRight: 6 }}>{row.label}</strong>
                      {row.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
