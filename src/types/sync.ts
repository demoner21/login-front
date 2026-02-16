export interface SyncChange {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  task_id: string;
  payload: any;  // Task data
  timestamp?: string;
  idempotency_key?: string;  // Previne duplicatas
}

export interface SyncRequest {
  last_pulled_version: number;  // Última versão que cliente conhece
  changes: SyncChange[];        // Mudanças locais (feitas offline)
}

export interface SyncResponse {
  synced_count: number;        // Quantas mudanças foram aceitas
  new_tasks: Task[];          // Tasks que cliente não tem
  conflicts?: SyncConflict[]; // Conflitos detectados
}

export interface SyncConflict {
  task_id: string;
  client_version: number;
  server_version: number;
  resolution?: 'client_wins' | 'server_wins' | 'manual';
}