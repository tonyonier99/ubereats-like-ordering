import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('password', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create restaurant owner
  const ownerPassword = await bcrypt.hash('password', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Restaurant Owner',
      password: ownerPassword,
      role: 'RESTAURANT_OWNER',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('password', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create demo restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'demo-restaurant-1' },
    update: {},
    create: {
      id: 'demo-restaurant-1',
      name: 'Demo Pizza Palace',
      description: 'Authentic Italian pizza and pasta',
      address: '123 Main St, Demo City',
      phone: '+1-555-0123',
      ownerId: owner.id,
    },
  })

  // Create categories
  const pizzaCategory = await prisma.category.upsert({
    where: { id: 'category-pizza' },
    update: {},
    create: {
      id: 'category-pizza',
      name: 'Pizza',
      description: 'Delicious pizza varieties',
      restaurantId: restaurant.id,
    },
  })

  const pastaCategory = await prisma.category.upsert({
    where: { id: 'category-pasta' },
    update: {},
    create: {
      id: 'category-pasta',
      name: 'Pasta',
      description: 'Fresh pasta dishes',
      restaurantId: restaurant.id,
    },
  })

  // Create menu items
  await prisma.menuItem.upsert({
    where: { id: 'menu-item-1' },
    update: {},
    create: {
      id: 'menu-item-1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      restaurantId: restaurant.id,
      categoryId: pizzaCategory.id,
      isAvailable: true,
    },
  })

  await prisma.menuItem.upsert({
    where: { id: 'menu-item-2' },
    update: {},
    create: {
      id: 'menu-item-2',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni pizza with mozzarella cheese',
      price: 14.99,
      restaurantId: restaurant.id,
      categoryId: pizzaCategory.id,
      isAvailable: true,
    },
  })

  await prisma.menuItem.upsert({
    where: { id: 'menu-item-3' },
    update: {},
    create: {
      id: 'menu-item-3',
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
      price: 13.99,
      restaurantId: restaurant.id,
      categoryId: pastaCategory.id,
      isAvailable: true,
    },
  })

  await prisma.menuItem.upsert({
    where: { id: 'menu-item-4' },
    update: {},
    create: {
      id: 'menu-item-4',
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato sauce with garlic, red chili, and herbs',
      price: 11.99,
      restaurantId: restaurant.id,
      categoryId: pastaCategory.id,
      isAvailable: true,
    },
  })

  console.log('✅ Seeding completed!')
  console.log('🔑 Demo accounts created:')
  console.log('   Admin: admin@example.com / password')
  console.log('   Owner: owner@example.com / password')
  console.log('   User: user@example.com / password')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })