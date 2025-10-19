import { useState, useEffect } from "react";
import { MapPin, Utensils, Landmark, Train, Plus, ArrowLeft, Bed, Filter, Map, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StopCard } from "@/components/StopCard";
import { POIModal } from "@/components/POIModal";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { RouteMap } from "@/components/RouteMap";
import { AddStopModal } from "@/components/AddStopModal";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { TimelineView } from "@/components/TimelineView";
import { toast } from "sonner";
import routeParis from "@/assets/route-paris.jpg";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const filterOptions = [
  { id: "beaches", label: "Beaches", emoji: "🏖️" },
  { id: "temples", label: "Temples", emoji: "🛕" },
  { id: "churches", label: "Churches", emoji: "⛪" },
  { id: "mosques", label: "Mosques", emoji: "🕌" },
  { id: "hotels", label: "Hotels", emoji: "🏨" },
];

const RoutePlanner = () => {
  const navigate = useNavigate();
  const [selectedPOI, setSelectedPOI] = useState<Stop | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "timeline">("map");

  const handleAddNewStop = async (place: { name: string; address: string }) => {
    try {
      // Fetch real image for the place
      const { data: imageData } = await supabase.functions.invoke('fetch-location-images', {
        body: { location: place.name }
      });

      const newStop: Stop = {
        id: stops.length + 1,
        type: "attraction",
        icon: <MapPin className="w-6 h-6" />,
        title: place.name,
        time: "2-3h",
        cost: "TBD",
        image: imageData?.imageUrl || `https://images.unsplash.com/photo-${1600000000000 + stops.length}?w=800&h=600&fit=crop`,
        rating: 4.5,
        description: `Visit ${place.name} located at ${place.address}. A wonderful place to explore and add to your journey.`,
        popularity: 4.5,
        bestTimeToVisit: "Year-round",
      };
      setStops([...stops, newStop]);
      toast.success(`${place.name} added to your route!`);
    } catch (error) {
      console.error('Error adding stop:', error);
      toast.error('Failed to add stop. Please try again.');
    }
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const fetchFilteredStops = async () => {
    if (selectedFilters.length === 0 || !routeData) return;

    try {
      const newStops: Stop[] = [];
      
      for (const filter of selectedFilters) {
        const searchQuery = `${routeData.destination} ${filter}`;
        
        const { data: imageData } = await supabase.functions.invoke('fetch-location-images', {
          body: { location: searchQuery }
        });

        newStops.push({
          id: stops.length + newStops.length + 1,
          type: filter === 'hotels' ? 'accommodation' : 'attraction',
          icon: getIconForFilter(filter),
          title: `Popular ${filter} in ${routeData.destination}`,
          time: "2-3h",
          cost: "Varies",
          image: imageData?.imageUrl || `https://images.unsplash.com/photo-${Date.now() + newStops.length}?w=800&h=600&fit=crop`,
          rating: 4.5,
          description: `Explore the best ${filter} that ${routeData.destination} has to offer.`,
          popularity: 4.5,
          bestTimeToVisit: "Year-round",
        });
      }

      setStops([...stops, ...newStops]);
      toast.success(`Added ${newStops.length} filtered stops to your route!`);
      setSelectedFilters([]);
    } catch (error) {
      console.error('Error fetching filtered stops:', error);
      toast.error('Failed to add filtered stops.');
    }
  };

  const getIconForFilter = (filter: string) => {
    switch (filter) {
      case "hotels":
        return <Bed className="w-6 h-6" />;
      case "temples":
      case "churches":
      case "mosques":
        return <Landmark className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };

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
    const loadRouteData = async () => {
      // Load route data from sessionStorage
      const stored = sessionStorage.getItem('generatedRoute');
      if (stored) {
        const data: RouteData = JSON.parse(stored);
        setRouteData(data);
        
        // Transform AI-generated stops to UI format with real images
        const transformedStops: Stop[] = await Promise.all(
          data.stops.map(async (stop, index) => {
            try {
              const { data: imageData } = await supabase.functions.invoke('fetch-location-images', {
                body: { location: stop.title }
              });

              return {
                id: index + 1,
                type: stop.type as "transport" | "attraction" | "restaurant" | "accommodation",
                icon: getIconForType(stop.type),
                title: stop.title,
                time: stop.time,
                cost: stop.cost,
                image: imageData?.imageUrl || `https://images.unsplash.com/photo-${1600000000000 + index}?w=800&h=600&fit=crop`,
                rating: stop.popularity,
                description: stop.description,
                popularity: stop.popularity,
                bestTimeToVisit: stop.bestTimeToVisit,
              };
            } catch (error) {
              console.error('Error fetching image for stop:', error);
              return {
                id: index + 1,
                type: stop.type as "transport" | "attraction" | "restaurant" | "accommodation",
                icon: getIconForType(stop.type),
                title: stop.title,
                time: stop.time,
                cost: stop.cost,
                image: `https://images.unsplash.com/photo-${1600000000000 + index}?w=800&h=600&fit=crop`,
                rating: stop.popularity,
                description: stop.description,
                popularity: stop.popularity,
                bestTimeToVisit: stop.bestTimeToVisit,
              };
            }
          })
        );
        
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
  };

  loadRouteData();
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

      {/* Filter Section */}
      <div className="sticky top-[73px] z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-md mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Add Filters
            </Button>
            {selectedFilters.length > 0 && (
              <Button size="sm" onClick={fetchFilteredStops}>
                Apply ({selectedFilters.length})
              </Button>
            )}
          </div>
          {showFilters && (
            <ScrollArea className="w-full mt-3">
              <div className="flex gap-2 pb-2">
                {filterOptions.map((filter) => (
                  <Badge
                    key={filter.id}
                    variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-smooth hover-lift"
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <span className="mr-2">{filter.emoji}</span>
                    {filter.label}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="flex-1"
          >
            <Map className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
            className="flex-1"
          >
            <List className="w-4 h-4 mr-2" />
            Timeline View
          </Button>
        </div>

        {/* Map or Timeline Section */}
        {viewMode === "map" ? (
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
        ) : (
          <div className="bg-card rounded-3xl mb-6 shadow-soft overflow-hidden">
            <TimelineView
              startLocation={routeData?.startLocation || "Delhi"}
              destination={routeData?.destination || "Agra"}
              stops={stops}
            />
          </div>
        )}

        {/* Budget Calculator */}
        <div className="mb-6">
          <BudgetCalculator />
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Journey Timeline</h2>
          
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative animate-fade-in space-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
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
              {stop.description && (
                <p className="text-sm text-muted-foreground ml-14 leading-relaxed">
                  {stop.description}
                </p>
              )}
              {stop.popularity && stop.bestTimeToVisit && (
                <div className="ml-14 flex gap-3 text-xs text-muted-foreground">
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
          onClick={() => setShowAddStopModal(true)}
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
            toast.success("Added to your route!");
          }}
        />
      )}

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <AddStopModal
          onClose={() => setShowAddStopModal(false)}
          onAddStop={handleAddNewStop}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default RoutePlanner;
