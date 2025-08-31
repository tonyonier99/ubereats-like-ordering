import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, address, phone, ownerId } = body

    if (!name || !address || !ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify owner exists and has correct role
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    })

    if (!owner || owner.role !== 'RESTAURANT_OWNER') {
      return NextResponse.json(
        { error: 'Invalid owner' },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        phone,
        ownerId,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}