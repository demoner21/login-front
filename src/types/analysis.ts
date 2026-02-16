export interface SoilAnalysis {
  id: number;
  fieldId: number;
  analysisDate: string;
  phLevel: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  erosionRiskIndex?: number; // Baseado no seu projeto de mestrado
}