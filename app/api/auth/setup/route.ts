import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Uses the service role key to create the yvon786 user via admin API.
// Call once: GET /api/auth/setup
// Idempotent — safe to call multiple times (won't duplicate the user).

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const email = 'yvon786@yvon.app'
  const password = 'Novizio@1998'

  // Check if user already exists
  const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
  const alreadyExists = existing?.users?.some((u) => u.email === email)

  if (alreadyExists) {
    return NextResponse.json({ status: 'already_exists', email })
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,   // skip email verification
    user_metadata: { display_name: 'yvon786', role: 'admin' },
  })

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'created', email, userId: data.user?.id })
}
