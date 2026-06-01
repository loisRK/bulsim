import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home       from './pages/Home'
import About      from './pages/About'
import Notice     from './pages/Notice'
import Schedule   from './pages/Schedule'
import News       from './pages/News'
import Education  from './pages/Education'
import Events     from './pages/Events'
import Volunteer  from './pages/Volunteer'

// 페이지 이동 시 스크롤 최상단으로
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/notice"     element={<Notice />} />
          <Route path="/schedule"   element={<Schedule />} />
          <Route path="/news"       element={<News />} />
          <Route path="/education"  element={<Education />} />
          <Route path="/events"     element={<Events />} />
          <Route path="/volunteer"  element={<Volunteer />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
