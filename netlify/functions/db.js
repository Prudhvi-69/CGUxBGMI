const mysql = require('mysql2/promise')

let pool

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'Students@69',
      database: process.env.DB_NAME || 'cgubgmi',
      waitForConnections: true,
      connectionLimit: 5,
    })
  }
  return pool
}

module.exports = { getPool }
