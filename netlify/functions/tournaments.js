const jwt = require('jsonwebtoken')
const { supabase } = require('./db')

const JWT_SECRET = process.env.JWT_SECRET || 'cgu_bgmi_super_secret_key_2025'

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }

  const auth = event.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }

  try {
    jwt.verify(token, JWT_SECRET)
  } catch {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) }
  }

  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('id, name, description, date, time, max_players, registered_count, prize_pool, status')
      .order('date', { ascending: true })

    if (error) throw error

    const tournaments = (data || []).map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      date: t.date,
      time: t.time,
      maxPlayers: t.max_players,
      registeredCount: t.registered_count,
      prizePool: t.prize_pool,
      status: t.status,
    }))

    return { statusCode: 200, body: JSON.stringify({ tournaments }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch tournaments: ' + err.message }) }
  }
}
