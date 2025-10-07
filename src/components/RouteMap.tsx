import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

interface Stop {
  title: string;
  type: string;
  cost: string;
}

interface RouteMapProps {
  startLocation: string;
  destination: string;
  stops: Stop[];
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Center of India
};

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export const RouteMap = ({ startLocation, destination, stops }: RouteMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    if (!startLocation || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    // Create waypoints from stops that are attractions
    const waypoints = stops
      .filter(stop => stop.type === "attraction" || stop.type === "restaurant")
      .slice(0, 8) // Google Maps API limit
      .map(stop => ({
        location: stop.title,
        stopover: true,
      }));

    directionsService.route(
      {
        origin: startLocation,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          
          // Set center to the midpoint
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach(leg => {
            if (leg.start_location) bounds.extend(leg.start_location);
            if (leg.end_location) bounds.extend(leg.end_location);
          });
          
          const centerPoint = bounds.getCenter();
          setCenter({
            lat: centerPoint.lat(),
            lng: centerPoint.lng(),
          });
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [startLocation, destination, stops]);

  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-3xl">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">Google Maps API key required</p>
          <p className="text-sm text-muted-foreground">
            Please add your Google Maps API key to display the route map
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#8B5CF6",
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
