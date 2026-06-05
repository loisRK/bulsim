import { useNavigate } from 'react-router-dom'
import { useNotion } from '../hooks/useNotion'
import { DHARMA_TODAY } from '../data/staticData'

export default function DharmaCard() {
  const { data } = useNotion('/api/notion/dharma', DHARMA_TODAY)

  return (
    <section id="dharma-section">
      <div className="dharma-inner">
        <div className="dharma-label">TODAY'S DHARMA</div>
        <h2 className="dharma-title">주지스님 오늘의 법문</h2>
        <div className="dharma-card">
          <p className="dharma-text">{data?.text}</p>
          <div className="dharma-meta">
            <span className="dharma-source">{data?.source}</span>
            <span className="dharma-date">{data?.date}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
