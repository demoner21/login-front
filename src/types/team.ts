export interface Team {
  id: string;
  name: string;
  description?: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'Admin' | 'Member' | 'Viewer';
  joined_at: string;
}