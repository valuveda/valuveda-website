import { NextRequest, NextResponse } from 'next/server'
import { verifyMobileOtp } from '@/src/lib/otp-service'
import { createCustomerSession, customerSessionCookie } from '@/src/lib/customer-session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (typeof body.mobile !== 'string' || typeof body.otp !== 'string') {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 })
    }

    const result = await verifyMobileOtp(body.mobile, body.otp)
    const session = createCustomerSession(result.customerId)
    const response = NextResponse.json({ ok: true })
    response.headers.append('Set-Cookie', customerSessionCookie(session))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const clientErrors = new Set([
      'Invalid mobile number',
      'Invalid OTP',
      'OTP expired',
      'OTP attempt limit reached',
    ])
    if (clientErrors.has(message)) return NextResponse.json({ error: message }, { status: 400 })
    return NextResponse.json({ error: 'Unable to verify OTP' }, { status: 503 })
  }
}
