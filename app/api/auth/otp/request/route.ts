import { NextRequest, NextResponse } from 'next/server'
import { requestMobileOtp } from '@/src/lib/otp-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (typeof body.mobile !== 'string') return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 })
    const result = await requestMobileOtp(body.mobile)
    return NextResponse.json({ ok: true, mobile: result.mobile, expiresInSeconds: result.expiresInSeconds })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const clientErrors = new Set([
      'Invalid mobile number',
      'Please wait before requesting another OTP',
      'OTP delivery is not configured',
    ])
    if (clientErrors.has(message)) return NextResponse.json({ error: message }, { status: 400 })
    return NextResponse.json({ error: 'Unable to send OTP' }, { status: 503 })
  }
}
