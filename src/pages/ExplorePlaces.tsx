import { useState } from "react";
import { ChevronLeft, MapPin, Star, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: string;
  image: string;
  description: string;
  location: string;
}

const categories = [
  { id: "recommended", label: "Recommended", emoji: "⭐" },
  { id: "popular", label: "Popular", emoji: "🔥" },
  { id: "luxury", label: "Luxury", emoji: "💎" },
  { id: "budget", label: "Cheap & Cool", emoji: "💰" },
  { id: "beaches", label: "Beaches", emoji: "🏖️" },
  { id: "hotels", label: "Hotels", emoji: "🏨" },
  { id: "restaurants", label: "Restaurants", emoji: "🍽️" },
  { id: "bars", label: "Bars & Nightlife", emoji: "🍺" },
];

const samplePlaces: Place[] = [
  {
    id: 1,
    name: "Taj Mahal",
    category: "recommended",
    rating: 4.9,
    price: "$$$",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
    description: "Iconic white marble mausoleum, UNESCO World Heritage site",
    location: "Agra, Uttar Pradesh"
  },
  {
    id: 2,
    name: "Goa Beaches",
    category: "beaches",
    rating: 4.7,
    price: "$$",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    description: "Pristine beaches with vibrant nightlife and water sports",
    location: "Goa"
  },
  {
    id: 3,
    name: "Oberoi Udaivilas",
    category: "luxury",
    rating: 5.0,
    price: "$$$$",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    description: "Luxury palace hotel overlooking Lake Pichola",
    location: "Udaipur, Rajasthan"
  },
  {
    id: 4,
    name: "Zostel Jaipur",
    category: "budget",
    rating: 4.5,
    price: "$",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
    description: "Vibrant hostel with rooftop cafe and social atmosphere",
    location: "Jaipur, Rajasthan"
  },
];

const ExplorePlaces = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("recommended");

  const filteredPlaces = samplePlaces.filter(
    place => place.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-4 p-4 max-w-screen-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading text-xl font-bold">Explore Places</h1>
            <p className="text-sm text-muted-foreground">Discover amazing destinations</p>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="sticky top-[73px] z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <ScrollArea className="w-full">
          <div className="flex gap-2 p-4 max-w-screen-lg mx-auto">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-smooth hover-lift"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Places Grid */}
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden hover-lift cursor-pointer transition-smooth"
              onClick={() => {
                // TODO: Handle adding to route
                console.log("Add to route:", place);
              }}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold text-lg flex-1">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm text-accent">{place.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {place.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{place.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />
                    <span>{place.price}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ExplorePlaces;
