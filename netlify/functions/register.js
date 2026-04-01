const bcrypt = require('bcryptjs')
const { supabase } = require('./db')

const CGU_DOMAIN = '@cgu-odisha.ac.in'
const MAX_SLOTS = 90

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
    // Check total registered players — enforce 90 slot limit (first come first serve)
    const { count, error: countError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    if (count >= MAX_SLOTS) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: 'SLOTS_FULL',
          message: `All ${MAX_SLOTS} slots have been filled. We're sorry — registrations are now closed. Thank you for your interest and we hope to see you in the next tournament!`
        })
      }
    }

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

    // Calculate slot number for this player
    const slotNumber = (count || 0) + 1

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Registration successful',
        slotNumber,
        slotsRemaining: MAX_SLOTS - slotNumber,
      })
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error: ' + err.message }) }
  }
}
