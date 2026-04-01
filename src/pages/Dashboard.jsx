import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Calendar, Users, Clock, Gamepad2, Wifi, Map, MessageCircle, X, Shield, Info } from 'lucide-react'
import Navbar from '../components/Navbar'

const STATUS_COLORS = {
  upcoming: 'text-bgmi-gold border-bgmi-gold',
  live: 'text-green-400 border-green-400',
  completed: 'text-gray-500 border-gray-500',
}

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const user = JSON.parse(localStorage.getItem('cgu_user') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('cgu_token')
    fetch('/.netlify/functions/tournaments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setTournaments(data.tournaments || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t => t.status === filter)

  const openParticipate = (t) => {
    setSelected(t)
    setShowConfirm(true)
  }

  const handleJoinWhatsApp = () => {
    window.open(selected.whatsappLink, '_blank', 'noopener,noreferrer')
    setShowConfirm(false)
  }

  return (
    <div className="relative min-h-screen z-10">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16">

        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="neon-border rounded-xl p-4 sm:p-6 bg-bgmi-card mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-gray-500 font-gaming text-xs tracking-widest">WELCOME BACK, SOLDIER</p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1 truncate">
                {user.ign || user.name || 'Player'}
                <span className="text-bgmi-orange ml-2 text-base sm:text-lg">#{user.bgmiId}</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm font-gaming mt-0.5 truncate">{user.email}</p>
            </div>
            <div className="flex gap-4 sm:gap-6 flex-shrink-0">
              <StatBadge label="MATCH TYPE" value={user.matchType?.toUpperCase() || 'SOLO'} />
              <StatBadge label="STATUS" value="ACTIVE" color="text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Tournaments Header + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-5 sm:mb-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-widest flex items-center gap-2">
            <Trophy className="text-bgmi-gold w-5 h-5 flex-shrink-0" /> TOURNAMENTS
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'upcoming', 'live', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-display tracking-wider rounded border transition-all flex-shrink-0 touch-manipulation ${
                  filter === f ? 'bg-bgmi-orange border-bgmi-orange text-black' : 'border-bgmi-border text-gray-500 hover:border-bgmi-orange hover:text-white'
                }`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-bgmi-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="neon-border rounded-xl p-8 bg-bgmi-card text-center">
            <Wifi className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-gaming">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="neon-border rounded-xl p-10 sm:p-16 bg-bgmi-card text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
            <h4 className="font-display text-lg sm:text-xl text-gray-600 tracking-widest">NO TOURNAMENTS YET</h4>
            <p className="text-gray-700 font-gaming mt-2 text-sm">Check back soon.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="tournament-card neon-border rounded-xl bg-bgmi-card overflow-hidden group flex flex-col">

              {/* Top accent bar */}
              <div className={`h-1 w-full flex-shrink-0 ${t.status === 'live' ? 'bg-green-400' : t.status === 'upcoming' ? 'bg-bgmi-gold' : 'bg-gray-700'}`} />

              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">

                {/* Status + icon */}
                <div className="flex items-start justify-between">
                  <span className={`text-xs font-display tracking-widest border px-2 py-0.5 rounded ${STATUS_COLORS[t.status] || STATUS_COLORS.upcoming}`}>
                    {t.status === 'live' && '🔴 '}{t.status?.toUpperCase()}
                  </span>
                  <Gamepad2 className="text-gray-700 w-5 h-5 group-hover:text-bgmi-orange transition-colors flex-shrink-0" />
                </div>

                {/* Title */}
                <div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-bgmi-gold transition-colors leading-snug">
                    {t.name}
                  </h4>
                  {t.description && (
                    <p className="text-gray-500 text-xs font-gaming mt-1 leading-relaxed">{t.description}</p>
                  )}
                </div>

                {/* Details grid */}
                <div className="space-y-1.5 text-xs font-gaming text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-bgmi-orange flex-shrink-0" />
                    <span>{t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-bgmi-orange flex-shrink-0" />
                    <span>{t.time || 'TBA'}</span>
                  </div>
                  {t.matchType && (
                    <div className="flex items-center gap-2">
                      <Shield size={13} className="text-bgmi-orange flex-shrink-0" />
                      <span>{t.matchType}</span>
                    </div>
                  )}
                  {t.mapName && (
                    <div className="flex items-center gap-2">
                      <Map size={13} className="text-bgmi-orange flex-shrink-0" />
                      <span>{t.mapName}</span>
                    </div>
                  )}
                  {t.maxPlayers && (
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-bgmi-orange flex-shrink-0" />
                      <span>{t.registeredCount || 0}/{t.maxPlayers} players</span>
                    </div>
                  )}
                  {t.eligibleYears && (
                    <div className="flex items-start gap-2">
                      <Info size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-yellow-500">{t.eligibleYears}</span>
                    </div>
                  )}
                </div>

                {/* Room info notice */}
                {t.roomInfo && (
                  <div className="bg-bgmi-dark border border-bgmi-border rounded-lg px-3 py-2 text-xs font-gaming text-gray-400">
                    🔐 {t.roomInfo}
                  </div>
                )}

                {/* Prize pool */}
                {t.prizePool && (
                  <div className="pt-2 border-t border-bgmi-border flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-gaming tracking-wider">PRIZE POOL</span>
                    <span className="font-display font-bold text-bgmi-gold text-sm sm:text-base">₹{t.prizePool}</span>
                  </div>
                )}

                {/* Participate button — only if whatsapp link exists */}
                {t.whatsappLink && (
                  <button
                    onClick={() => openParticipate(t)}
                    className="btn-gaming mt-auto w-full py-2.5 text-xs font-display tracking-widest bg-green-600 hover:bg-green-500 text-white rounded flex items-center justify-center gap-2 transition-all touch-manipulation">
                    <MessageCircle size={14} /> PARTICIPATE
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Participate Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowConfirm(false)}>

            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="neon-border-gold rounded-xl bg-bgmi-card p-6 sm:p-8 w-full max-w-md">

              <div className="flex items-start justify-between mb-4">
                <MessageCircle className="text-green-400 w-8 h-8" />
                <button onClick={() => setShowConfirm(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <h3 className="font-display text-xl font-bold text-white tracking-widest mb-2">JOIN WHATSAPP GROUP</h3>
              <p className="text-gray-400 font-gaming text-sm mb-1">
                You're about to join the official WhatsApp group for:
              </p>
              <p className="text-bgmi-gold font-display font-bold mb-4">{selected.name}</p>

              <div className="bg-bgmi-dark border border-bgmi-border rounded-lg p-3 mb-5 text-xs font-gaming text-gray-500 space-y-1">
                <p>📢 Room ID and password will be shared in this group before the match.</p>
                <p>⚠️ Only join if you intend to participate.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 font-display text-sm tracking-widest border border-bgmi-border text-gray-500 rounded hover:border-bgmi-orange hover:text-white transition-all touch-manipulation">
                  CANCEL
                </button>
                <button onClick={handleJoinWhatsApp}
                  className="btn-gaming flex-1 py-3 font-display text-sm tracking-widest bg-green-600 hover:bg-green-500 text-white rounded flex items-center justify-center gap-2 transition-all touch-manipulation">
                  <MessageCircle size={14} /> JOIN NOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatBadge({ label, value, color = 'text-bgmi-gold' }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-600 font-gaming tracking-widest">{label}</p>
      <p className={`font-display font-bold text-sm ${color}`}>{value}</p>
    </div>
  )
}
