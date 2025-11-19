import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const GeomanControl = () => {
    const map = useMap();

    useEffect(() => {
        // Adiciona os controles do Geoman
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

        // Event listener para quando um polígono é criado
        map.on('pm:create', (e) => {
            const { layer, shape } = e;
            
            if (shape === 'Polygon' || shape === 'Rectangle') {
                const latlngs = layer.getLatLngs();
                console.log('Forma criada:', shape, latlngs);
                
                // Você pode salvar no estado aqui
            }
        });

        // Cleanup
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
        <div className="p-2 h-full w-full flex flex-col">
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