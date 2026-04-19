import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [state, setState] = useState({
    lat: null,
    lng: null,
    city: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      setState({
        lat: latitude,
        lng: longitude,
        city: getCityFromCoords(latitude, longitude),
        error: null,
        loading: false,
      });
    };

    const fail = (err) => {
      setState((prev) => ({
        ...prev,
        error: err.message,
        loading: false,
        lat: 28.6139,
        lng: 77.209,
        city: 'New Delhi',
      }));
    };

    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  }, []);

  return state;
}

function getCityFromCoords(lat, lng) {
  const cities = [
    { name: 'New Delhi', lat: 28.6139, lng: 77.209, radius: 0.5 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, radius: 0.5 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 0.5 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, radius: 0.5 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 0.5 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 0.5 },
    { name: 'Hyderabad', lat: 17.385, lng: 78.4867, radius: 0.5 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 0.5 },
  ];

  let closest = cities[0];
  let minDist = Infinity;

  cities.forEach((city) => {
    const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = city;
    }
  });

  return closest.name;
}
