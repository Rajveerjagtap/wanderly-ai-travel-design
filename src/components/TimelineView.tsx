import { MapPin, Navigation } from "lucide-react";

interface Stop {
  id: number;
  type: string;
  icon: React.ReactNode;
  title: string;
  time: string;
  cost: string;
  description: string;
}

interface TimelineViewProps {
  startLocation: string;
  destination: string;
  stops: Stop[];
}

export const TimelineView = ({ startLocation, destination, stops }: TimelineViewProps) => {
  return (
    <div className="relative py-8 px-4">
      {/* Start Marker */}
      <div className="flex items-start gap-4 mb-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Navigation className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="w-1 h-20 bg-gradient-to-b from-primary to-primary/50" />
        </div>
        <div className="pt-2">
          <h3 className="font-heading font-bold text-xl text-foreground mb-1">{startLocation}</h3>
          <p className="text-sm text-muted-foreground">Starting Point</p>
        </div>
      </div>

      {/* Journey Stops */}
      {stops.map((stop, index) => (
        <div
          key={stop.id}
          className="flex items-start gap-4 mb-8 animate-fade-in"
          style={{ animationDelay: `${(index + 1) * 0.1}s` }}
        >
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-medium ${
              stop.type === "transport" ? "bg-secondary" :
              stop.type === "attraction" ? "bg-primary/20" :
              stop.type === "restaurant" ? "bg-accent/20" :
              "bg-muted"
            }`}>
              {stop.icon}
            </div>
            {index < stops.length - 1 && (
              <div className="w-1 h-20 bg-gradient-to-b from-primary/50 to-primary/20" />
            )}
          </div>
          <div className="flex-1 pt-2">
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border hover-lift">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                {stop.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <span>⏱️ {stop.time}</span>
                <span>•</span>
                <span className="text-primary font-medium">{stop.cost}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stop.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Destination Marker */}
      <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${(stops.length + 1) * 0.1}s` }}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow">
            <MapPin className="w-6 h-6 text-accent-foreground" />
          </div>
        </div>
        <div className="pt-2">
          <h3 className="font-heading font-bold text-xl text-foreground mb-1">{destination}</h3>
          <p className="text-sm text-muted-foreground">Final Destination</p>
        </div>
      </div>
    </div>
  );
};
