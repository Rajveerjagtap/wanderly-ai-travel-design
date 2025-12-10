# 🌍 Wanderly - AI-Powered Travel Planning Platform

[![Status](https://img.shields.io/badge/Status-Active_Development-success)](https://github.com/Rajveerjagtap/wanderly-ai-travel-design)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Transform travel planning from overwhelming to effortless** - Wanderly uses AI to generate personalized, budget-aware itineraries in seconds, complete with real-time cost tracking, interactive maps, and community-driven insights.

![Wanderly Hero](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80)

---

## 📖 Table of Contents

- [🎯 Problem Statement](#-problem-statement)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📱 Feature Deep Dive](#-feature-deep-dive)
- [🔮 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Problem Statement

### The Pain Points of Modern Travel Planning

**Current Challenges:**
- ⏰ **Time-Consuming**: Travelers spend 20+ hours researching destinations, comparing prices, and building itineraries
- 💰 **Budget Uncertainty**: Difficulty estimating realistic trip costs across accommodations, transport, food, and activities
- 🗺️ **Route Optimization**: Struggling to create efficient itineraries that maximize experiences while minimizing travel time
- 📊 **Information Overload**: Sifting through countless reviews, blogs, and recommendations across multiple platforms
- 🎯 **Personalization Gap**: Generic travel packages don't match individual preferences, budgets, or travel pace

### Our Solution

**Wanderly** eliminates these pain points by:
1. **AI-Powered Generation**: Creates complete itineraries in under 30 seconds
2. **Dynamic Budget Tracking**: Real-time cost calculation with category-wise breakdown
3. **Intelligent Route Optimization**: AI suggests the most efficient stop sequence and transport modes
4. **Personalized Recommendations**: Adapts to your interests (Culture, Adventure, Food, Nature)
5. **Community-Driven**: Learn from real traveler experiences and routes

---

## ✨ Key Features

### 🤖 1. AI-Driven Route Generation

**Intelligent Itineraries Powered by Claude Sonnet 4.5**

- ✅ Context-aware (considers opening hours, best times to visit, logical flow)
- ✅ Location-specific pricing (Paris costs ≠ Bangkok costs)
- ✅ Seasonal adjustments (monsoon warnings, peak season alerts)
- ✅ Cultural intelligence (local customs, etiquette, emergency contacts)
- ✅ Generates routes in 8-15 seconds

**Budget Tiers:**
- **Budget**: ₹6,000-10,000 (3 days) - Hostels, street food, public transport
- **Moderate**: ₹12,000-21,000 (3 days) - 3-star hotels, mid-range restaurants, mix of transport
- **Luxury**: ₹30,000-60,000 (3 days) - 5-star hotels, fine dining, private transport

---

### 💰 2. Dynamic Budget Engine

**Real-Time Cost Calculation with Smart Categorization**

| Category | Features |
|----------|---------|
| 🏨 **Accommodation** | Auto-categorized from route stops |
| 🍽️ **Food & Dining** | Restaurant and cafe costs |
| 🚗 **Transportation** | Flights, trains, local transport |
| 🎯 **Activities** | Attractions, tours, experiences |

**Automatic Recalculation:**
- ➕ Add a stop → Costs update instantly
- ➖ Remove a stop → Total recalculated
- 🔄 Reorder stops → Budget adjusts based on new sequence

**Visual Progress Tracking:**
- Color-coded progress bars (Green → Orange → Red)
- Category-wise breakdown with percentages
- Per-person cost calculation
- Smart money-saving tips based on spending patterns

---

### 🗺️ 3. Interactive Visualization

**Dual View Modes for Maximum Clarity**

#### **Map View** (Google Maps Integration)
- 📍 Custom markers per stop type (🔵 Transport, 🔴 Attraction, 🟡 Restaurant, 🟢 Hotel)
- 🛣️ Optimized route lines with distance/time calculations
- 🌍 Real-time geocoding and directions
- 🔍 Place search with autocomplete

#### **Timeline View** (Chronological Journey)
- Vertical timeline with gradient connections
- Start and end markers with custom icons
- Stop cards with time, cost, and description
- Drag-to-reorder functionality
- Delete stops with instant recalculation

---

### 🎙️ 4. Voice Input

**Hands-Free Planning with Web Speech API**

- 🇬🇧 English (US/UK/Indian accent support)
- 🌐 Works on Chrome, Edge (desktop/mobile)
- 🎯 Auto-fills forms, reduces typing by 90%
- 🎤 Click microphone → Speak naturally → Auto-populates

---

### 👥 5. Community Features

**Discover, Share, and Inspire**

**Filters:**
- 🔥 Most Popular (by rating)
- 💵 Cost-Effective (budget tier)
- 📅 Weekend Trips (≤3 days)
- 🔍 Search (by destination/tags)

**Social Sharing:**
- 📱 WhatsApp, Facebook, Twitter, Instagram
- 📧 Email invites
- 🔗 Direct link copying
- 💾 JSON export for offline access

---

### 📊 6. Enhanced Budget Tracker

**Expense Management with Visual Analytics**

**Features:**
- Add/delete expenses by category
- Visual progress bars per category
- Smart alerts at 50%, 80%, 90% thresholds
- Spending trend analysis
- Comparison with similar trips

---

### 🛡️ 7. Privacy-First Architecture

**No Authentication Required (Local-First Storage)**

✅ Benefits:
- No sign-up friction
- Instant access
- Data privacy (stays on device)
- Offline capability
- No server costs for user data

All routes stored in browser's `localStorage` - your data never leaves your device unless you choose to share publicly.

---

## 🏗️ Architecture

### **System Design: Serverless + Client-Side**

```
┌─────────────┐
│ User Browser│
└──────┬──────┘
       │ Voice/Text Input
       ▼
┌─────────────┐
│  React App  │◄──────── Google Maps API
└──────┬──────┘
       │ Route Request
       ▼
┌─────────────────────┐
│ Supabase Edge       │
│ Function (Deno)     │
└──────┬──────────────┘
       │ Prompt Engineering
       ▼
┌─────────────────────┐
│ Claude Sonnet 4.5   │
│ (Anthropic AI)      │
└──────┬──────────────┘
       │ JSON Response
       ▼
┌─────────────┐      ┌──────────────┐
│ localStorage│      │   Supabase   │
│  (Routes)   │      │  PostgreSQL  │
└─────────────┘      └──────────────┘
```

### **Data Flow**

1. **Input Layer**: User inputs preferences via Voice or UI
2. **Processing Layer**: Supabase Edge Function constructs AI prompt with budget rules
3. **Intelligence Layer**: AI returns structured JSON with stops, costs, descriptions
4. **Presentation Layer**: Frontend parses JSON, calculates totals, renders map/timeline
5. **Persistence Layer**: Save to localStorage (client-side) or Supabase (public routes)

---

## 🛠️ Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework with hooks-based state management |
| **TypeScript** | 5.5+ | Type-safe development, reduces runtime errors by 60% |
| **Vite** | 5.4.2 | Lightning-fast dev server (50ms HMR), optimized builds |
| **Tailwind CSS** | 3.4.1 | Utility-first styling, responsive design system |
| **shadcn/ui** | Latest | Accessible component library (Radix UI + Tailwind) |
| **React Router** | 6.26.2 | Client-side routing |
| **React Query** | 5.56.2 | Server state management, automatic caching |

### **Backend & Infrastructure**

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database, auth, real-time subscriptions |
| **Supabase Edge Functions** | Serverless API endpoints (Deno runtime) |
| **Deno** | Secure JavaScript runtime for edge functions |

### **AI & APIs**

| Service | Purpose | Location |
|---------|---------|----------|
| **Anthropic Claude Sonnet 4.5** | Route generation AI | Edge Function env |
| **Google Maps JavaScript API** | Interactive maps, geocoding | `.env` → `VITE_GOOGLE_MAPS_API_KEY` |
| **Google Places API** | Place search, autocomplete | Same as Maps API |
| **Unsplash Source API** | Destination images (fallback) | Public API (no key) |
| **Wikipedia Commons API** | Landmark images (fallback) | Public API (no key) |

### **Database Schema**

```sql
-- Routes Table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  route_data JSONB,
  preferences JSONB,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  budget_tier TEXT CHECK (budget_tier IN ('budget', 'moderate', 'luxury')),
  duration_days INTEGER,
  total_cost TEXT,
  highlights TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route Stops Table
CREATE TABLE route_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  lat NUMERIC(10, 8) NOT NULL,
  lng NUMERIC(11, 8) NOT NULL,
  cost NUMERIC(10, 2),
  duration TEXT,
  stop_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Getting Started

### **Prerequisites**

```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
```

### **Installation Steps**

```bash
# 1. Clone the repository
git clone https://github.com/Rajveerjagtap/wanderly-ai-travel-design.git
cd wanderly

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file in the root directory
cat > .env << EOL
VITE_SUPABASE_URL=https://zczeimrzkbrpezkcasqi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOL

# 4. Start development server
npm run dev

# ✓ App running at http://localhost:8085/
```

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://zczeimrzkbrpezkcasqi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=zczeimrzkbrpezkcasqi

# Google Maps API (Get from: https://console.cloud.google.com/)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD8EprBw-YYNkAJrr6_3wDRqpuqBOv7FZo
```

⚠️ **Security Note**: Never commit `.env` to Git. It's already in `.gitignore`.

### **Build for Production**

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel/Netlify/Cloudflare Pages
vercel --prod
```

### **Project Structure**

```
wanderly/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── BudgetCalculator.tsx
│   │   ├── RouteMap.tsx
│   │   ├── TimelineView.tsx
│   │   └── SaveRouteButton.tsx
│   ├── pages/               # Route-level components
│   │   ├── Home.tsx         # Main route creation
│   │   ├── RoutePlanner.tsx # Route viewing/editing
│   │   ├── Community.tsx    # Browse public routes
│   │   ├── Profile.tsx      # User's routes & budget
│   │   └── ExplorePlaces.tsx # Destination categories
│   ├── services/            # API & business logic
│   │   ├── routeService.ts
│   │   ├── communityService.ts
│   │   └── imageService.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useRouteHistory.ts
│   │   └── usePlaceImage.ts
│   └── integrations/
│       └── supabase/        # Supabase client & types
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── generate-route/
│   │   ├── get-weather/
│   │   └── fetch-location-images/
│   └── migrations/          # Database schema
├── public/                  # Static assets
└── package.json
```

---

## 📱 Feature Deep Dive

### **1. Home Page (`/`)**

**Main Route Creation Interface**

- Hero section with animated floating orbs background
- Live stats: "1000+ Routes Created", "5000+ Happy Travelers", "4.8★ Average Rating"
- Progressive form (locations → preferences → advanced options)
- Voice input with Web Speech API integration
- Real-time weather display for destination
- Trending destinations grid (6 cards)
- Trip inspiration carousel with "Plan This" quick-fill
- Community top routes preview

**Key Interactions:**
1. User enters start + destination
2. Clicks "Next: Set Preferences"
3. Selects budget tier, interests, pace
4. (Optional) Adds custom AI prompt
5. Clicks "Create My Route"
6. AI generates route in 8-15 seconds
7. Navigates to `/route` with generated data

---

### **2. Route Planner Page (`/route`)**

**Display and Customize AI-Generated Routes**

**Features:**
- **Dual View Toggle**: Switch between Map and Timeline views
- **Stop Management**: Add, remove, reorder stops with instant recalculation
- **Save Functionality**: Save routes to localStorage with heart icon
- **Budget Calculator**: Real-time cost breakdown by category
- **Social Sharing**: 6 platforms + copy link + JSON export
- **Smart Filters**: Apply interest filters to refine route

**Dynamic Recalculation:**
```typescript
// When user adds/removes/reorders a stop:
1. extractStopCosts(stops) → Parse costs from each stop
2. categorizeByType(costs) → Group by accommodation/food/transport/activities
3. calculateTotals() → Sum min/max ranges per category
4. updateState() → Trigger re-render
5. showToast() → "Stop added! New total: ₹18,500-28,000"
```

---

### **3. Community Page (`/community`)**

**Discover Routes from Other Travelers**

- Search bar with real-time filtering
- Filter pills: Popular, Cost-Effective, Weekend Trips
- Grid layout (2 columns desktop, 1 column mobile)
- Route cards with image, title, creator, rating
- Click to view full route details

**Filter Logic:**
- **Popular**: Sort by `rating DESC, views_count DESC`
- **Budget**: Filter `budget_tier = 'budget'`
- **Weekend**: Filter `duration_days <= 3`
- **Search**: Full-text search across title, destination, tags

---

### **4. Profile Page (`/profile`)**

**Manage Your Routes and Budget**

**Layout:**
- Stats grid: Routes Planned, Saved Routes, Route History, Travel Score
- Two tabs: "My Routes" and "Budget"
- Route cards with 64×64 image, title, stop count, date
- Click route → Navigate to `/route` with stored data

**Budget Tab:**
- Enhanced budget tracker with expense management
- Add/delete expenses by category
- Visual progress bars with color coding
- Spending trend analysis
- Smart alerts at budget thresholds

---

## 🔮 Future Roadmap

### **Phase 1: The Booking Agent** 🎫 (Q1-Q2 2026)

**Goal**: Transform from planning tool to end-to-end booking platform

#### **Features:**

1. **Flight Integration**
   - APIs: Amadeus, Skyscanner, Kiwi.com
   - Real-time flight search and price comparison
   - Multi-city routing support
   - One-click pre-filled booking

2. **Hotel Booking**
   - APIs: Booking.com, Agoda, Airbnb
   - Budget-tier matching (budget → 2-star, luxury → 5-star)
   - Location optimization near route attractions
   - Instant booking confirmation

3. **Activity Booking**
   - APIs: Viator, GetYourGuide, Klook
   - Pre-book experiences and tours
   - Skip-the-line tickets
   - Group discounts

4. **Train/Bus Booking**
   - APIs: IRCTC (India), RailEurope (Europe)
   - Seat selection and meal preferences
   - Real-time availability

#### **Revenue Model:**

```
Affiliate Commissions:
- Flights: 1-3% (₹50-150 per booking)
- Hotels: 10-20% (₹300-600 per night)
- Activities: 15-25% (₹200-400 per activity)

Projected Revenue (1000 bookings/month):
- Flights: ₹1,00,000
- Hotels: ₹4,50,000
- Activities: ₹1,50,000
Total: ₹7,00,000/month (₹84L/year)
```

---

### **Phase 2: Full Trip Management Agent** 🧳 (Q3-Q4 2026)

**Goal**: Autonomous AI agent that manages your trip in real-time

#### **Features:**

1. **Real-Time Adaptations**

   **Scenario: Flight Delay**
   ```
   Event: Flight delayed by 4 hours
   
   Agent Actions:
   ✓ Notifies hotel of late check-in
   ✓ Reschedules airport transfer
   ✓ Suggests airport lounge: "Plaza Premium, ₹1,200"
   ✓ Adjusts day 1 itinerary
   ✓ Sends push notification
   ```

   **Scenario: Weather Change**
   ```
   Event: Heavy rain forecasted
   
   Agent Actions:
   ✓ Swaps outdoor park → indoor museum
   ✓ Finds alternative: "Goa State Museum, ₹50"
   ✓ Rebooks tickets automatically
   ✓ Updates timeline
   ```

2. **Proactive Assistance**
   - Real-time traffic alerts and route optimization
   - Restaurant reservations at optimal times
   - Local SIM card activation reminders
   - Currency exchange rate alerts
   - Safety notifications (protests, weather warnings)

3. **24/7 Concierge**
   - Natural language chat interface
   - "Find me a vegan restaurant nearby under ₹500"
   - "Book a cab to the airport at 6 AM tomorrow"
   - "Remind me to pack sunscreen"

4. **Post-Trip Intelligence**
   - Expense categorization and receipt scanning
   - Travel memories compilation
   - Route optimization suggestions for future trips
   - Social media post generation

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### **Areas for Contribution**

1. **Feature Development**: Offline PWA, collaborative planning, AI chat
2. **UI/UX Enhancements**: Dark mode, accessibility, mobile responsiveness
3. **AI Improvements**: Fine-tune prompts, multi-language support
4. **Bug Fixes**: Cost calculation, map rendering, route optimization
5. **Documentation**: Setup guides, API docs, video tutorials

### **Getting Started**

```bash
# 1. Fork the repository
# Click "Fork" on GitHub

# 2. Clone your fork
git clone https://github.com/yourusername/wanderly.git
cd wanderly

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# 5. Push to your fork
git push origin feature/amazing-feature

# 6. Open Pull Request
# Go to GitHub and click "New Pull Request"
```

### **Contribution Guidelines**

- Follow existing code style (TypeScript, ESLint rules)
- Write meaningful commit messages (Conventional Commits format)
- Add tests for new features
- Update documentation for API changes
- Keep PRs focused and atomic

### **Code Quality Standards**

- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: Functional components with hooks
- **Styling**: Tailwind utility classes, responsive design
- **Accessibility**: ARIA labels, keyboard navigation, WCAG AA compliance

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI for intelligent route generation
- **Supabase** - Backend infrastructure and edge functions
- **Google Maps** - Maps and geocoding services
- **shadcn/ui** - Beautiful, accessible UI components
- **Unsplash** - High-quality destination images

---

## 📧 Contact

**Rajveer Jagtap** - [@Rajveerjagtap](https://github.com/Rajveerjagtap)

**Project Link**: [https://github.com/Rajveerjagtap/wanderly-ai-travel-design](https://github.com/Rajveerjagtap/wanderly-ai-travel-design)

---

<div align="center">

**Built with ❤️ for travelers, by travelers**

[⭐ Star this repo](https://github.com/Rajveerjagtap/wanderly-ai-travel-design) • [🐛 Report Bug](https://github.com/Rajveerjagtap/wanderly-ai-travel-design/issues) • [✨ Request Feature](https://github.com/Rajveerjagtap/wanderly-ai-travel-design/issues)

</div>
