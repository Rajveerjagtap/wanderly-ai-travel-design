
# 🌍 Wanderly - AI-Powered Travel Planning Platform

![Project Status](https://img.shields.io/badge/Status-Active_Development-success)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Supabase_|_AI-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Wanderly** is an intelligent travel companion that transforms the complex process of trip planning into a seamless, data-driven experience. By leveraging Generative AI, real-time mapping, and dynamic budget algorithms, Wanderly creates personalized itineraries that are optimized for your preferences, budget, and travel pace.

---

## 🚀 Key Features

### 🤖 **AI-Driven Route Generation**
- **Intelligent Itineraries**: Uses **Claude Sonnet 4.5** (via Supabase Edge Functions) to generate detailed day-by-day plans.
- **Context Aware**: Considers opening hours, best times to visit, and logical geographical flow.
- **Personalized**: Adapts to preferences like "Adventure," "Foodie," "Relaxed," or "Cultural."

### 💰 **Dynamic Budget Engine**
- **Real-Time Calculation**: Costs are not static. Adding or removing a stop automatically recalculates the total trip cost.
- **Smart Categorization**: Automatically distinguishes between Accommodation 🏨, Food 🍽️, Transport 🚗, and Activities 🎯.
- **Tiered Pricing**: Supports Budget, Moderate, and Luxury tiers with location-specific cost adjustments (e.g., Paris vs. Bangkok).

### 🗺️ **Interactive Visualization**
- **Dual Views**: Switch seamlessly between an interactive **Google Map** view and a chronological **Timeline** view.
- **Place Discovery**: Integrated Google Places Autocomplete for adding custom stops.
- **Voice Input**: Microphone integration allows users to speak their destination and preferences.

### 👥 **Community & Inspiration**
- **Trip Gallery**: Browse routes created by other travelers.
- **Social Sharing**: Share itineraries via WhatsApp, Twitter, or direct link.
- **Curated Collections**: "Trending Destinations" and "Trip Inspiration" sections based on popular travel data.

### 🔒 **Privacy-First Architecture**
- **No Login Required**: The app currently operates on a local-first principle.
- **Local Persistence**: Routes and preferences are saved securely in your browser's `localStorage`.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Query (TanStack Query) & React Context
- **Routing**: React Router v6

### **Backend & Infrastructure**
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Serverless**: Supabase Edge Functions (Deno runtime)
- **Storage**: Supabase Storage (for location images)

### **AI & APIs**
- **LLM**: Anthropic Claude Sonnet 4.5 (via Edge Functions)
- **Maps**: Google Maps JavaScript API & Places API
- **Weather**: OpenWeatherMap / AI-inferred weather data

---

## 🏗️ Architecture Overview

Wanderly follows a modern **Serverless & Client-Side** architecture:

```mermaid
graph TD
    User[User Interface] -->|Voice/Text Input| Frontend[React App]
    Frontend -->|Route Request| Edge[Supabase Edge Function]
    Edge -->|Prompt Engineering| AI[Claude Sonnet 4.5]
    AI -->|JSON Itinerary| Edge
    Edge -->|Validated Data| Frontend
    Frontend -->|Render| Map[Google Maps API]
    Frontend -->|Persist| Local[LocalStorage]
    Frontend -->|Read/Write| DB[Supabase Database (Community Routes)]



Input Layer: User inputs preferences via Voice or UI.
Processing Layer: A Supabase Edge Function (generate-route) acts as a secure proxy. It constructs a complex system prompt containing budget rules and geographical constraints before sending it to the AI model.
Intelligence Layer: The AI returns a structured JSON object containing stops, coordinates, costs, and descriptions.
Presentation Layer: The frontend parses this JSON, calculates dynamic totals, and renders markers on the map.
🔮 Future Roadmap: The Autonomous Travel Agent
We are evolving Wanderly from a planning tool into a fully Autonomous Travel Agent.

Phase 1: The Booking Agent 🎫
Currently in research

Goal: Convert the AI-generated itinerary into actual bookings.
Implementation: Integration with flight and hotel aggregators (Amadeus, Skyscanner, Booking.com APIs).
Feature: "One-Click Book". Once a route is finalized, the agent will pre-fill booking carts for flights, trains, and hotels matching the generated budget and dates.
Phase 2: Full Trip Management Agent 🧳
Long-term vision

Goal: An active agent that manages the trip while it happens.
Real-time Adaptation:
Scenario: "Your flight is delayed by 4 hours."
Agent Action: Automatically reschedules the airport transfer, notifies the hotel of late check-in, and suggests a lounge or nearby activity to kill time.
Contextual Assistance: "It's raining in Tokyo today. I've swapped your outdoor park visit with the Mori Art Museum."
