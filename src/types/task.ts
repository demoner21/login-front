export interface Task {
  id: string;              // Snowflake ID
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'InProgress' | 'Done' | 'Canceled';
  owner_id: string;
  due_date?: string;       // ISO date
  version: number;
  vector_clock: Record<string, number>; // JSONB no banco
  created_at: string;
  updated_at: string;
  is_owner: boolean; // novo — calculado pelo backend
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  due_date?: string;
  shared_with?: string[];
}

export interface CreateTaskResult {
  task: Task;
  share_warnings?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Pending' | 'InProgress' | 'Done' | 'Canceled';
  due_date?: string;
}