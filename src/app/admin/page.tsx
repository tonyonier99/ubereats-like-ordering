'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  address: string
  isActive: boolean
  owner: {
    name: string | null
    email: string
  }
  _count: {
    menuItems: number
    orders: number
  }
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  customer: {
    name: string | null
    email: string
  }
  restaurant: {
    name: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, ordersRes] = await Promise.all([
        fetch('/api/restaurants'),
        fetch('/api/admin/orders')
      ])

      if (!restaurantsRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const restaurantsData = await restaurantsRes.json()
      const ordersData = await ordersRes.json()

      setRestaurants(restaurantsData)
      setOrders(ordersData)
    } catch (error) {
      setError('Failed to load dashboard data')
      console.error('Error fetching dashboard data:', error)
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
          onClick={fetchDashboardData}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage restaurants, users, and orders</p>
        </div>
        <Link
          href="/admin/new-restaurant"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add Restaurant
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Restaurants</h3>
          <p className="text-3xl font-bold text-green-600">{restaurants.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Restaurants</h3>
          <p className="text-3xl font-bold text-blue-600">
            {restaurants.filter(r => r.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Orders</h3>
          <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
          <div className="space-y-3">
            {restaurants.slice(0, 5).map((restaurant) => (
              <div key={restaurant.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{restaurant.name}</h4>
                  <p className="text-sm text-gray-600">{restaurant.owner.name || restaurant.owner.email}</p>
                  <p className="text-xs text-gray-500">{restaurant.address}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    restaurant.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {restaurant._count.menuItems} items, {restaurant._count.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
          {restaurants.length > 5 && (
            <p className="text-center text-gray-500 mt-4">
              And {restaurants.length - 5} more...
            </p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                  <p className="text-sm text-gray-600">{order.customer.name || order.customer.email}</p>
                  <p className="text-xs text-gray-500">{order.restaurant.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {orders.length > 5 && (
            <p className="text-center text-gray-500 mt-4">
              And {orders.length - 5} more...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}