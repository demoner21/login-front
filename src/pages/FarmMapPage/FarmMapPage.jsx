import React, { useState } from 'react';
import { FarmMap } from '@/widgets/FarmMap/FarmMap';
import { GeomanControls } from '@/features/map/GeomanControls/GeomanControls';

const FarmMapPage = () => {
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
        // O layout da página (padding, info box) permanece aqui
        <div className="p-2 h-full w-full flex flex-col">

            {/* Info sobre formas desenhadas */}
            {shapes.length > 0 && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                        {shapes.length} forma{shapes.length !== 1 ? 's' : ''} desenhada{shapes.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* A MÁGICA: 
              Renderizamos o Widget <FarmMap> e passamos 
              a Feature <GeomanControls> como sua 'child'.
            */}
            <FarmMap>
                <GeomanControls
                    onShapeCreated={handleShapeCreated}
                    onShapeEdited={handleShapeEdited}
                    onShapeRemoved={handleShapeRemoved}
                />
            </FarmMap>

        </div>
    );
};

export default FarmMapPage;