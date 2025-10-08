import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ArrowRight, LogOut, Cloud, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RouteCard } from "@/components/RouteCard";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/wanderly-hero.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [destinationWeather, setDestinationWeather] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const topRoutes = [
    {
      id: 1,
      title: "Paris Romance Weekend",
      destination: "Paris",
      creator: "Sophie_M",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Mediterranean Coast Explorer",
      destination: "Santorini",
      creator: "TravelBug22",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Kyoto Cherry Blossom Tour",
      destination: "Kyoto",
      creator: "WanderlustJen",
      rating: 5.0,
    },
  ];

  // Fetch weather when destination changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!destination || destination.length < 3) {
        setDestinationWeather(null);
        return;
      }

      setIsLoadingWeather(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-weather', {
          body: { location: destination }
        });

        if (error) throw error;
        setDestinationWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setDestinationWeather(null);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const debounceTimer = setTimeout(fetchWeather, 800);
    return () => clearTimeout(debounceTimer);
  }, [destination]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleCreateRoute = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    if (!startLocation || !destination) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-route', {
        body: { startLocation, destination }
      });

      if (error) {
        console.error("Error generating route:", error);
        toast({
          title: "Error",
          description: "Failed to generate route. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      console.log("Generated route data:", data);
      
      // Store route data in sessionStorage for the route planner page
      sessionStorage.setItem('generatedRoute', JSON.stringify({
        startLocation,
        destination,
        ...data
      }));
      
      toast({
        title: "Route Generated!",
        description: `Your route from ${startLocation} to ${destination} is ready.`,
      });
      
      navigate("/route");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
        <div className="max-w-screen-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Wanderly</h1>
            <p className="text-sm text-muted-foreground">Plan your perfect journey</p>
          </div>
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}
        </div>
      </div>

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
              placeholder="e.g., Mumbai"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="pl-14"
            />
          </div>

          <div className="relative">
            <Navigation className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent w-5 h-5" />
            <Input
              placeholder="e.g., Goa"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-14"
            />
          </div>

          <Button 
            variant="accent" 
            className="w-full group"
            onClick={handleCreateRoute}
            disabled={!startLocation || !destination || isGenerating}
          >
            {isGenerating ? "Generating Route..." : "Create My Route"}
            {!isGenerating && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>

          {/* Weather Info Card */}
          {destinationWeather && (
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current weather in</p>
                  <h3 className="font-heading font-semibold text-foreground">
                    {destinationWeather.location}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl mb-1">{destinationWeather.weatherIcon}</div>
                  <p className="text-2xl font-bold text-foreground">
                    {destinationWeather.temperature}°C
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Cloud className="w-4 h-4" />
                  <span>{destinationWeather.weatherDescription}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  <span>{destinationWeather.windSpeed} km/h</span>
                </div>
              </div>
            </Card>
          )}
          
          {isLoadingWeather && destination && (
            <div className="text-center text-sm text-muted-foreground">
              Loading weather data...
            </div>
          )}
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
                image={`https://source.unsplash.com/800x600/?${route.destination},travel,landmark`}
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
