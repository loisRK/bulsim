export default function PageBanner({ title, breadcrumb }) {
  return (
    <section className="page-banner">
      <div className="page-banner-inner">
        {breadcrumb && (
          <p className="breadcrumb">홈 &gt; {breadcrumb} &gt; {title}</p>
        )}
        <h1>{title}</h1>
      </div>
    </section>
  )
}
