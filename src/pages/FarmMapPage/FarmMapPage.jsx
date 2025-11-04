import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

const FarmMapPage = () => {
    // Posição inicial (Ex: Brasília)
    const position = [-15.793889, -47.882778];
    const maxZoom = 18;

    return (
        // MUDANÇA 1: Adicionamos este 'div' pai com 'p-6' (o padding padrão)
        // Usamos 'flex' e 'h-full' para garantir que o mapa preencha
        // o espaço *dentro* do padding.
        <div className="p-2 h-full w-full flex flex-col">

            {/* MUDANÇA 2: O container do mapa agora usa 'flex-1' 
              para ocupar o espaço restante, em vez de 'h-full'.
              Mantemos o 'rounded-2xl' e 'overflow-hidden'.
            */}
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
                </MapContainer>
            </div>
        </div>
    );
};

export default FarmMapPage;