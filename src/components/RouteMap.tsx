import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";

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

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyDz0YtLxP8sbwc7aPvY5aZlnTo9EX3AZBQ";

export const RouteMap = ({ startLocation, destination, stops }: RouteMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!isLoaded || !startLocation || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    // Create waypoints from stops that are attractions - limit to avoid API quota issues
    const attractionStops = stops
      .filter(stop => stop.type === "attraction" || stop.type === "restaurant")
      .slice(0, 3); // Reduced limit for better performance

    const waypoints = attractionStops.map(stop => ({
      location: stop.title,
      stopover: true,
    }));

    directionsService.route(
      {
        origin: startLocation,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true, // Optimize route for better path
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
          console.error("Directions request failed with status:", status);
          // If directions fail, try without waypoints
          if (waypoints.length > 0) {
            directionsService.route(
              {
                origin: startLocation,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                  setDirections(result);
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
                }
              }
            );
          }
        }
      }
    );
  }, [isLoaded, startLocation, destination, stops]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-3xl">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={directions ? 6 : 8}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "simplified" }]
          }
        ],
      }}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "hsl(180, 100%, 25%)", // Using primary color
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
            markerOptions: {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "hsl(39, 100%, 50%)", // Using accent color
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
              }
            }
          }}
        />
      )}
    </GoogleMap>
  );
};
