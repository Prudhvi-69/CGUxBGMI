const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mqdwzqehgdeirrvezpqp.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZHd6cWVoZ2RlaXJydmV6cHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Njc5MTMsImV4cCI6MjA5MDU0MzkxM30.QzwWGhz0tSyia29g0AfKc0uVV7oZU3yb6sXhlS_V6bQ'
)

module.exports = { supabase }
