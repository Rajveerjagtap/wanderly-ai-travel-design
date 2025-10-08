import { useState, useEffect } from "react";
import { MapPin, Utensils, Landmark, Train, Plus, ArrowLeft, Bed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StopCard } from "@/components/StopCard";
import { POIModal } from "@/components/POIModal";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { RouteMap } from "@/components/RouteMap";
import routeParis from "@/assets/route-paris.jpg";

interface Stop {
  id: number;
  type: "transport" | "attraction" | "restaurant" | "accommodation";
  icon: React.ReactNode;
  title: string;
  time: string;
  cost: string;
  image: string;
  rating: number;
  description: string;
  popularity?: number;
  bestTimeToVisit?: string;
}

interface RouteData {
  startLocation: string;
  destination: string;
  stops: Array<{
    type: string;
    title: string;
    time: string;
    cost: string;
    description: string;
    popularity: number;
    bestTimeToVisit: string;
  }>;
  totalDuration: string;
  totalCost: string;
  overallBestTime: string;
}

const RoutePlanner = () => {
  const navigate = useNavigate();
  const [selectedPOI, setSelectedPOI] = useState<Stop | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);

  // Get icon based on stop type
  const getIconForType = (type: string) => {
    switch (type) {
      case "transport":
        return <Train className="w-6 h-6" />;
      case "attraction":
        return <Landmark className="w-6 h-6" />;
      case "restaurant":
        return <Utensils className="w-6 h-6" />;
      case "accommodation":
        return <Bed className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };

  useEffect(() => {
    // Load route data from sessionStorage
    const stored = sessionStorage.getItem('generatedRoute');
    if (stored) {
      const data: RouteData = JSON.parse(stored);
      setRouteData(data);
      
      // Transform AI-generated stops to UI format with real images
      const transformedStops: Stop[] = data.stops.map((stop, index) => ({
        id: index + 1,
        type: stop.type as "transport" | "attraction" | "restaurant" | "accommodation",
        icon: getIconForType(stop.type),
        title: stop.title,
        time: stop.time,
        cost: stop.cost,
        image: `https://source.unsplash.com/800x600/?${encodeURIComponent(stop.title)},${stop.type}`,
        rating: stop.popularity,
        description: stop.description,
        popularity: stop.popularity,
        bestTimeToVisit: stop.bestTimeToVisit,
      }));
      
      setStops(transformedStops);
    } else {
      // Fallback to default route if no AI data
      setRouteData({
        startLocation: "Delhi",
        destination: "Agra",
        stops: [],
        totalDuration: "1 day",
        totalCost: "₹2000-3000",
        overallBestTime: "October to March"
      });
      
      // Set default stops
      setStops([
        {
          id: 1,
          type: "transport",
          icon: <Train className="w-6 h-6" />,
          title: "Gatimaan Express to Agra",
          time: "1h 40min",
          cost: "₹750",
          image: routeParis,
          rating: 4.5,
          description: "India's fastest train connecting Delhi to Agra. Enjoy comfortable AC seating and onboard meals.",
          popularity: 4.5,
          bestTimeToVisit: "Year-round"
        },
        {
          id: 2,
          type: "attraction",
          icon: <Landmark className="w-6 h-6" />,
          title: "Taj Mahal Visit",
          time: "3h",
          cost: "₹1100",
          image: routeParis,
          rating: 5,
          description: "UNESCO World Heritage Site and one of the Seven Wonders of the World. Witness the magnificent white marble monument.",
          popularity: 5,
          bestTimeToVisit: "October-March"
        },
      ]);
    }
  }, []);

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
              <p className="text-sm text-muted-foreground">
                {routeData?.startLocation || "London"} → {routeData?.destination || "Paris"}
              </p>
            </div>
            {routeData?.overallBestTime && (
              <Badge variant="secondary" className="ml-2">
                Best: {routeData.overallBestTime}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-primary/5 rounded-3xl h-96 mb-6 relative overflow-hidden shadow-soft animate-fade-in">
          <RouteMap
            startLocation={routeData?.startLocation || "Delhi"}
            destination={routeData?.destination || "Agra"}
            stops={stops}
          />
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-medium">
              <div className="flex items-center gap-2 text-foreground mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-heading font-semibold">
                  {stops.length} stops • {routeData?.totalDuration || "N/A"} • {routeData?.totalCost || "N/A"}
                </span>
              </div>
              {routeData?.overallBestTime && (
                <p className="text-sm text-muted-foreground">
                  Best time to visit: {routeData.overallBestTime}
                </p>
              )}
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
              {stop.popularity && stop.bestTimeToVisit && (
                <div className="ml-14 mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    ⭐ Popularity: {stop.popularity}/5
                  </span>
                  <span className="flex items-center gap-1">
                    📅 Best: {stop.bestTimeToVisit}
                  </span>
                </div>
              )}
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
