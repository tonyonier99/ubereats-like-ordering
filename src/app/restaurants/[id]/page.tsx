'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number
  image?: string | null
}

interface Category {
  id: string
  name: string
  description?: string | null
  menuItems: MenuItem[]
}

interface Restaurant {
  id: string
  name: string
  description?: string | null
  address: string
  phone?: string | null
  image?: string | null
  categories: Category[]
  menuItems: MenuItem[]
  owner: {
    name: string | null
    email: string
  }
}

interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    fetchRestaurant()
  }, [params.id])

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant')
      }
      const data = await response.json()
      setRestaurant(data)
    } catch (error) {
      setError('Failed to load restaurant')
      console.error('Error fetching restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItemId === menuItem.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }]
    })
  }

  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItemId === menuItemId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prevCart.filter(item => item.menuItemId !== menuItemId)
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          items: cart.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      alert(`Order placed successfully! Order ID: ${order.id}`)
      setCart([])
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading restaurant...</p>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Restaurant not found'}</p>
        <button 
          onClick={() => router.push('/restaurants')}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to Restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {restaurant.image && (
            <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
            )}
            <div className="space-y-1 text-sm text-gray-500">
              <p>📍 {restaurant.address}</p>
              {restaurant.phone && <p>📞 {restaurant.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu */}
        <div className="lg:col-span-2 space-y-6">
          {/* Uncategorized Items */}
          {restaurant.menuItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
              <div className="space-y-4">
                {restaurant.menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                      <p className="text-green-600 font-semibold mt-2">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {restaurant.categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-gray-600 mb-4">{category.description}</p>
              )}
              <div className="space-y-4">
                {category.menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                      <p className="text-green-600 font-semibold mt-2">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-green-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          −
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => addToCart({
                            id: item.menuItemId,
                            name: item.name,
                            price: item.price,
                            description: null
                          })}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCheckingOut ? 'Placing Order...' : 'Checkout'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}