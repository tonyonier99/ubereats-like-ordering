import Link from 'next/link'
import Image from 'next/image'

interface Restaurant {
  id: string
  name: string
  description?: string | null
  image?: string | null
  address: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link 
      href={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      {restaurant.image && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
      {restaurant.description && (
        <p className="text-gray-600 mb-2 line-clamp-2">{restaurant.description}</p>
      )}
      <p className="text-sm text-gray-500">{restaurant.address}</p>
    </Link>
  )
}