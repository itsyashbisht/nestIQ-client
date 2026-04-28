# NestIQ — Frontend

AI-powered hotel booking platform. Built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, Redux Toolkit, Framer Motion.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| HTTP | Axios with interceptors |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI Streaming | Vercel AI SDK (`useChat`) |
| Payments | Razorpay JS SDK |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your backend URL

# 3. Start dev server
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, AI search, featured hotels |
| `/search` | AI-powered hotel search with filters |
| `/hotels/[slug]` | Hotel detail — rooms, amenities, AI chat |
| `/hotels/[slug]/book` | 3-step booking flow + Razorpay payment |
| `/bookings` | My bookings — view, cancel, review |
| `/concierge` | Full-screen AI chat (streaming) |
| `/profile` | Account settings, security, preferences |
| `/login` | Authentication |
| `/register` | Account creation |
| `/owner/dashboard` | Owner stats, hotel management |

## Design System

Based on `design.md` — Resend-inspired dark design:

- **Background**: Pure black `#000000`
- **Text**: Near white `#f0f0f0`
- **Borders**: Frost `rgba(214, 235, 253, 0.19)`
- **Accent**: Orange `#ff801f`, Blue `#3b9eff`, Green `#11ff99`
- **Fonts**: Cormorant Garamond (display), DM Sans (body), JetBrains Mono (code)
- **Animations**: Framer Motion — page reveals, stagger, hover lifts

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend

The frontend connects to an Express.js backend. Start it separately at port 8000.
All API routes use `/api/v1/` prefix.

Mock data is included in each page for UI preview without a backend connection.
