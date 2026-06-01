import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import {
  LayoutDashboard, Package, ShoppingCart, Monitor,
  Users, BarChart3, Settings, FileText, LogOut,
  Menu, X, ChevronRight, Bike
} from 'lucide-react'

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/pos', label: 'POS', icon: Monitor },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/logs', label: 'System Logs', icon: FileText },
]

export default function Layout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(true)

  const active = (p) => pathname === p || pathname.startsWith(p + '/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 230 : 68,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200, transition: 'width 0.25s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', minHeight: 68 }}>
          {open && (
            <div>
              <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--text)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bike size={18} color="var(--green)" /> HW Admin
              </p>
              <p style={{ fontSize: 10, color: 'var(--muted)' }}>Hot Wheels Bikes</p>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm" style={{ padding: 7, flexShrink: 0 }}>
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          {NAV.map(({ path, label, icon: Icon }) => (
            <button key={path} onClick={() => navigate(path)} title={!open ? label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 13px', marginBottom: 3,
                background: active(path) ? 'rgba(74,222,128,0.12)' : 'transparent',
                border: active(path) ? '1px solid var(--borderMd)' : '1px solid transparent',
                borderRadius: 9, color: active(path) ? 'var(--green)' : 'var(--muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                justifyContent: open ? 'flex-start' : 'center',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!active(path)) e.currentTarget.style.background = 'rgba(74,222,128,0.06)' }}
              onMouseLeave={e => { if (!active(path)) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {open && label}
            </button>
          ))}
        </nav>

        {/* User */}
        {open && (
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{admin?.name}</p>
              <p style={{ color: 'var(--muted)', fontSize: 11 }}>Administrator</p>
            </div>
            <button onClick={logout} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
        {!open && (
          <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
            <button onClick={logout} title="Logout" className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center', padding: 8 }}>
              <LogOut size={15} />
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ marginLeft: open ? 230 : 68, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s ease' }}>
        {/* Header */}
        <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>Admin</span>
            <ChevronRight size={13} style={{ color: 'var(--muted)' }} />
            <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>
              {NAV.find(n => active(n.path))?.label ?? 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#000' }}>
              {admin?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
