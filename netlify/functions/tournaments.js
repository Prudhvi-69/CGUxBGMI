const jwt = require('jsonwebtoken')
const { getPool } = require('./db')

const JWT_SECRET = process.env.JWT_SECRET || 'cgu_bgmi_secret_2025'

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
    const pool = getPool()

    // Ensure tournaments table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        date DATE,
        time VARCHAR(20),
        max_players INT DEFAULT 100,
        registered_count INT DEFAULT 0,
        prize_pool VARCHAR(50),
        status ENUM('upcoming','live','completed') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const [rows] = await pool.execute(
      'SELECT id, name, description, date, time, max_players AS maxPlayers, registered_count AS registeredCount, prize_pool AS prizePool, status FROM tournaments ORDER BY date ASC'
    )

    return { statusCode: 200, body: JSON.stringify({ tournaments: rows }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch tournaments' }) }
  }
}
