import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const GeomanControls = ({ onShapeCreated, onShapeEdited, onShapeRemoved }) => {
    const map = useMap();

    useEffect(() => {
        // Configurar controles do Geoman
        map.pm.addControls({
            position: 'topright',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            drawCircle: true,
            drawText: false,
            editMode: true,
            dragMode: true,
            cutPolygon: false,
            removalMode: true,
        });

        // Customizar opções globais
        map.pm.setGlobalOptions({
            pathOptions: {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                weight: 2,
            },
        });

        // Event listeners
        const handleCreate = (e) => {
            const { layer, shape } = e;
            console.log('Forma criada:', shape, layer);

            if (shape === 'Polygon' || shape === 'Rectangle') {
                const latlngs = layer.getLatLngs();
                onShapeCreated?.({ shape, latlngs, layer });
            } else if (shape === 'Circle') {
                const center = layer.getLatLng();
                const radius = layer.getRadius();
                onShapeCreated?.({ shape, center, radius, layer });
            }
        };

        const handleEdit = (e) => {
            const { layer } = e;
            console.log('Forma editada:', layer);
            onShapeEdited?.({ layer });
        };

        const handleRemove = (e) => {
            const { layer } = e;
            console.log('Forma removida:', layer);
            onShapeRemoved?.({ layer });
        };

        // Adicionar listeners
        map.on('pm:create', handleCreate);
        map.on('pm:edit', handleEdit);
        map.on('pm:remove', handleRemove);

        // Cleanup
        return () => {
            map.off('pm:create', handleCreate);
            map.off('pm:edit', handleEdit);
            map.off('pm:remove', handleRemove);
            map.pm.removeControls();
        };
    }, [map, onShapeCreated, onShapeEdited, onShapeRemoved]);

    return null;
};

const FarmMapPage = () => {
    // Posição inicial (Ex: Brasília)
    const position = [-15.793889, -47.882778];
    const maxZoom = 18;

    // Estado para guardar as formas desenhadas
    const [shapes, setShapes] = useState([]);

    const handleShapeCreated = ({ shape, latlngs, center, radius, layer }) => {
        const newShape = {
            id: Date.now(),
            shape,
            latlngs,
            center,
            radius,
            layerId: layer._leaflet_id,
        };

        setShapes(prev => [...prev, newShape]);
        console.log('Formas atuais:', [...shapes, newShape]);
    };

    const handleShapeEdited = ({ layer }) => {
        console.log('Editado - Layer ID:', layer._leaflet_id);
        // Atualizar estado se necessário
    };

    const handleShapeRemoved = ({ layer }) => {
        setShapes(prev => prev.filter(s => s.layerId !== layer._leaflet_id));
        console.log('Forma removida - Layer ID:', layer._leaflet_id);
    };

    return (
        <div className="p-2 h-full w-full flex flex-col">
            {/* Info sobre formas desenhadas */}
            {shapes.length > 0 && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                        {shapes.length} forma{shapes.length !== 1 ? 's' : ''} desenhada{shapes.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

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

                    <div style={{ transform: 'rotate(90deg)' }}>
                        <ZoomControl position="bottomright" />
                    </div>

                    <GeomanControls
                        onShapeCreated={handleShapeCreated}
                        onShapeEdited={handleShapeEdited}
                        onShapeRemoved={handleShapeRemoved}
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default FarmMapPage;