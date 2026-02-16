export enum Permission {
  Read = 1 << 0,      // 1
  Write = 1 << 1,     // 2
  Delete = 1 << 2,    // 4
  Share = 1 << 3,     // 8
  Admin = 1 << 4      // 16
}

export type ResourceType = 'TASK' | 'FARM_AREA' | 'TEAM' | 'DOCUMENT';
export type GranteeType = 'USER' | 'TEAM' | 'PUBLIC';

export interface ACL {
  resource_id: string;
  resource_type: ResourceType;
  grantee_type: GranteeType;
  grantee_id?: string;
  permissions: number;  // Bitmask
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

export interface GrantACLRequest {
  resource_id: string;
  resource_type: ResourceType;
  grantee_type: GranteeType;
  grantee_id?: string;
  permissions: number | string[] | Record<string, boolean>;
  expires_at?: string;
}