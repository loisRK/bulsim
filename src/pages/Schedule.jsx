import PageBanner      from '../components/PageBanner'
import TempleCalendar  from '../components/TempleCalendar'
import { SCHEDULE, TEMPLE } from '../data/staticData'

const GROUPS = [
  { label: '일일 예불',  tag: 'tag-blue' },
  { label: '정기 법회',  tag: 'tag-green' },
  { label: '재일기도',   tag: 'tag-gold' },
]

export default function Schedule() {
  return (
    <>
      <PageBanner title="사찰일정" breadcrumb="사찰 소식" />

      {/* 달력 */}
      <section className="section" style={{ background: 'var(--bg)', paddingBottom: 0 }}>
        <div className="section-inner">
          <TempleCalendar />
        </div>
      </section>

      {/* 정기 법회 일정표 */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <div className="section-header">
            <h2 className="section-title">정기 법회 일정</h2>
          </div>
          <table className="schedule-table">
            <thead>
              <tr><th>구분</th><th>요일 / 일자</th><th>시간</th><th>법회명</th></tr>
            </thead>
            <tbody>
              {GROUPS.map(g => {
                const items = SCHEDULE.filter(s => s.tag === g.tag)
                return (
                  <>
                    <tr key={g.label}>
                      <td colSpan={4} style={{ background: 'var(--bg)', fontWeight: 700, fontSize: 12, color: 'var(--gray)', padding: '10px 16px', letterSpacing: 1 }}>
                        {g.label}
                      </td>
                    </tr>
                    {items.map((s, i) => (
                      <tr key={i}>
                        <td><span className={`tag ${s.tag}`}>{s.label}</span></td>
                        <td>{s.day}</td>
                        <td>{s.time}</td>
                        <td>{s.name}</td>
                      </tr>
                    ))}
                  </>
                )
              })}
            </tbody>
          </table>
          <div style={{ marginTop: 20, padding: '16px 20px', background: '#fff8e1', borderLeft: '3px solid var(--gold)', fontSize: 14, color: 'var(--gray)', lineHeight: 1.8 }}>
            ※ 법회 일정은 사정에 따라 변경될 수 있습니다.<br />
            ※ TEL: <strong>{TEMPLE.tel}</strong>
          </div>
        </div>
      </section>
    </>
  )
}
