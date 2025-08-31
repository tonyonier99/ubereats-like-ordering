'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from '@/components/RestaurantCard'

interface Restaurant {
  id: string
  name: string
  description?: string | null
  image?: string | null
  address: string
  phone?: string | null
  owner: {
    name: string | null
    email: string
  }
  _count: {
    menuItems: number
  }
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants')
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading restaurants...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchRestaurants}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
        <p className="text-gray-600">
          Discover amazing restaurants and order your favorite meals
        </p>
      </div>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants available
            </h3>
            <p className="text-gray-600">
              Check back later for new restaurants in your area.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}