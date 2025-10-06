import { useState } from "react";
import { MapPin, Utensils, Landmark, Train, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StopCard } from "@/components/StopCard";
import { POIModal } from "@/components/POIModal";
import { BottomNav } from "@/components/BottomNav";
import routeParis from "@/assets/route-paris.jpg";

interface Stop {
  id: number;
  icon: React.ReactNode;
  title: string;
  time: string;
  cost: string;
  image: string;
  rating: number;
  description: string;
}

const RoutePlanner = () => {
  const navigate = useNavigate();
  const [selectedPOI, setSelectedPOI] = useState<Stop | null>(null);

  const stops: Stop[] = [
    {
      id: 1,
      icon: <Train className="w-6 h-6" />,
      title: "Train to Paris Gare du Nord",
      time: "2h 30min",
      cost: "$45",
      image: routeParis,
      rating: 4.5,
      description: "High-speed train from London to Paris. Comfortable seats and beautiful countryside views along the way.",
    },
    {
      id: 2,
      icon: <Landmark className="w-6 h-6" />,
      title: "Eiffel Tower Visit",
      time: "3h",
      cost: "$35",
      image: routeParis,
      rating: 4.9,
      description: "Iconic iron lattice tower on the Champ de Mars. Get stunning views of Paris from the top. Book tickets in advance to skip the lines.",
    },
    {
      id: 3,
      icon: <Utensils className="w-6 h-6" />,
      title: "Le Petit Cler Restaurant",
      time: "1h 30min",
      cost: "$60",
      image: routeParis,
      rating: 4.7,
      description: "Authentic French bistro serving traditional cuisine. Famous for their escargot and coq au vin. Cozy atmosphere perfect for a romantic dinner.",
    },
    {
      id: 4,
      icon: <Landmark className="w-6 h-6" />,
      title: "Louvre Museum",
      time: "4h",
      cost: "$20",
      image: routeParis,
      rating: 4.8,
      description: "World's largest art museum and historic monument. Home to the Mona Lisa and thousands of priceless artworks. Plan to spend at least half a day here.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-heading text-xl font-bold">Your Route</h1>
              <p className="text-sm text-muted-foreground">London → Paris</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-primary/5 rounded-3xl h-64 mb-6 relative overflow-hidden shadow-soft animate-fade-in">
          <img 
            src={routeParis} 
            alt="Route map" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-heading font-semibold">4 stops • 11h total • $160</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Journey Timeline</h2>
          
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {index < stops.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-primary/20 -z-10" />
              )}
              <StopCard
                icon={stop.icon}
                title={stop.title}
                time={stop.time}
                cost={stop.cost}
                onClick={() => setSelectedPOI(stop)}
              />
            </div>
          ))}
        </div>

        {/* Add Stop Button */}
        <Button 
          variant="outline" 
          className="w-full group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add a Stop
        </Button>
      </div>

      {/* POI Modal */}
      {selectedPOI && (
        <POIModal
          title={selectedPOI.title}
          image={selectedPOI.image}
          rating={selectedPOI.rating}
          description={selectedPOI.description}
          onClose={() => setSelectedPOI(null)}
          onAddToRoute={() => {
            setSelectedPOI(null);
            // Handle add to route logic
          }}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default RoutePlanner;
