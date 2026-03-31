import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Users, Zap, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: Trophy, title: 'Tournaments', desc: 'Compete in official CGU BGMI tournaments with real prizes' },
  { icon: Users, title: 'Squad Up', desc: 'Find teammates from your college and dominate together' },
  { icon: Zap, title: 'Live Updates', desc: 'Real-time match scores and bracket updates' },
  { icon: Shield, title: 'Verified Players', desc: 'Only verified CGU students can participate' },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen z-10">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-5 pt-16 pb-8">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="w-full max-w-2xl">
          <p className="font-display text-bgmi-orange text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] mb-3 sm:mb-4 uppercase">
            C.V. Raman Global University
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-black mb-1 sm:mb-2 leading-none">
            <span className="glitch text-white" data-text="CGU">CGU</span>
          </h1>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-black mb-5 sm:mb-6 leading-none">
            <span className="glitch text-bgmi-gold" data-text="× BGMI">× BGMI</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl font-gaming max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            The official BGMI tournament platform for CGU students.<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Register. Compete. Dominate.
          </p>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link to="/register"
              className="btn-gaming px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-sm tracking-widest bg-bgmi-orange text-black rounded animate-pulse-glow hover:bg-bgmi-gold transition-all">
              JOIN THE BATTLE
            </Link>
            <Link to="/login"
              className="btn-gaming px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-sm tracking-widest neon-border text-bgmi-orange rounded hover:bg-bgmi-orange hover:text-black transition-all">
              SIGN IN
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-bgmi-orange to-transparent" />
          <span className="text-xs text-gray-600 tracking-widest font-gaming">SCROLL</span>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <motion.div className="max-w-5xl mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2 text-white tracking-widest">
            WHY <span className="text-bgmi-orange">CGU×BGMI</span>?
          </h2>
          <div className="w-24 h-px bg-bgmi-orange mx-auto mb-10 sm:mb-12" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="neon-border rounded-lg p-4 sm:p-6 bg-bgmi-card text-center hover:border-bgmi-gold transition-colors group">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-bgmi-orange mx-auto mb-2 sm:mb-3 group-hover:text-bgmi-gold transition-colors" />
                <h3 className="font-display font-bold text-white mb-1 sm:mb-2 tracking-wider text-sm sm:text-base">{title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm font-gaming leading-relaxed hidden sm:block">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div className="max-w-3xl mx-auto text-center neon-border-gold rounded-xl p-8 sm:p-12 bg-bgmi-card"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-bgmi-gold mb-3 sm:mb-4 tracking-widest">READY TO PLAY?</h2>
          <p className="text-gray-400 font-gaming mb-6 sm:mb-8 text-sm sm:text-base">Use your CGU email to register and start competing today.</p>
          <Link to="/register"
            className="btn-gaming inline-block px-8 sm:px-10 py-3 sm:py-4 font-display font-bold text-sm tracking-widest bg-bgmi-gold text-black rounded hover:bg-bgmi-orange transition-all">
            REGISTER NOW →
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-6 sm:py-8 text-gray-700 text-xs sm:text-sm font-gaming border-t border-bgmi-border px-4">
        © 2025 CGU×BGMI · C.V. Raman Global University · All rights reserved
      </footer>
    </div>
  )
}
