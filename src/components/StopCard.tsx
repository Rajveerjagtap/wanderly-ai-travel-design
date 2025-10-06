import { Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StopCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  cost: string;
  onClick?: () => void;
}

export const StopCard = ({ icon, title, time, cost, onClick }: StopCardProps) => {
  return (
    <Card 
      className="p-4 hover-lift cursor-pointer transition-smooth"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-foreground truncate">{title}</h4>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{cost}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
