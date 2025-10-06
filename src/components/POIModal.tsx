import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface POIModalProps {
  title: string;
  image: string;
  rating: number;
  description: string;
  onClose: () => void;
  onAddToRoute: () => void;
}

export const POIModal = ({ title, image, rating, description, onClose, onAddToRoute }: POIModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-strong animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-smooth"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="aspect-[16/9] overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-heading text-2xl font-bold flex-1">{title}</h2>
            <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-semibold text-accent">{rating}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            {description}
          </p>
          
          <Button 
            variant="accent" 
            className="w-full"
            onClick={onAddToRoute}
          >
            Add to My Route
          </Button>
        </div>
      </div>
    </div>
  );
};
