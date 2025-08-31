# UberEats-Like Ordering System

A complete food ordering and restaurant management system built with Next.js 14, TypeScript, Prisma, and LINE Notify integration.

## Features

### Customer Features
- 🏪 Browse restaurants and view details
- 🍕 View menu items and add to cart
- 🛒 Place orders with checkout
- 📱 LINE Notify integration for order updates

### Restaurant Owner Features
- 📊 Dashboard with restaurant overview
- 🍽️ Menu management (add/edit menu items)
- 📋 Order management with status updates
- 📞 LINE Notify integration for new orders

### Admin Features
- 🏢 View all restaurants and recent orders
- ➕ Create restaurants and assign owners
- 👥 User management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Credentials provider
- **Data Fetching**: SWR
- **Notifications**: LINE Notify API
- **Styling**: TailwindCSS with custom components

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- LINE Notify application (optional, for notifications)

### 1. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ubereats_ordering?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# LINE Notify OAuth (optional)
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"
LINE_REDIRECT_URI="http://localhost:3000/api/line/callback"
```

### 2. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run prisma:generate
npm run prisma:push
```

Seed the database with demo data:

```bash
npm run prisma:seed
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Demo Accounts

After running the seed script, you can use these demo accounts:

- **Admin**: `admin@example.com` / `password`
- **Restaurant Owner**: `owner@example.com` / `password`
- **Customer**: `user@example.com` / `password`

## Application Structure

### Pages

- `/` - Home page with featured restaurants
- `/login` - User authentication
- `/restaurants` - Restaurant listing
- `/restaurants/[id]` - Restaurant details with menu and cart
- `/merchant` - Restaurant owner dashboard
- `/merchant/[id]/menu` - Menu management
- `/merchant/[id]/orders` - Order management
- `/merchant/[id]/notifications` - LINE Notify setup
- `/admin` - Admin dashboard
- `/admin/new-restaurant` - Create new restaurant
- `/profile` - User profile and LINE Notify setup

### API Routes

- `GET/POST /api/restaurants` - Restaurant CRUD
- `GET /api/restaurants/[id]` - Single restaurant
- `GET/POST /api/restaurants/[id]/menu` - Menu management
- `GET /api/restaurants/[id]/orders` - Restaurant orders
- `POST /api/orders` - Create order
- `GET /api/orders` - User orders
- `PATCH /api/orders/[id]` - Update order status
- `GET /api/line/authorize` - LINE OAuth
- `POST /api/line/callback` - LINE OAuth callback
- `GET /api/users/owners` - List restaurant owners (admin)

### User Roles

1. **USER** - Can browse restaurants, place orders, receive notifications
2. **RESTAURANT_OWNER** - Can manage owned restaurants, menus, and orders
3. **ADMIN** - Can create restaurants, assign owners, view all data

## Database Schema

### Core Models

- **User** - Authentication and user data with roles
- **Restaurant** - Restaurant information and ownership
- **Category** - Menu categories
- **MenuItem** - Individual menu items
- **Order** - Customer orders with status tracking
- **OrderItem** - Items within an order
- **NotificationChannel** - LINE Notify token storage

### Order Lifecycle

1. `PENDING` - Order placed by customer
2. `ACCEPTED` - Restaurant accepts the order
3. `PREPARING` - Food is being prepared
4. `READY_FOR_PICKUP` - Ready for pickup/delivery
5. `OUT_FOR_DELIVERY` - Out for delivery
6. `DELIVERED` - Order completed
7. `CANCELED` - Order canceled

## LINE Notify Integration

### Setup LINE Notify Application

1. Go to [LINE Notify](https://notify-bot.line.me/)
2. Create a new service
3. Get your Client ID and Client Secret
4. Set redirect URI to `http://localhost:3000/api/line/callback`

### Features

- Restaurant owners receive notifications for new orders
- Customers receive notifications for order status updates
- Automatic token management and renewal

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:seed` - Seed database with demo data

### Code Organization

```
src/
├── app/                 # Next.js 14 App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
└── types/               # TypeScript type definitions

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding script
```

## Deployment

1. Set up a PostgreSQL database (e.g., Supabase, Neon, Railway)
2. Update `DATABASE_URL` in production environment
3. Set `NEXTAUTH_SECRET` to a secure random string
4. Deploy to Vercel, Netlify, or your preferred platform

## Features Overview

### Customer Flow
1. Browse restaurants on home page
2. View restaurant details and menu
3. Add items to cart
4. Checkout and place order
5. Receive LINE notifications for order updates

### Restaurant Owner Flow
1. Access merchant dashboard
2. Manage menu items and categories
3. View and update order status
4. Set up LINE Notify for order notifications

### Admin Flow
1. View system overview
2. Create new restaurants
3. Assign restaurant owners
4. Monitor all orders and restaurants

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details