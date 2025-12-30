
export enum CloudProvider {
  AWS = 'AWS',
  AZURE = 'Azure',
  GCP = 'GCP'
}

export enum ResourceStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  ZOMBIE = 'zombie',
  TERMINATED = 'terminated'
}

export interface CloudResource {
  id: string;
  name: string;
  type: string;
  provider: CloudProvider;
  monthlyCost: number;
  status: ResourceStatus;
  wasteScore: number; // 0 to 100
}

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  autoRemediated: boolean;
  status: 'open' | 'fixed';
}

export interface ApprovalRequest {
  id: string;
  requester: string;
  description: string;
  estimatedCost: number;
  type: 'resource_provision' | 'security_exception';
  status: 'pending' | 'approved' | 'denied';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
