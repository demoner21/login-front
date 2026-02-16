export interface Field {
  id: number;
  propertyId: number;
  name: string;
  area: number;
  cropType: string; // Ex: "Soja", "Milho"
  boundary?: any;   // Aqui você integrará com o MapGeoJSON definido anteriormente
  status: 'ACTIVE' | 'INACTIVE' | 'HARVESTED';
}