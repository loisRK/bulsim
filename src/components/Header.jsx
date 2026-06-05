import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { NAV, TEMPLE } from '../data/staticData'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header id="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-symbol">佛</div>
          <div className="logo-text">
            <div className="sub">{TEMPLE.mountain}</div>
            <div className="main">{TEMPLE.name}</div>
          </div>
        </Link>

        <nav>
          <ul id="gnb" className={menuOpen ? 'open' : ''}>
            {NAV.map(item => (
              <li key={item.href} className={`gnb-item${pathname === item.href ? ' active' : ''}`}>
                <Link to={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
                {item.sub?.length > 0 && (
                  <div className="dropdown">
                    {item.sub.map(s => (
                      <Link key={s.href} to={s.href} onClick={() => setMenuOpen(false)}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          id="menu-btn"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setMenuOpen(v => !v)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size="lg" />
        </button>
      </div>
    </header>
  )
}
