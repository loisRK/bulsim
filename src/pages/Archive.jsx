import PageBanner from '../components/PageBanner'

export default function Archive() {
  return (
    <>
      <PageBanner title="자료실" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 860 }}>
          <p style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center', fontSize: 15 }}>
            자료실 준비 중입니다.
          </p>
        </div>
      </section>
    </>
  )
}
