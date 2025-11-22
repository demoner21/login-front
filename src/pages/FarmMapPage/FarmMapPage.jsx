import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// ... (Mantenha o componente GeomanControl exatamente como está) ...
const GeomanControl = () => {
    // ... código do GeomanControl mantido ...
    const map = useMap();
    useEffect(() => {
        map.pm.addControls({
            position: 'topright',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawCircle: true,
            drawPolygon: true,
            drawText: false,
        });
        map.on('pm:create', (e) => {
            const { layer, shape } = e;
            if (shape === 'Polygon' || shape === 'Rectangle') {
                const latlngs = layer.getLatLngs();
                console.log('Forma criada:', shape, latlngs);
            }
        });
        return () => {
            map.pm.removeControls();
            map.off('pm:create');
        };
    }, [map]);
    return null;
};

const FarmMapPage = () => {
    const position = [-15.793889, -47.882778];
    const maxZoom = 18;
    const [polygons, setPolygons] = useState([]);

    return (
        /* ALTERAÇÃO 1: Removido 'p-2' da div principal.
           Agora ela apenas preenche a altura e largura do container pai (MainLayout).
        */
        <div className="h-full w-full flex flex-col">
            
            {/* ALTERAÇÃO 2: Removido 'rounded-4xl' daqui.
               O arredondamento agora é feito pelo MainLayout, que corta (overflow-hidden) 
               o que estiver dentro dele.
            */}
            <div className="w-full flex-1 overflow-hidden">
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
                        attribution="Tiles © Esri"
                    />

                    <ZoomControl position="bottomright" />
                    
                    <GeomanControl />
                </MapContainer>
            </div>
        </div>
    );
};

export default FarmMapPage;