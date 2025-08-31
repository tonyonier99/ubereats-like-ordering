import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('LINE OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile?error=line_auth_failed`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile?error=invalid_callback`)
    }

    // Parse state parameter
    const stateParts = state.split('-')
    if (stateParts.length < 2) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile?error=invalid_state`)
    }

    const type = stateParts[0] // 'user' or 'restaurant'
    const userId = stateParts[1]
    const restaurantId = stateParts[2] || null

    // Exchange code for access token
    const tokenResponse = await fetch('https://notify-bot.line.me/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINE_REDIRECT_URI!,
        client_id: process.env.LINE_CLIENT_ID!,
        client_secret: process.env.LINE_CLIENT_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    
    // Save notification channel to database
    await prisma.notificationChannel.create({
      data: {
        type: 'LINE',
        token: tokenData.access_token,
        isActive: true,
        userId: type === 'user' ? userId : null,
        restaurantId: type === 'restaurant' ? restaurantId : null,
      },
    })

    // Redirect back to appropriate page
    const redirectUrl = type === 'restaurant' 
      ? `/merchant/${restaurantId}/notifications?success=line_connected`
      : `/profile?success=line_connected`

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}${redirectUrl}`)
  } catch (error) {
    console.error('Error in LINE callback:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile?error=line_callback_failed`)
  }
}