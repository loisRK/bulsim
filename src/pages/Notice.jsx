import { useState } from 'react'
import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'
import { NOTICES } from '../data/staticData'

export default function Notice() {
  const { data: notices } = useNotion('/api/notion/notices', NOTICES)
  const list = notices || NOTICES
  const [active, setActive] = useState(list[0]?.id)

  return (
    <>
      <PageBanner title="공지사항" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <div className="notice-tabs">
            {list.map(n => (
              <div
                key={n.id}
                className={`notice-tab${active === n.id ? ' active' : ''}`}
                onClick={() => setActive(n.id)}
              >
                {n.title}
              </div>
            ))}
          </div>
          {list.map(n => (
            <div key={n.id} className={`notice-panel${active === n.id ? ' active' : ''}`}>
              {n.items.map((item, i) => (
                <div key={i} className="notice-row">{item.text}</div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
