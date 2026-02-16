export interface WSMessage {
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'join_room' | 'leave_room';
  task_id?: string;
  payload?: any;
  user_id: string;
  timestamp: string;
}

export interface WSClient {
  id: string;
  user_id: string;
  rooms: string[];  // task_ids que está ouvindo
}