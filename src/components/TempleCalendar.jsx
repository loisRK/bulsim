import { useState, useEffect } from 'react'

const DAYS   = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

const TYPE_COLOR = {
  '법회': 'var(--red)',
  '기도': '#1a56db',
  '행사': '#2e7d32',
  '기타': 'var(--gray)',
}

export default function TempleCalendar() {
  const today = new Date()
  const [year,   setYear]   = useState(today.getFullYear())
  const [month,  setMonth]  = useState(today.getMonth() + 1)
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)  // 선택된 날짜

  // Notion에서 이벤트 로드
  useEffect(() => {
    fetch(`/api/notion/schedule?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
  }, [year, month])

  // 달력 날짜 계산
  const firstDay  = new Date(year, month - 1, 1).getDay()  // 시작 요일
  const lastDate  = new Date(year, month, 0).getDate()       // 말일
  const prevLast  = new Date(year, month - 1, 0).getDate()   // 전달 말일

  // 날짜별 이벤트 맵
  const eventMap = {}
  events.forEach(e => {
    const d = parseInt(e.date.split('-')[2])
    if (!eventMap[d]) eventMap[d] = []
    eventMap[d].push(e)
  })

  // 선택된 날짜 이벤트
  const selectedEvents = selected ? (eventMap[selected] || []) : []

  // 월 이동
  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  // 달력 셀 생성
  const cells = []
  // 이전달 날짜
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevLast - i, curr: false })
  }
  // 이번달
  for (let d = 1; d <= lastDate; d++) {
    cells.push({ day: d, curr: true })
  }
  // 다음달
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, curr: false })
  }

  const isToday = d => d.curr && d.day === today.getDate()
    && month === today.getMonth() + 1 && year === today.getFullYear()

  return (
    <div className="cal-wrap">

      {/* 헤더 */}
      <div className="cal-header">
        <div className="cal-title">
          <span className="cal-year-text">{year}년</span>
          <span className="cal-month-text">{String(month).padStart(2,'0')}월</span>
          <span className="cal-title-suffix"> 일정</span>
        </div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>←</button>
          <button className="cal-nav-btn" onClick={nextMonth}>→</button>
        </div>
      </div>

      <div className="cal-body">
        {/* 달력 그리드 */}
        <div className="cal-grid-wrap">
          {/* 요일 헤더 */}
          <div className="cal-grid">
            {DAYS.map((d, i) => (
              <div key={d} className={`cal-dow${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</div>
            ))}
            {/* 날짜 셀 */}
            {cells.map((cell, i) => {
              const col = i % 7
              const dots = cell.curr ? (eventMap[cell.day] || []) : []
              const sel  = cell.curr && selected === cell.day
              return (
                <div
                  key={i}
                  className={[
                    'cal-cell',
                    !cell.curr ? 'other' : '',
                    isToday(cell) ? 'today' : '',
                    sel ? 'selected' : '',
                    col === 0 ? 'sun' : col === 6 ? 'sat' : '',
                  ].join(' ')}
                  onClick={() => cell.curr && setSelected(sel ? null : cell.day)}
                >
                  <span className="cal-day">{cell.day}</span>
                  {dots.length > 0 && (
                    <div className="cal-dots">
                      {dots.slice(0, 3).map((e, j) => (
                        <span key={j} className="cal-dot" style={{ background: TYPE_COLOR[e.type] }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 선택된 날짜 이벤트 팝업 */}
          {selected && selectedEvents.length > 0 && (
            <div className="cal-popup">
              <div className="cal-popup-title">{month}월 {selected}일 일정</div>
              {selectedEvents.map((e, i) => (
                <div key={i} className="cal-popup-item">
                  <span className="cal-popup-dot" style={{ background: TYPE_COLOR[e.type] }} />
                  <div>
                    <div className="cal-popup-name">{e.title}</div>
                    {e.content && <div className="cal-popup-desc">{e.content}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 연간 월 선택 */}
        <div className="cal-year-panel">
          <div className="cal-year-bg">{year}</div>
          <div className="cal-months-grid">
            {MONTHS.map((m, i) => (
              <button
                key={i}
                className={`cal-month-btn${(i + 1) === month ? ' active' : ''}`}
                onClick={() => { setMonth(i + 1); setSelected(null) }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="cal-legend">
        {Object.entries(TYPE_COLOR).map(([label, color]) => (
          <span key={label} className="cal-legend-item">
            <span className="cal-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
