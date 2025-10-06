import { Home, Compass, User, Route } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Route, label: "Route", path: "/route" },
    { icon: Compass, label: "Discover", path: "/community" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong z-40">
      <div className="flex items-center justify-around max-w-screen-md mx-auto px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-smooth ${
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? "fill-primary/20" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
