import { LatLng, Layer } from 'leaflet';

export type GeomanShape = 'Polygon' | 'Rectangle' | 'Circle' | 'Marker';

export interface CreatedShapeData {
  shape: GeomanShape;
  layer: Layer;
  latlngs?: LatLng[] | LatLng[][]; // Para polígonos e retângulos [cite: 178]
  center?: LatLng;                  // Para círculos [cite: 179]
  radius?: number;                  // Para círculos [cite: 179]
}

export interface MapGeoJSON {
  type: string;
  features: any[];
  bbox?: number[];
}