export interface Property {
  id: number;
  name: string;
  totalArea: number;
  address?: string;
  city?: string;
  state?: string;
  ownerId: number; // Referência ao ID do User
  createdAt: string;
}