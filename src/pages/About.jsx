import PageBanner from "../components/PageBanner";
import { TEMPLE, ABOUT_HISTORY } from "../data/staticData";

export default function About() {
  return (
    <>
      <PageBanner title="불심정사 소개" breadcrumb="" />

      <section className="about-section" id="greeting">
        <div className="about-section-inner">
          <h2>인사말</h2>
          <p className="greeting-text">{TEMPLE.greetingLong}</p>
        </div>
      </section>

      <section
        className="about-section"
        id="hall"
        style={{ background: "#fff", textAlign: "left" }}
      >
        <div className="about-section-inner">
          <h2>대웅전</h2>
          <img
            src="/photo/IMG_5290.jpeg"
            alt="대웅전"
            style={{
              width: "100%",
              maxWidth: 700,
              borderRadius: 6,
              marginBottom: 20,
            }}
          />
          <img
            src="/photo/IMG_5242.jpeg"
            alt="신도 법회"
            style={{ width: "100%", maxWidth: 700, borderRadius: 6 }}
          />
        </div>
      </section>

      <section className="about-section" id="history">
        <div className="about-section-inner">
          <h2>역사</h2>
          <div className="history-list">
            {ABOUT_HISTORY.map((h) => (
              <div key={h.year} className="history-item">
                <div className="history-year">{h.year}</div>
                <div className="history-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="about-section"
        id="location"
        style={{ background: "#fff" }}
      >
        <div className="about-section-inner">
          <h2>오시는 길</h2>
          <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 24 }}>
            📍 {TEMPLE.address}
          </p>
          <div className="transport-list">
            {TEMPLE.transport.map((t, i) => (
              <div key={i} className="transport-card">
                <div className="transport-card-head">
                  <span className="t-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </div>
                <div className="transport-steps">
                  {t.steps.map((s, j) => (
                    <div key={j} className="transport-step">
                      <div className="step-num">{s.step}</div>
                      <span dangerouslySetInnerHTML={{ __html: s.text }} />
                    </div>
                  ))}
                </div>
                {t.info && (
                  <div className="transport-info-badge">⏱ {t.info}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
