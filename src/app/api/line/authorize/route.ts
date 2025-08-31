import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'user' or 'restaurant'
    const restaurantId = searchParams.get('restaurantId')

    // Check if LINE credentials are configured
    const clientId = process.env.LINE_CLIENT_ID
    const redirectUri = process.env.LINE_REDIRECT_URI

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'LINE Notify not configured' },
        { status: 500 }
      )
    }

    // Generate state parameter for security
    const state = `${type}-${session.user.id}${restaurantId ? `-${restaurantId}` : ''}`
    
    // Build LINE Notify authorization URL
    const authUrl = new URL('https://notify-bot.line.me/oauth/authorize')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'notify')
    authUrl.searchParams.set('state', state)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error in LINE authorize:', error)
    return NextResponse.json(
      { error: 'Failed to initiate LINE authorization' },
      { status: 500 }
    )
  }
}