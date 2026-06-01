'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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

// SLIIT default coordinates
const DEFAULT_CENTER: [number, number] = [6.9148, 79.9729];
const DEFAULT_ZOOM = 13;

interface LocationPickerProps {
  position: { lat: number; lng: number } | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

/**
 * Handles map click events to update the selected position
 */
function MapClickHandler({ onPositionChange }: { onPositionChange: (pos: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

export default function LocationPicker({ position, onPositionChange }: LocationPickerProps) {
  // If we already have a position, use it as the center, otherwise use default
  const center = position ? [position.lat, position.lng] : DEFAULT_CENTER;

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 z-0 relative">
      <MapContainer
        center={center as [number, number]}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPositionChange={onPositionChange} />
        {position && <Marker position={[position.lat, position.lng]} />}
      </MapContainer>
      
      {!position && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-200 pointer-events-none text-xs font-medium text-gray-700">
          Click anywhere on the map to place a pin
        </div>
      )}
    </div>
  );
}
