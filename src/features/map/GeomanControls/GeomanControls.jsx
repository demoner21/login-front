import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export const GeomanControls = ({ onShapeCreated, onShapeEdited, onShapeRemoved }) => {
    const map = useMap();

    useEffect(() => {
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

        map.pm.setGlobalOptions({
            pathOptions: {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                weight: 2,
            },
        });

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


        map.on('pm:create', handleCreate);
        map.on('pm:edit', handleEdit);
        map.on('pm:remove', handleRemove);

        return () => {
            map.off('pm:create', handleCreate);
            map.off('pm:edit', handleEdit);
            map.off('pm:remove', handleRemove);
            map.pm.removeControls();
        };
    }, [map, onShapeCreated, onShapeEdited, onShapeRemoved]);

    return null;
};