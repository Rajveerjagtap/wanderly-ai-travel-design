import { useState } from "react";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RouteCard } from "@/components/RouteCard";
import { BottomNav } from "@/components/BottomNav";
import heroImage from "@/assets/wanderly-hero.jpg";
import routeParis from "@/assets/route-paris.jpg";
import routeBeach from "@/assets/route-beach.jpg";
import routeJapan from "@/assets/route-japan.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");

  const topRoutes = [
    {
      id: 1,
      title: "Paris Romance Weekend",
      image: routeParis,
      creator: "Sophie_M",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Mediterranean Coast Explorer",
      image: routeBeach,
      creator: "TravelBug22",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Kyoto Cherry Blossom Tour",
      image: routeJapan,
      creator: "WanderlustJen",
      rating: 5.0,
    },
  ];

  const handleCreateRoute = () => {
    if (startLocation && destination) {
      navigate("/route");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img 
              src={heroImage} 
              alt="Wanderly mascot" 
              className="w-48 h-48 object-contain animate-bounce-soft"
            />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
            Where to next?
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's plan your perfect adventure together
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card rounded-3xl shadow-medium p-6 mb-8 space-y-4 animate-scale-in">
          <div className="relative">
            <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
            <Input
              placeholder="Starting from..."
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="pl-14"
            />
          </div>

          <div className="relative">
            <Navigation className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent w-5 h-5" />
            <Input
              placeholder="Going to..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-14"
            />
          </div>

          <Button 
            variant="accent" 
            className="w-full group"
            onClick={handleCreateRoute}
            disabled={!startLocation || !destination}
          >
            Create My Route
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Community's Top Routes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Community's Top Routes
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/community")}
            >
              See all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {topRoutes.map((route) => (
              <RouteCard
                key={route.id}
                title={route.title}
                image={route.image}
                creator={route.creator}
                rating={route.rating}
                onClick={() => navigate("/community")}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
