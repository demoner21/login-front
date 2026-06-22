// src/context/MapContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MapGeoJSON } from '@/types/map'; // tipo já existe!

interface MapContextType {
  geojson: MapGeoJSON | null;
  setGeojson: (geojson: MapGeoJSON | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap deve ser usado dentro de um MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [geojson, setGeojson] = useState<MapGeoJSON | null>(null);

  return (
    <MapContext.Provider value={{ geojson, setGeojson }}>
      {children}
    </MapContext.Provider>
  );
};
