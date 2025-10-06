import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RouteCardProps {
  title: string;
  image: string;
  creator: string;
  rating: number;
  onClick?: () => void;
}

export const RouteCard = ({ title, image, creator, rating, onClick }: RouteCardProps) => {
  return (
    <Card className="overflow-hidden hover-lift cursor-pointer" onClick={onClick}>
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="truncate">{creator}</span>
          </div>
          
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-accent" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
