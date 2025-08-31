#!/bin/bash

# UberEats-Like Ordering System - Test Script
# This script validates the basic setup and functionality

echo "🧪 Testing UberEats-Like Ordering System Setup"
echo "=============================================="

# Check if required files exist
echo "📁 Checking file structure..."

required_files=(
    "package.json"
    "next.config.js"
    "tailwind.config.js"
    "tsconfig.json"
    "prisma/schema.prisma"
    "prisma/seed.ts"
    ".env.example"
    "README.md"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/app/login/page.tsx"
    "src/app/restaurants/page.tsx"
    "src/app/restaurants/[id]/page.tsx"
    "src/app/merchant/page.tsx"
    "src/app/admin/page.tsx"
    "src/app/admin/new-restaurant/page.tsx"
    "src/app/profile/page.tsx"
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/app/api/restaurants/route.ts"
    "src/app/api/restaurants/[id]/route.ts"
    "src/app/api/restaurants/owned/route.ts"
    "src/app/api/orders/route.ts"
    "src/app/api/admin/orders/route.ts"
    "src/app/api/users/owners/route.ts"
    "src/app/api/line/authorize/route.ts"
    "src/app/api/line/callback/route.ts"
    "src/components/Navbar.tsx"
    "src/components/RestaurantCard.tsx"
    "src/components/Providers.tsx"
    "src/lib/auth.ts"
    "src/lib/db.ts"
    "src/types/next-auth.d.ts"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

# Check package.json scripts
echo ""
echo "📦 Checking package.json scripts..."
if grep -q '"dev".*"next dev"' package.json && \
   grep -q '"build".*"next build"' package.json && \
   grep -q '"prisma:generate".*"prisma generate"' package.json && \
   grep -q '"prisma:push".*"prisma db push"' package.json && \
   grep -q '"prisma:seed".*"tsx prisma/seed.ts"' package.json; then
    echo "✅ All required scripts present"
else
    echo "❌ Missing required scripts in package.json"
    exit 1
fi

# Check dependencies
echo ""
echo "📚 Checking key dependencies..."
required_deps=(
    "next"
    "react"
    "react-dom"
    "typescript"
    "tailwindcss"
    "prisma"
    "@prisma/client"
    "next-auth"
    "@next-auth/prisma-adapter"
    "bcryptjs"
    "swr"
    "axios"
)

missing_deps=()
for dep in "${required_deps[@]}"; do
    if ! grep -q "\"$dep\"" package.json; then
        missing_deps+=("$dep")
    fi
done

if [ ${#missing_deps[@]} -eq 0 ]; then
    echo "✅ All required dependencies present"
else
    echo "❌ Missing dependencies:"
    printf '%s\n' "${missing_deps[@]}"
    exit 1
fi

# Check TypeScript configuration
echo ""
echo "🔧 Checking TypeScript configuration..."
if grep -q '"baseUrl": "."' tsconfig.json && \
   grep -q '@/\*' tsconfig.json; then
    echo "✅ TypeScript path mapping configured"
else
    echo "❌ TypeScript configuration issues"
    exit 1
fi

# Check Prisma schema
echo ""
echo "🗄️  Checking Prisma schema..."
if grep -q "model User" prisma/schema.prisma && \
   grep -q "model Restaurant" prisma/schema.prisma && \
   grep -q "model MenuItem" prisma/schema.prisma && \
   grep -q "model Order" prisma/schema.prisma && \
   grep -q "enum Role" prisma/schema.prisma && \
   grep -q "enum OrderStatus" prisma/schema.prisma; then
    echo "✅ Prisma schema contains required models"
else
    echo "❌ Prisma schema missing required models"
    exit 1
fi

# Check environment example
echo ""
echo "🔐 Checking environment configuration..."
if grep -q "DATABASE_URL" .env.example && \
   grep -q "NEXTAUTH_SECRET" .env.example && \
   grep -q "LINE_CLIENT_ID" .env.example; then
    echo "✅ Environment example configured"
else
    echo "❌ Environment example missing required variables"
    exit 1
fi

# Check if environment file exists
if [ -f ".env" ]; then
    echo "✅ Environment file exists"
else
    echo "⚠️  No .env file found - you'll need to create one for local development"
fi

# Try to install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "✅ All tests passed!"
echo ""
echo "🚀 Setup instructions:"
echo "1. Copy .env.example to .env and configure your database"
echo "2. Run 'npm run prisma:generate' to generate Prisma client"
echo "3. Run 'npm run prisma:push' to setup database schema"
echo "4. Run 'npm run prisma:seed' to seed demo data"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "Demo accounts after seeding:"
echo "- Admin: admin@example.com / password"
echo "- Owner: owner@example.com / password"  
echo "- User: user@example.com / password"