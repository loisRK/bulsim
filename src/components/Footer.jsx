import { Link } from 'react-router-dom'
import { NAV, TEMPLE } from '../data/staticData'

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="main">{TEMPLE.fullName}</div>
          <div className="en">{TEMPLE.englishName}</div>
          <p>
            주소: {TEMPLE.address}<br />
            TEL: {TEMPLE.tel}<br />
            EMAIL: {TEMPLE.email}
          </p>
        </div>
        <div className="footer-links">
          {NAV.map(item => (
            <div key={item.href} className="footer-col">
              <h5>{item.label}</h5>
              <ul>
                {item.sub?.map(s => (
                  <li key={s.href}>
                    <Link to={s.href}>{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        Copyright © {TEMPLE.fullName} All rights reserved.
      </div>
    </footer>
  )
}
