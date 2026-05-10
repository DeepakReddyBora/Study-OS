import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  {
    path: '/',
    label: 'Dashboard',
    section: 'overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: '/plan',
    label: 'Study Plan',
    section: 'overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    path: '/analytics',
    label: 'Analytics',
    section: 'overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M3 3v18h18M8 17V12M13 17V8M18 17V5"/>
      </svg>
    ),
  },
  {
    path: '/assistant',
    label: 'AI Assistant',
    section: 'overview',
    badge: 'AI',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    path: '/missed',
    label: 'Missed Tasks',
    section: 'overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    section: 'account',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
      </svg>
    ),
  },
]

function NavLink({ link, isActive, onClick }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
        ${isActive
          ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
        }`}
    >
      <span className={isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-white transition'}>
        {link.icon}
      </span>
      <span className="flex-1">{link.label}</span>
      {link.badge && (
        <span className="bg-violet-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {link.badge}
        </span>
      )}
    </Link>
  )
}

function SidebarContent({ onLinkClick }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const overviewLinks = navLinks.filter((l) => l.section === 'overview')
  const accountLinks = navLinks.filter((l) => l.section === 'account')

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-violet-400 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          Study<span className="text-violet-400">OS</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-3">
          Overview
        </p>
        {overviewLinks.map((link) => (
          <NavLink
            key={link.path}
            link={link}
            isActive={location.pathname === link.path}
            onClick={onLinkClick}
          />
        ))}

        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-3 pt-4">
          Account
        </p>
        {accountLinks.map((link) => (
          <NavLink
            key={link.path}
            link={link}
            isActive={location.pathname === link.path}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 mb-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 text-sm transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-60 bg-zinc-900 border-r border-zinc-800 flex-col z-50">
        <SidebarContent onLinkClick={() => {}} />
      </aside>

      {/* ── Mobile Topbar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-violet-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            Study<span className="text-violet-400">OS</span>
          </span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}