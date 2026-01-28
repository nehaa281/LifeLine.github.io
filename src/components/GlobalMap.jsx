import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { subscribeToAllInventory } from '../lib/firestore';
import { Building, MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../index.css'; // Ensure we can add custom CSS

// Fix for default Leaflet marker icons not showing up in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom icons for High (Green) and Low (Red) stock
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Blue Pulse Icon for User Location
const userPulseIcon = L.divIcon({
    className: 'user-pulse-icon',
    html: '<div class="pulse-ring"></div><div class="user-dot"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const defaultCenter = [40.7128, -74.0060];

function UserLocationMarker({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} icon={userPulseIcon}>
            <Popup>
                <div className="text-center p-1">
                    <span className="font-bold text-blue-600">You are here</span>
                </div>
            </Popup>
        </Marker>
    );
}

export default function GlobalMap({ hospitals = [], userLocation = null }) {

    // Helper to determine marker color based on total stock
    const getMarkerIcon = (stock) => {
        if (!stock) return redIcon;
        const totalUnits = Object.values(stock).reduce((a, b) => a + b, 0);
        // If total units >= 10, consider it "Good" (Green), else "Critical" (Red)
        return totalUnits >= 10 ? greenIcon : redIcon;
    };

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative z-0">
            <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Show User Location */}
                <UserLocationMarker position={userLocation} />

                {/* Show Hospitals */}
                {hospitals.map(hospital => (
                    hospital.location && (
                        <Marker
                            key={hospital.id}
                            position={[hospital.location.lat, hospital.location.lng]}
                            icon={getMarkerIcon(hospital.bloodStock)}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-1 text-slate-900">
                                        <Building className="h-4 w-4 text-blue-600" />
                                        {hospital.hospitalName}
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {hospital.address}
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-brand-600 hover:text-brand-700 font-medium mb-3 flex items-center gap-1"
                                    >
                                        <Navigation className="h-3 w-3" /> Get Directions
                                    </a>

                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {Object.entries(hospital.bloodStock || {}).map(([type, count]) => (
                                            <div key={type} className={`p-1 rounded ${count > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                <div className="text-xs font-bold">{type}</div>
                                                <div className="text-xs">{count}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 text-xs text-slate-400 text-center">
                                        Last updated: {new Date(hospital.lastUpdated).toLocaleTimeString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}
