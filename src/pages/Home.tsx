import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ArrowRight, LogOut, Cloud, Wind, Sparkles, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouteCard } from "@/components/RouteCard";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingDestinations } from "@/components/TrendingDestinations";
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
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: "",
    interests: [] as string[],
    pace: "",
  });
  const [routeImages, setRouteImages] = useState<Record<number, string>>({});

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

  // Fetch images for top routes
  useEffect(() => {
    const fetchImages = async () => {
      const imageMap: Record<number, string> = {};
      
      for (const route of topRoutes) {
        try {
          const { data } = await supabase.functions.invoke('fetch-location-images', {
            body: { location: route.destination }
          });
          
          if (data?.imageUrl) {
            imageMap[route.id] = data.imageUrl;
          }
        } catch (error) {
          console.error(`Error fetching image for ${route.destination}:`, error);
        }
      }
      
      setRouteImages(imageMap);
    };
    
    fetchImages();
  }, []);

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

    if (!startLocation || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both start location and destination.",
        variant: "destructive",
      });
      return;
    }

    if (!showPreferences) {
      setShowPreferences(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-route', {
        body: { 
          startLocation, 
          destination,
          preferences 
        }
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
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Animated background with floating orbs */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-primary/20 -top-48 -left-48 animate-float" />
        <div className="floating-orb w-80 h-80 bg-accent/20 top-1/3 -right-40 animate-float" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-72 h-72 bg-primary/15 bottom-0 left-1/4 animate-float" style={{ animationDelay: '4s' }} />
      </div>

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

      <div className="max-w-screen-md mx-auto px-4 py-6 relative z-10">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Badge with animation */}
          <div className="flex justify-center mb-4">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 shadow-glow">
              <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
              <span className="text-sm font-medium bg-gradient-accent bg-clip-text text-transparent">
                AI-Powered Travel Planning
              </span>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <img 
              src={heroImage} 
              alt="Wanderly mascot" 
              className="w-48 h-48 object-contain animate-bounce-soft"
            />
          </div>

          <h1 className="font-heading text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Where to next?
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Let AI craft your perfect journey with personalized routes
          </p>

          {/* Live Statistics */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-2xl font-bold text-primary mb-1">1000+</div>
              <div className="text-xs text-muted-foreground">Routes Created</div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-2xl font-bold text-accent mb-1">5000+</div>
              <div className="text-xs text-muted-foreground">Happy Travelers</div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="text-2xl font-bold text-primary mb-1">4.8★</div>
              <div className="text-xs text-muted-foreground">Average Rating</div>
            </div>
          </div>
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

          {!showPreferences && (
            <Button 
              variant="accent" 
              className="w-full group"
              onClick={handleCreateRoute}
              disabled={!startLocation || !destination || isGenerating}
            >
              Next: Set Preferences
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {showPreferences && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-heading font-semibold text-foreground">Personalize Your Trip</h3>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Budget Range</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Budget", "Moderate", "Luxury"].map((budget) => (
                    <Button
                      key={budget}
                      variant={preferences.budget === budget ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreferences({ ...preferences, budget })}
                    >
                      {budget}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {["Culture", "Adventure", "Food", "Nature", "Shopping", "Nightlife"].map((interest) => (
                    <Badge
                      key={interest}
                      variant={preferences.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setPreferences({
                          ...preferences,
                          interests: preferences.interests.includes(interest)
                            ? preferences.interests.filter(i => i !== interest)
                            : [...preferences.interests, interest]
                        });
                      }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Travel Pace</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Relaxed", "Moderate", "Fast-paced"].map((pace) => (
                    <Button
                      key={pace}
                      variant={preferences.pace === pace ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreferences({ ...preferences, pace })}
                    >
                      {pace}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPreferences(false)}
                >
                  Back
                </Button>
                <Button 
                  variant="accent" 
                  className="flex-1 group"
                  onClick={handleCreateRoute}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Create Route"}
                  {!isGenerating && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
            </div>
          )}

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

        {/* Trending Destinations Section */}
        <div className="mb-8">
          <TrendingDestinations />
        </div>

        {/* Community's Top Routes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Community's Top Routes
              </h2>
              <p className="text-sm text-muted-foreground">Explore popular journeys from our community</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/community")}
            >
              See all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {topRoutes.map((route, index) => (
              <div key={route.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <RouteCard
                  title={route.title}
                  image={routeImages[route.id] || `https://source.unsplash.com/800x600/?${route.destination},travel,landmark`}
                  creator={route.creator}
                  rating={route.rating}
                  onClick={() => navigate("/community")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
