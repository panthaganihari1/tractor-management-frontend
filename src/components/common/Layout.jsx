import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'డాష్‌బోర్డ్', sub: 'Dashboard' },
  { to: '/tractor',   icon: '🚜', label: 'Tractor అద్దె', sub: 'Rental booking' },
  { to: '/nagali',    icon: '⚙️', label: 'నాగలి పని', sub: 'Nagali work' },
  { to: '/farmers',   icon: '👨‍🌾', label: 'రైతుల వివరాలు', sub: 'Farmers' },
  { to: '/finance',   icon: '💰', label: 'ఆదాయ-వ్యయాలు', sub: 'Income & Expense' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const currentPage = navItems.find(n => location.pathname.startsWith(n.to))

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setSidebarOpen(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--collapsed'} ${mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🚜</span>
          <div className="sidebar__logo-text">
            <div className="sidebar__logo-title">Tractor</div>
            <div className="sidebar__logo-sub">నిర్వహణ వ్యవస్థ</div>
          </div>
          <button
            type="button"
            className="sidebar__toggle sidebar__toggle--desktop"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <button
            type="button"
            className="sidebar__toggle sidebar__toggle--mobile"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <div className="sidebar__link-text">
                <div className="sidebar__link-label">{item.label}</div>
                <div className="sidebar__link-sub">{item.sub}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">Tractor Management v1.0</div>
      </aside>

      <div className="main-wrap">
        <header className="top-bar">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="top-bar__title">
            <span className="top-bar__icon">{currentPage?.icon}</span>
            <div className="top-bar__text">
              <span className="top-bar__label">{currentPage?.label}</span>
              <span className="top-bar__sub">{currentPage?.sub}</span>
            </div>
          </div>
          <div className="top-bar__date">
            {new Date().toLocaleDateString('te-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
