const bcrypt = require('bcryptjs')
const { getPool } = require('./db')

const CGU_DOMAIN = '@cgu-odisha.ac.in'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }

  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { name, email, password, bgmiId, ign, mobile, matchType } = body

  if (!email?.endsWith(CGU_DOMAIN)) {
    return { statusCode: 400, body: JSON.stringify({ error: `Email must end with ${CGU_DOMAIN}` }) }
  }
  if (!name || !password || !bgmiId || !ign || !mobile) {
    return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) }
  }

  try {
    const pool = getPool()

    // Ensure table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bgmi_id VARCHAR(50) NOT NULL,
        ign VARCHAR(50) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        match_type ENUM('solo','squad') DEFAULT 'solo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const [existing] = await pool.execute('SELECT id FROM players WHERE email = ?', [email])
    if (existing.length > 0) return { statusCode: 409, body: JSON.stringify({ error: 'Email already registered' }) }

    const hashed = await bcrypt.hash(password, 10)
    await pool.execute(
      'INSERT INTO players (name, email, password, bgmi_id, ign, mobile, match_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashed, bgmiId, ign, mobile, matchType || 'solo']
    )

    return { statusCode: 201, body: JSON.stringify({ message: 'Registration successful' }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error. Please try again.' }) }
  }
}
