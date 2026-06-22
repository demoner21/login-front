import { ReactNode } from 'react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import { useMap } from '@/context/map-context';
import { MapGeoJSON } from '@/types/map';

const position: [number, number] = [-15.793889, -47.882778];
const maxZoom = 18;

interface FarmMapProps {
    children?: ReactNode;
}

export const FarmMap = ({ children }: FarmMapProps) => {
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

                {geojson && <GeoJSON key={Date.now()} data={geojson as MapGeoJSON} />}

                <div style={{ transform: 'rotate(90deg)' }}>
                    <ZoomControl position="bottomright" />
                </div>

                {children}
            </MapContainer>
        </div>
    );
};