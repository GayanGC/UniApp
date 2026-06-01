'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// SLIIT Coordinates
const SLIIT_LAT = 6.9148;
const SLIIT_LNG = 79.9729;

/**
 * Calculates the straight-line distance (in km) between two geographical points using the Haversine formula.
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
}

export default function LocationDisplay({ latitude, longitude }: LocationDisplayProps) {
  const distanceToSliit = calculateDistance(latitude, longitude, SLIIT_LAT, SLIIT_LNG).toFixed(1);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-4 py-3 rounded-xl border border-teal-100 shadow-sm">
        <span className="text-xl">📍</span>
        <span className="font-medium text-sm">
          Located approximately <strong className="font-bold">{distanceToSliit} km</strong> from SLIIT Campus
        </span>
      </div>

      <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 z-0 relative shadow-sm">
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>Boarding Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
