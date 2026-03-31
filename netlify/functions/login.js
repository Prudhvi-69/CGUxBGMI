const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getPool } = require('./db')

const CGU_DOMAIN = '@cgu-odisha.ac.in'
const JWT_SECRET = process.env.JWT_SECRET || 'cgu_bgmi_secret_2025'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }

  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { email, password } = body

  if (!email?.endsWith(CGU_DOMAIN)) {
    return { statusCode: 400, body: JSON.stringify({ error: `Email must end with ${CGU_DOMAIN}` }) }
  }

  try {
    const pool = getPool()
    const [rows] = await pool.execute('SELECT * FROM players WHERE email = ?', [email])

    if (rows.length === 0) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid email or password' }) }

    const player = rows[0]
    const valid = await bcrypt.compare(password, player.password)
    if (!valid) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid email or password' }) }

    const token = jwt.sign({ id: player.id, email: player.email }, JWT_SECRET, { expiresIn: '7d' })

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: {
          id: player.id,
          name: player.name,
          email: player.email,
          bgmiId: player.bgmi_id,
          ign: player.ign,
          matchType: player.match_type,
        }
      })
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error. Please try again.' }) }
  }
}
