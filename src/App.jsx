import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header        from './components/Header'
import Footer        from './components/Footer'
import Home          from './pages/Home'
import About         from './pages/About'
import Notice        from './pages/Notice'
import Schedule      from './pages/Schedule'
import News          from './pages/News'
import Events        from './pages/Events'
import Volunteer     from './pages/Volunteer'
import ArticleDetail from './pages/ArticleDetail'
import Archive       from './pages/Archive'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // 해시가 있으면 해당 섹션으로 스크롤
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100) // 페이지 렌더 후 실행
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/notice"        element={<Notice />} />
          <Route path="/notice/:id"    element={<ArticleDetail />} />
          <Route path="/schedule"      element={<Schedule />} />
          <Route path="/news"          element={<News />} />
          <Route path="/events"        element={<Events />} />
          <Route path="/events/:id"    element={<ArticleDetail />} />
          <Route path="/volunteer"     element={<Volunteer />} />
          <Route path="/archive"       element={<Archive />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
