'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-green-600">
            UberEats-Like
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/restaurants" className="text-gray-700 hover:text-green-600">
              Restaurants
            </Link>
            
            {session ? (
              <>
                {session.user.role === 'RESTAURANT_OWNER' && (
                  <Link href="/merchant" className="text-gray-700 hover:text-green-600">
                    Merchant
                  </Link>
                )}
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-green-600">
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="text-gray-700 hover:text-green-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}