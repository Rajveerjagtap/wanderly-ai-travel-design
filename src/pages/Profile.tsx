import { ArrowLeft, Settings, MapPin, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RouteCard } from "@/components/RouteCard";
import { BottomNav } from "@/components/BottomNav";
import routeParis from "@/assets/route-paris.jpg";
import routeBeach from "@/assets/route-beach.jpg";

const Profile = () => {
  const navigate = useNavigate();

  const myRoutes = [
    {
      id: 1,
      title: "Summer Italy Adventure",
      image: routeBeach,
      creator: "You",
      rating: 4.7,
    },
    {
      id: 2,
      title: "Weekend in London",
      image: routeParis,
      creator: "You",
      rating: 4.5,
    },
  ];

  const savedRoutes = [
    {
      id: 3,
      title: "Paris Romance Weekend",
      image: routeParis,
      creator: "Sophie_M",
      rating: 4.8,
    },
  ];

  const stats = [
    { icon: MapPin, label: "Routes Created", value: "12" },
    { icon: Heart, label: "Saved Routes", value: "28" },
    { icon: Star, label: "Avg Rating", value: "4.6" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="text-center pb-6">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center text-4xl font-heading font-bold">
              JD
            </div>
            <h1 className="font-heading text-2xl font-bold mb-1">Jane Doe</h1>
            <p className="text-primary-foreground/80">@jane_wanderer</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 -mt-8 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-4 text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-heading text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* My Created Routes */}
        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            My Created Routes
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {myRoutes.map((route) => (
              <RouteCard
                key={route.id}
                title={route.title}
                image={route.image}
                creator={route.creator}
                rating={route.rating}
                onClick={() => navigate("/route")}
              />
            ))}
          </div>
        </div>

        {/* My Saved Routes */}
        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            My Saved Routes
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {savedRoutes.map((route) => (
              <RouteCard
                key={route.id}
                title={route.title}
                image={route.image}
                creator={route.creator}
                rating={route.rating}
                onClick={() => navigate("/route")}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
