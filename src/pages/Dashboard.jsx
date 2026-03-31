import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Users, Clock, Gamepad2, ChevronRight, Wifi } from 'lucide-react'
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

        {/* Tournaments Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-5 sm:mb-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-widest flex items-center gap-2">
            <Trophy className="text-bgmi-gold w-5 h-5 flex-shrink-0" /> UPCOMING TOURNAMENTS
          </h3>
          {/* Filter tabs — scrollable on mobile */}
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
            <p className="text-gray-600 text-sm font-gaming mt-2">Make sure the backend is connected</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="neon-border rounded-xl p-10 sm:p-16 bg-bgmi-card text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
            <h4 className="font-display text-lg sm:text-xl text-gray-600 tracking-widest">NO TOURNAMENTS YET</h4>
            <p className="text-gray-700 font-gaming mt-2 text-sm">Check back soon. Tournaments will be announced here.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="tournament-card neon-border rounded-xl bg-bgmi-card overflow-hidden cursor-pointer group">

              {/* Card top accent */}
              <div className={`h-1 w-full ${t.status === 'live' ? 'bg-green-400' : t.status === 'upcoming' ? 'bg-bgmi-gold' : 'bg-gray-700'}`} />

              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-display tracking-widest border px-2 py-0.5 rounded ${STATUS_COLORS[t.status] || STATUS_COLORS.upcoming}`}>
                    {t.status === 'live' && '🔴 '}{t.status?.toUpperCase()}
                  </span>
                  <Gamepad2 className="text-gray-700 w-5 h-5 group-hover:text-bgmi-orange transition-colors flex-shrink-0" />
                </div>

                <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1 tracking-wide group-hover:text-bgmi-gold transition-colors leading-snug">
                  {t.name}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm font-gaming mb-3 sm:mb-4 line-clamp-2">{t.description}</p>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm font-gaming text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-bgmi-orange flex-shrink-0" />
                    <span>{t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-bgmi-orange flex-shrink-0" />
                    <span>{t.time || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={13} className="text-bgmi-orange flex-shrink-0" />
                    <span>{t.maxPlayers ? `${t.registeredCount || 0}/${t.maxPlayers} players` : 'Open'}</span>
                  </div>
                </div>

                {t.prizePool && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-bgmi-border flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-gaming tracking-wider">PRIZE POOL</span>
                    <span className="font-display font-bold text-bgmi-gold text-sm sm:text-base">₹{t.prizePool}</span>
                  </div>
                )}

                <button className="mt-3 sm:mt-4 w-full py-2 text-xs font-display tracking-widest border border-bgmi-border text-gray-500 rounded hover:border-bgmi-orange hover:text-bgmi-orange transition-all flex items-center justify-center gap-1 touch-manipulation">
                  VIEW DETAILS <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
