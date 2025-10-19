import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

interface Destination {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  popularity: string;
  image: string;
  highlights: string[];
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Goa",
    location: "Western India",
    category: "Beach Paradise",
    rating: 4.8,
    popularity: "🔥 Trending",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    highlights: ["Beaches", "Nightlife", "Water Sports"]
  },
  {
    id: 2,
    name: "Jaipur",
    location: "Rajasthan",
    category: "Royal Heritage",
    rating: 4.9,
    popularity: "⭐ Popular",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    highlights: ["Palaces", "Culture", "History"]
  },
  {
    id: 3,
    name: "Manali",
    location: "Himachal Pradesh",
    category: "Mountain Escape",
    rating: 4.7,
    popularity: "❄️ Winter Favorite",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop",
    highlights: ["Mountains", "Adventure", "Snow"]
  },
  {
    id: 4,
    name: "Kerala",
    location: "Southern India",
    category: "Backwaters & Nature",
    rating: 5.0,
    popularity: "🌴 Must Visit",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
    highlights: ["Backwaters", "Ayurveda", "Nature"]
  },
  {
    id: 5,
    name: "Varanasi",
    location: "Uttar Pradesh",
    category: "Spiritual Journey",
    rating: 4.6,
    popularity: "🕉️ Sacred",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop",
    highlights: ["Temples", "Ganges", "Spirituality"]
  },
  {
    id: 6,
    name: "Ladakh",
    location: "Northern India",
    category: "Himalayan Adventure",
    rating: 4.9,
    popularity: "🏔️ Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    highlights: ["Mountains", "Monasteries", "Trekking"]
  }
];

export const TrendingDestinations = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Trending Destinations</h2>
          <p className="text-sm text-muted-foreground">Most popular places to explore in India</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest, index) => (
          <Card
            key={dest.id}
            className="overflow-hidden hover-lift cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                {dest.popularity}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-heading text-2xl font-bold text-white mb-1">
                  {dest.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{dest.location}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-accent">{dest.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-semibold">{dest.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {dest.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
