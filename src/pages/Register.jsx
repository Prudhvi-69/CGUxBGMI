import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Gamepad2, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'

const CGU_DOMAIN = '@cgu-odisha.ac.in'
const MAX_SLOTS = 90

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', bgmiId: '', ign: '', mobile: '', matchType: 'solo'
  })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null) // stores { slotNumber, slotsRemaining }
  const [slotsFull, setSlotsFull] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.endsWith(CGU_DOMAIN)) e.email = `Email must end with ${CGU_DOMAIN}`
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.bgmiId.trim()) e.bgmiId = 'BGMI ID is required'
    if (!form.ign.trim()) e.ign = 'In-Game Name is required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit Indian mobile number'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/.netlify/functions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error === 'SLOTS_FULL') {
        setSlotsFull(true)
        return
      }
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setSuccess({ slotNumber: data.slotNumber, slotsRemaining: data.slotsRemaining })
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  const emailValid = form.email.endsWith(CGU_DOMAIN) && form.email.length > CGU_DOMAIN.length

  // Slots full screen
  if (slotsFull) {
    return (
      <div className="min-h-screen flex items-center justify-center z-10 relative px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="font-display text-3xl sm:text-4xl text-bgmi-orange font-black tracking-widest mb-3">SLOTS FULL</h2>
          <div className="neon-border rounded-xl p-6 bg-bgmi-card mb-6">
            <p className="text-white font-gaming text-base leading-relaxed mb-2">
              All <span className="text-bgmi-gold font-bold">{MAX_SLOTS} slots</span> have been filled.
            </p>
            <p className="text-gray-400 font-gaming text-sm leading-relaxed">
              We're truly sorry — registrations are now closed on a first come, first serve basis.
              We hope to see you battle it out in our next tournament. Stay tuned! 🎮
            </p>
          </div>
          <Link to="/"
            className="btn-gaming inline-block px-8 py-3 font-display font-bold text-sm tracking-widest neon-border text-bgmi-orange rounded hover:bg-bgmi-orange hover:text-black transition-all">
            BACK TO HOME
          </Link>
        </motion.div>
      </div>
    )
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center z-10 relative px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl text-white font-black tracking-widest">YOU'RE IN!</h2>
          <p className="text-bgmi-gold font-display font-bold text-lg mt-2">Slot #{success.slotNumber} of {MAX_SLOTS}</p>
          {success.slotsRemaining > 0
            ? <p className="text-gray-500 font-gaming text-sm mt-1">{success.slotsRemaining} slots remaining</p>
            : <p className="text-bgmi-orange font-gaming text-sm mt-1">🔥 You got the last slot!</p>
          }
          <p className="text-gray-400 font-gaming text-sm mt-4">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen z-10">
      <Navbar />
      <div className="flex items-start justify-center min-h-screen px-4 pt-20 pb-8 sm:pt-24 sm:pb-12 sm:items-center">
        <motion.div className="w-full max-w-lg"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-bgmi-orange mx-auto mb-2 sm:mb-3 animate-float" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-widest">JOIN THE ARENA</h1>
            <p className="text-gray-500 font-gaming mt-1 text-sm">Register with your CGU email to compete</p>
          </div>

          <form onSubmit={handleSubmit} className="neon-border rounded-xl p-5 sm:p-8 bg-bgmi-card space-y-4 sm:space-y-5">

            {/* Full Name */}
            <Field label="FULL NAME" icon={<User size={16} />} error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none" />
            </Field>

            {/* Email */}
            <Field label="CGU EMAIL" icon={<Mail size={16} />} error={errors.email}
              suffix={form.email && (emailValid
                ? <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                : <XCircle size={16} className="text-red-400 flex-shrink-0" />)}>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="regID@cgu-odisha.ac.in" type="email"
                autoComplete="email"
                className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none text-sm" />
            </Field>

            {/* Password */}
            <Field label="PASSWORD" icon={<Eye size={16} />} error={errors.password}
              suffix={
                <button type="button" onClick={() => setShowPass(s => !s)} className="text-gray-500 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }>
              <input name="password" value={form.password} onChange={handleChange}
                type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none" />
            </Field>

            {/* BGMI ID */}
            <Field label="BGMI ID" icon={<Gamepad2 size={16} />} error={errors.bgmiId}>
              <input name="bgmiId" value={form.bgmiId} onChange={handleChange} placeholder="e.g. 5123456789"
                className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none" />
            </Field>

            {/* IGN */}
            <Field label="IGN (IN-GAME NAME)" icon={<User size={16} />} error={errors.ign}>
              <input name="ign" value={form.ign} onChange={handleChange} placeholder="Your BGMI username"
                className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none" />
            </Field>

            {/* Mobile */}
            <Field label="MOBILE NUMBER" icon={<Phone size={16} />} error={errors.mobile}>
              <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number"
                maxLength={10} className="w-full bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none" />
            </Field>

            {/* Match Type Toggle */}
            <div>
              <label className="block text-xs font-display text-gray-500 tracking-widest mb-2 sm:mb-3">MATCH TYPE</label>
              <div className="flex rounded-lg overflow-hidden neon-border">
                {['solo', 'squad'].map(type => (
                  <button key={type} type="button"
                    onClick={() => setForm(f => ({ ...f, matchType: type }))}
                    className={`flex-1 py-3 font-display text-sm font-bold tracking-widest transition-all touch-manipulation ${
                      form.matchType === type
                        ? 'bg-bgmi-orange text-black'
                        : 'bg-transparent text-gray-500 hover:text-white'
                    }`}>
                    {type === 'solo' ? '⚔️ SOLO' : '🛡️ SQUAD'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 font-gaming mt-1">
                {form.matchType === 'solo' ? 'You will compete individually' : 'You will compete as a 4-player squad'}
              </p>
            </div>

            {errors.submit && (
              <p className="text-red-400 text-sm font-gaming text-center bg-red-900/20 rounded p-2">{errors.submit}</p>
            )}

            <button type="submit" disabled={loading}
              className="btn-gaming w-full py-3 sm:py-4 font-display font-bold text-sm tracking-widest bg-bgmi-orange text-black rounded hover:bg-bgmi-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">
              {loading ? 'REGISTERING...' : 'ENTER THE BATTLEFIELD →'}
            </button>

            <p className="text-center text-gray-600 text-sm font-gaming">
              Already registered?{' '}
              <Link to="/login" className="text-bgmi-orange hover:text-bgmi-gold transition-colors">Sign In</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, icon, error, suffix, children }) {
  return (
    <div>
      <label className="block text-xs font-display text-gray-500 tracking-widest mb-2">{label}</label>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors input-glow ${
        error ? 'border-red-500' : 'border-bgmi-border hover:border-bgmi-orange'
      } bg-black/30`}>
        <span className="text-bgmi-orange flex-shrink-0">{icon}</span>
        <div className="flex-1">{children}</div>
        {suffix && <span className="flex-shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-red-400 text-xs font-gaming mt-1">{error}</p>}
    </div>
  )
}
