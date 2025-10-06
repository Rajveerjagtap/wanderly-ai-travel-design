import { useState } from "react";
import { Search, ArrowLeft, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RouteCard } from "@/components/RouteCard";
import { BottomNav } from "@/components/BottomNav";
import routeParis from "@/assets/route-paris.jpg";
import routeBeach from "@/assets/route-beach.jpg";
import routeJapan from "@/assets/route-japan.jpg";

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("popular");

  const filters = [
    { id: "popular", label: "Most Popular", icon: TrendingUp },
    { id: "budget", label: "Cost-Effective", icon: DollarSign },
    { id: "weekend", label: "Weekend Trips", icon: Calendar },
  ];

  const communityRoutes = [
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
    {
      id: 4,
      title: "European Capital Hopping",
      image: routeParis,
      creator: "Marco_Adventures",
      rating: 4.7,
    },
    {
      id: 5,
      title: "Greek Island Paradise",
      image: routeBeach,
      creator: "IslandSeeker",
      rating: 4.9,
    },
    {
      id: 6,
      title: "Tokyo Food & Culture",
      image: routeJapan,
      creator: "FoodieTravels",
      rating: 4.8,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-heading text-xl font-bold flex-1">Discover Routes</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communityRoutes.map((route, index) => (
            <div
              key={route.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <RouteCard
                title={route.title}
                image={route.image}
                creator={route.creator}
                rating={route.rating}
                onClick={() => navigate("/route")}
              />
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Community;
