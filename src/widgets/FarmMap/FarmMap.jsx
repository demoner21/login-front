import React from 'react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import { useMap } from '@/context/MapContext';

// Posição inicial (Ex: Brasília)
const position = [-15.793889, -47.882778];
const maxZoom = 18;

export const FarmMap = ({ children }) => {
    const { geojson } = useMap();

    return (
        <div className="w-full flex-1 rounded-4xl overflow-hidden">
            <MapContainer
                center={position}
                zoom={13}
                maxZoom={maxZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri"
                />

                {geojson && <GeoJSON key={Date.now()} data={geojson} />}

                <div style={{ transform: 'rotate(90deg)' }}>
                    <ZoomControl position="bottomright" />
                </div>

                {children}

            </MapContainer>
        </div>
    );
};