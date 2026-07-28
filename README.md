# Kadu Freitas Tattoo

A modern portfolio and booking platform for a tattoo studio built with Next.js 16, TypeScript, Tailwind CSS 4, and Supabase.

## Features

- **Portfolio Gallery**: Showcase of tattoo designs and styles
- **Flash Catalog**: Curated selection of flash designs available for booking
- **Booking System**: Schedule appointments directly through the platform
- **Custom Order Requests**: Customers can request personalized tattoo designs with pricing estimates
- **Admin Dashboard**: Manage flashes, bookings, custom orders, and studio settings
- **WhatsApp Integration**: Seamless communication via WhatsApp

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod validation
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:ci      # Run tests with coverage
```

## Project Structure

- `src/app` - Next.js pages and layouts
- `src/components` - Reusable React components
- `src/lib` - Utilities, database queries, validations
- `src/types` - TypeScript type definitions
- `src/__tests__` - Test files
- `docs/database` - Database migrations

## Admin Dashboard

Access the admin panel at `/admin` to:
- Manage flash designs
- View and respond to custom order requests
- Configure studio settings (WhatsApp contact, cancellation policies)

## Database Schema

Database migrations are located in `docs/database/migrations/`. Key tables include:
- `products` - Flash designs
- `custom_orders` - Personalized tattoo requests
- `bookings` - Scheduled appointments
- `settings` - Studio configuration

## License

© 2026 Kadu Freitas Tattoo
