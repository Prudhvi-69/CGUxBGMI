import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Gamepad2, Menu, X } from 'lucide-react'

export default function Navbar({ showAuth = true }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('cgu_token')
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('cgu_token')
    localStorage.removeItem('cgu_user')
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,107,0,0.1)' }}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Gamepad2 className="text-bgmi-orange w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
          <span className="font-display text-lg sm:text-xl font-bold tracking-widest">
            <span className="text-white">CGU</span>
            <span className="text-bgmi-orange">×</span>
            <span className="text-bgmi-gold">BGMI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {showAuth && (
          <div className="hidden sm:flex items-center gap-4">
            {token ? (
              <button onClick={logout}
                className="flex items-center gap-2 text-sm font-gaming text-gray-400 hover:text-bgmi-orange transition-colors">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-gaming text-gray-400 hover:text-white transition-colors tracking-wider">LOGIN</Link>
                <Link to="/register"
                  className="btn-gaming px-4 py-2 text-sm font-gaming font-bold tracking-wider bg-bgmi-orange text-black rounded hover:bg-bgmi-gold transition-colors">
                  REGISTER
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        {showAuth && (
          <button className="sm:hidden text-gray-400 hover:text-bgmi-orange transition-colors p-1"
            onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {showAuth && menuOpen && (
        <div className="sm:hidden border-t border-bgmi-border px-4 py-4 flex flex-col gap-3"
          style={{ background: 'rgba(10,10,15,0.99)' }}>
          {token ? (
            <button onClick={logout}
              className="flex items-center gap-2 text-sm font-gaming text-gray-400 hover:text-bgmi-orange transition-colors py-2">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-sm font-gaming text-gray-400 hover:text-white transition-colors tracking-wider py-2">LOGIN</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="btn-gaming px-4 py-3 text-sm font-gaming font-bold tracking-wider bg-bgmi-orange text-black rounded text-center hover:bg-bgmi-gold transition-colors">
                REGISTER
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
