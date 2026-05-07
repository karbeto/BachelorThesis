import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Преглед' },
  { to: '/reports', icon: FileText, label: 'Пријави' },
  { to: '/ideas', icon: Lightbulb, label: 'Идеи' },
  { to: '/admin', icon: Settings, label: 'Администрација' },
]

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = () => {
    setLoggingOut(true)
    setTimeout(() => {
      logout()
      navigate('/login')
    }, 300)
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #64748B;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }

        .nav-link:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .nav-link.active {
          background: #0F172A;
          color: #FFFFFF;
        }

        .nav-link.active svg {
          color: #38BDF8;
        }

        .logout-btn:hover {
          background: #FEF2F2 !important;
          color: #EF4444 !important;
        }

        .logout-btn:hover svg {
          color: #EF4444 !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .main-content {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: collapsed ? 68 : 240,
      }}>

        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#0F172A" />
              <circle cx="18" cy="18" r="7" fill="#38BDF8" />
              <circle cx="18" cy="18" r="3" fill="#0F172A" />
              <circle cx="27" cy="11" r="2.5" fill="#38BDF8" opacity="0.5" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div style={styles.logoTitle}>Граѓански</div>
              <div style={styles.logoSub}>Активизам</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={styles.sidebarBottom}>
          <div style={styles.divider} />

          {/* User info */}
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            {!collapsed && (
              <div style={styles.userInfo}>
                <div style={styles.userName}>
                  {user?.full_name || 'Admin'}
                </div>
                <div style={styles.userRole}>
                  {user?.role === 'superadmin' ? 'Супер Админ' : 'Општина Админ'}
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="nav-link logout-btn"
            style={styles.logoutBtn}
            title={collapsed ? 'Одјави се' : undefined}
          >
            <LogOut size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
            {!collapsed && 'Одјави се'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main} className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    background: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    flexShrink: 0,
    zIndex: 10,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '4px 4px 4px 4px',
    marginBottom: 4,
    position: 'relative',
  },
  logoIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0F172A',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
  logoSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: 400,
    whiteSpace: 'nowrap',
  },
  collapseBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94A3B8',
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    borderRadius: 6,
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  divider: {
    height: 1,
    background: '#F1F5F9',
    margin: '12px 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  sidebarBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: '#0F172A',
    color: '#38BDF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0F172A',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: 11,
    color: '#94A3B8',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    textAlign: 'left',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    minWidth: 0,
  },
}