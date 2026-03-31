import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Gamepad2 } from 'lucide-react'
import Navbar from '../components/Navbar'

const CGU_DOMAIN = '@cgu-odisha.ac.in'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.endsWith(CGU_DOMAIN)) e.email = `Must be a ${CGU_DOMAIN} email`
    if (!form.password) e.password = 'Password is required'
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
      const res = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('cgu_token', data.token)
      localStorage.setItem('cgu_user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen z-10">
      <Navbar showAuth={false} />
      <div className="flex items-start sm:items-center justify-center min-h-screen px-4 pt-20 pb-8 sm:pt-0">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          <div className="text-center mb-6 sm:mb-8">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-bgmi-gold mx-auto mb-2 sm:mb-3 animate-float" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-widest">WELCOME BACK</h1>
            <p className="text-gray-500 font-gaming mt-1 text-sm">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="neon-border-gold rounded-xl p-5 sm:p-8 bg-bgmi-card space-y-4 sm:space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-display text-gray-500 tracking-widest mb-2">CGU EMAIL</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors input-glow ${
                errors.email ? 'border-red-500' : 'border-bgmi-border hover:border-bgmi-gold'
              } bg-black/30`}>
                <Mail size={16} className="text-bgmi-gold flex-shrink-0" />
                <input name="email" value={form.email} onChange={handleChange}
                  placeholder="yourname@cgu-odisha.ac.in" type="email"
                  autoComplete="email"
                  className="flex-1 min-w-0 bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none text-sm" />
              </div>
              {errors.email && <p className="text-red-400 text-xs font-gaming mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-display text-gray-500 tracking-widest mb-2">PASSWORD</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors input-glow ${
                errors.password ? 'border-red-500' : 'border-bgmi-border hover:border-bgmi-gold'
              } bg-black/30`}>
                <Lock size={16} className="text-bgmi-gold flex-shrink-0" />
                <input name="password" value={form.password} onChange={handleChange}
                  type={showPass ? 'text' : 'password'} placeholder="Your password"
                  autoComplete="current-password"
                  className="flex-1 min-w-0 bg-transparent text-white font-gaming placeholder-gray-600 focus:outline-none text-sm" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="text-gray-500 hover:text-white flex-shrink-0 touch-manipulation p-1">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs font-gaming mt-1">{errors.password}</p>}
            </div>

            {errors.submit && (
              <p className="text-red-400 text-sm font-gaming text-center bg-red-900/20 rounded p-2">{errors.submit}</p>
            )}

            <button type="submit" disabled={loading}
              className="btn-gaming w-full py-3 sm:py-4 font-display font-bold text-sm tracking-widest bg-bgmi-gold text-black rounded hover:bg-bgmi-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">
              {loading ? 'AUTHENTICATING...' : 'ENTER →'}
            </button>

            <p className="text-center text-gray-600 text-sm font-gaming">
              New player?{' '}
              <Link to="/register" className="text-bgmi-gold hover:text-bgmi-orange transition-colors">Register here</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
