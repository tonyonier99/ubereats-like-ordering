import Link from 'next/link'
import { RestaurantCard } from '@/components/RestaurantCard'

interface Restaurant {
  id: string
  name: string
  description?: string | null
  image?: string | null
  address: string
}

async function getRecentRestaurants(): Promise<Restaurant[]> {
  // For now, return empty array - will be implemented when API is ready
  return []
}

export default async function Home() {
  const restaurants = await getRecentRestaurants()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to UberEats-Like Ordering
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing restaurants and delicious food near you
        </p>
        <Link href="/restaurants" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Browse Restaurants
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Restaurants</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No restaurants available yet.</p>
            <Link href="/restaurants" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
              View All Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}