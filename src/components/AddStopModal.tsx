import { useState, useRef, useEffect } from "react";
import { X, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoadScript } from "@react-google-maps/api";

interface AddStopModalProps {
  onClose: () => void;
  onAddStop: (place: { name: string; address: string }) => void;
}

const libraries: ("places")[] = ["places"];

export const AddStopModal = ({ onClose, onAddStop }: AddStopModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBXOLhXONAfe67Lx-RlsNFrAKc8YsRmBFo",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "in" },
        fields: ["name", "formatted_address", "geometry", "photos", "rating"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          setSelectedPlace(place);
          setSearchQuery(place.name || "");
        }
      });
    }
  }, [isLoaded]);

  const handleAddStop = () => {
    if (selectedPlace) {
      onAddStop({
        name: selectedPlace.name || "",
        address: selectedPlace.formatted_address || "",
      });
      onClose();
    }
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
        <div className="bg-card rounded-3xl p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-strong animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">Add a Stop</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a place to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {selectedPlace && (
            <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlace.formatted_address}
                  </p>
                  {selectedPlace.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <span className="text-sm text-accent">{selectedPlace.rating} ⭐</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleAddStop}
              disabled={!selectedPlace}
            >
              Add to Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
