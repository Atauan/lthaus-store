
import React, { useEffect, useRef, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Truck } from 'lucide-react';
import { useStoreInfo } from '@/hooks/settings/useStoreInfo';

interface DeliveryDistanceMapProps {
  customerAddress: string;
  onDistanceCalculated?: (distance: number) => void;
}

const DeliveryDistanceMap: React.FC<DeliveryDistanceMapProps> = ({ 
  customerAddress,
  onDistanceCalculated
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { storeInfo } = useStoreInfo();
  
  // Function to load Google Maps script
  const loadGoogleMapsScript = () => {
    // Check if script is already loaded
    if (typeof google !== 'undefined') {
      setIsMapLoaded(true);
      return;
    }
    
    // Create script tag
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,directions`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    
    // Set callback function
    window.initMap = () => {
      setIsMapLoaded(true);
    };
    
    // Append script to document
    document.head.appendChild(googleMapsScript);
  };
  
  useEffect(() => {
    // Load Google Maps script
    loadGoogleMapsScript();
  }, []);
  
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !storeInfo) return;
    
    const storeAddress = `${storeInfo.address}, ${storeInfo.city}, ${storeInfo.state}, ${storeInfo.zipCode}`;
    const geocoder = new google.maps.Geocoder();
    
    // Initialize map with store location
    const storeLocation = { 
      lat: storeInfo.latitude || -10.9342,
      lng: storeInfo.longitude || -37.0677
    };
    
    map.current = new google.maps.Map(mapContainer.current, {
      center: storeLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
      ]
    });
    
    // Add marker for store
    new google.maps.Marker({
      position: storeLocation,
      map: map.current,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(32, 32)
      },
      title: storeInfo.name
    });
    
    // If customer address is provided, geocode and add marker
    if (customerAddress) {
      geocoder.geocode({ address: customerAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const customerLocation = results[0].geometry.location;
          
          // Add marker for customer
          new google.maps.Marker({
            position: customerLocation,
            map: map.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(32, 32)
            },
            title: 'Cliente'
          });
          
          // Calculate distance
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: storeLocation,
              destination: customerLocation,
              travelMode: google.maps.TravelMode.DRIVING
            },
            (response, status) => {
              if (status === 'OK' && response) {
                // Display route on map
                const directionsRenderer = new google.maps.DirectionsRenderer({
                  map: map.current,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#4f46e5',
                    strokeWeight: 5
                  }
                });
                directionsRenderer.setDirections(response);
                
                // Get distance
                const route = response.routes[0];
                if (route && route.legs.length > 0) {
                  const distanceText = route.legs[0].distance?.text || '';
                  const distanceValue = route.legs[0].distance?.value || 0; // in meters
                  
                  setDistance(distanceText);
                  
                  // Callback with distance in km
                  if (onDistanceCalculated) {
                    onDistanceCalculated(distanceValue / 1000);
                  }
                }
              }
            }
          );
          
          // Fit both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(storeLocation);
          bounds.extend(customerLocation);
          map.current?.fitBounds(bounds);
        }
      });
    }
  }, [isMapLoaded, customerAddress, storeInfo, onDistanceCalculated]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5" /> Entrega
          </CardTitle>
          {distance && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Navigation className="h-3 w-3" /> Distância: {distance}
            </Badge>
          )}
        </div>
        <CardDescription>
          {storeInfo?.address}, {storeInfo?.city} - {storeInfo?.state}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainer}
          className="w-full h-[200px] rounded-md overflow-hidden border"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mt-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Loja: {storeInfo?.name}</span>
          </div>
          {customerAddress && (
            <div className="flex items-center gap-1 mt-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Cliente: {customerAddress}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDistanceMap;
