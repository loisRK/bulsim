import PageBanner from '../components/PageBanner'
import { EDUCATION, TEMPLE } from '../data/staticData'

export default function Education() {
  return (
    <>
      <PageBanner title="불교 교육" breadcrumb="" />
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">교육 프로그램</h2>
          </div>
          <div className="edu-grid">
            {EDUCATION.map(e => (
              <div key={e.title} className="edu-card">
                <div className="edu-icon">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="edu-meta">🗓 {e.schedule} &nbsp;|&nbsp; 📞 {TEMPLE.tel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="meditation" style={{ background: '#fff' }}>
        <div className="section-inner" style={{ maxWidth: 800 }}>
          <div className="section-header">
            <h2 className="section-title">명상 안내</h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--gray)', lineHeight: 2 }}>
            불심정사의 명상 수련은 부처님의 가르침을 바탕으로 마음의 고요함과 지혜를 계발하는 수행입니다.
            매주 수요일 저녁, 누구나 참여할 수 있습니다. 별도 준비물 없이 편안한 복장으로 오시면 됩니다.
          </p>
          <div style={{ marginTop: 24, padding: 20, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4 }}>
            <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 2.2 }}>
              🕖 일시: 매주 수요일 오후 7시<br />
              📍 장소: 불심정사 법당<br />
              📞 문의: {TEMPLE.tel}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
