const bcrypt = require('bcryptjs')
const { supabase } = require('./db')

const CGU_DOMAIN = '@cgu-odisha.ac.in'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }

  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { name, email, password, bgmiId, ign, mobile, matchType } = body

  if (!email?.endsWith(CGU_DOMAIN))
    return { statusCode: 400, body: JSON.stringify({ error: `Email must end with ${CGU_DOMAIN}` }) }

  if (!name || !password || !bgmiId || !ign || !mobile)
    return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) }

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) return { statusCode: 409, body: JSON.stringify({ error: 'Email already registered' }) }

    const hashed = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('players').insert({
      name,
      email,
      password: hashed,
      bgmi_id: bgmiId,
      ign,
      mobile,
      match_type: matchType || 'solo',
    })

    if (error) throw error

    return { statusCode: 201, body: JSON.stringify({ message: 'Registration successful' }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error: ' + err.message }) }
  }
}
