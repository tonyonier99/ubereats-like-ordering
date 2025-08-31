'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface NotificationChannel {
  id: string
  type: string
  isActive: boolean
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    fetchNotificationChannels()
  }, [session, status, router])

  const fetchNotificationChannels = async () => {
    try {
      // This would fetch user notification channels
      // For now, return empty array
      setNotifications([])
    } catch (error) {
      setError('Failed to load notification settings')
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLineConnect = () => {
    // This would redirect to LINE Notify authorization
    alert('LINE Notify integration would redirect to LINE authorization page')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and notification preferences</p>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{session?.user.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{session?.user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="text-gray-900">
              {session?.user.role === 'ADMIN' && 'Administrator'}
              {session?.user.role === 'RESTAURANT_OWNER' && 'Restaurant Owner'}
              {session?.user.role === 'USER' && 'Customer'}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">LINE Notify</h3>
              <p className="text-sm text-gray-600">
                Get order updates via LINE notifications
              </p>
            </div>
            <div>
              {notifications.some(n => n.type === 'LINE' && n.isActive) ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Connected
                </span>
              ) : (
                <button
                  onClick={handleLineConnect}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">About LINE Notify</h4>
          <p className="text-sm text-blue-800">
            Connect your LINE account to receive real-time notifications about your orders, 
            including status updates and delivery confirmations.
          </p>
        </div>
      </div>

      {/* Order History Link */}
      {session?.user.role === 'USER' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <p className="text-gray-600 mb-4">View your past orders and track current ones.</p>
          <button 
            onClick={() => alert('Order history feature would be implemented here')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View Orders
          </button>
        </div>
      )}
    </div>
  )
}