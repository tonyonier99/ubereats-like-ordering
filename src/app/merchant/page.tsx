'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  description?: string | null
  address: string
  phone?: string | null
  isActive: boolean
  _count: {
    menuItems: number
    orders: number
  }
}

export default function MerchantDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'RESTAURANT_OWNER') {
      router.push('/login')
      return
    }

    fetchOwnerRestaurants()
  }, [session, status, router])

  const fetchOwnerRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants/owned')
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
      setRestaurants(data)
    } catch (error) {
      setError('Failed to load restaurants')
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchOwnerRestaurants}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Merchant Dashboard</h1>
        <p className="text-gray-600">Manage your restaurants, menus, and orders</p>
      </div>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  restaurant.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {restaurant.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {restaurant.description}
                </p>
              )}
              
              <p className="text-gray-500 text-sm mb-4">📍 {restaurant.address}</p>
              
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Menu Items: {restaurant._count.menuItems}</span>
                <span>Orders: {restaurant._count.orders}</span>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/merchant/${restaurant.id}/menu`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Menu
                </Link>
                <Link
                  href={`/merchant/${restaurant.id}/orders`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Orders
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have any restaurants assigned to you yet. Contact an administrator to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}