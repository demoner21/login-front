import React, { createContext, useState, useContext } from 'react';

const MapContext = createContext();

export const useMap = () => {
  return useContext(MapContext);
};

export const MapProvider = ({ children }) => {
  const [geojson, setGeojson] = useState(null);

  const value = {
    geojson,
    setGeojson,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
