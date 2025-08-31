import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            menuItems: {
              where: {
                isAvailable: true,
              },
              orderBy: {
                name: 'asc',
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        menuItems: {
          where: {
            isAvailable: true,
            categoryId: null, // Items without category
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}