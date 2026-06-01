import { useState } from 'react'
import PageBanner from '../components/PageBanner'
import { TEMPLE } from '../data/staticData'

const TYPES = ['공양간 봉사 (매주 일요일)', '도량 청소', '법회 준비', '행사 봉사', '이웃 돕기', '기타']

export default function Volunteer() {
  const [form, setForm] = useState({ name: '', phone: '', type: '', date: '', message: '' })
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim())  { alert('성함을 입력해 주세요.'); return }
    if (!form.phone.trim()) { alert('연락처를 입력해 주세요.'); return }
    if (!form.type)         { alert('봉사 항목을 선택해 주세요.'); return }

    setLoading(true)
    try {
      await fetch('/api/notion/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (err) {
      console.warn('전송 오류:', err)
    } finally {
      setLoading(false)
      setDone(true)
    }
  }

  return (
    <>
      <PageBanner title="자원봉사 신청" breadcrumb="신행안내" />
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-inner">
          <div className="vol-form-wrap">
            {!done ? (
              <>
                <h3>🙏 자원봉사 신청</h3>
                <p className="vol-sub">신청 내용은 스님께 바로 전달됩니다.<br />성함과 연락처를 꼭 남겨 주세요.</p>
                <form onSubmit={submit} noValidate>
                  <div className="form-group">
                    <label>성함 <span className="required">*</span></label>
                    <input name="name" value={form.name} onChange={handle} placeholder="이름을 입력해 주세요" autoComplete="name" />
                  </div>
                  <div className="form-group">
                    <label>연락처 <span className="required">*</span></label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="010-0000-0000" inputMode="numeric" />
                  </div>
                  <div className="form-group">
                    <label>봉사 항목 <span className="required">*</span></label>
                    <select name="type" value={form.type} onChange={handle}>
                      <option value="">-- 선택해 주세요 --</option>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>희망 날짜</label>
                    <input name="date" type="date" value={form.date} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>남기실 말씀</label>
                    <textarea name="message" value={form.message} onChange={handle} placeholder="궁금한 점이나 남기실 말씀을 적어 주세요" />
                  </div>
                  <div className="form-notice">
                    📌 신청 후 담당자가 확인 연락을 드립니다.<br />
                    문의: <strong>{TEMPLE.tel}</strong>
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? '전송 중...' : '신청하기'}
                  </button>
                </form>
              </>
            ) : (
              <div className="form-result" style={{ display: 'block' }}>
                <div className="result-icon">🙏</div>
                <h4>신청이 완료되었습니다</h4>
                <p>소중한 봉사 신청 감사합니다.<br />담당자가 곧 연락 드리겠습니다.</p>
                <button
                  onClick={() => { setDone(false); setForm({ name:'', phone:'', type:'', date:'', message:'' }) }}
                  style={{ marginTop: 24, padding: '14px 32px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
                >
                  다시 신청하기
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
