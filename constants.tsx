
import React from 'react';
import { CloudProvider, CloudResource, ResourceStatus, SecurityAlert, ApprovalRequest } from './types';

export const MOCK_RESOURCES: CloudResource[] = [
  { id: 'i-09f1234a', name: 'prod-api-gw', type: 'EC2', provider: CloudProvider.AWS, monthlyCost: 450, status: ResourceStatus.ACTIVE, wasteScore: 5 },
  { id: 'i-98b7654c', name: 'dev-sandbox-db', type: 'RDS', provider: CloudProvider.AWS, monthlyCost: 120, status: ResourceStatus.IDLE, wasteScore: 85 },
  { id: 'v-11223344', name: 'temp-storage-ebs', type: 'EBS', provider: CloudProvider.AWS, monthlyCost: 45, status: ResourceStatus.ZOMBIE, wasteScore: 100 },
  { id: 'az-vm-99', name: 'marketing-frontend', type: 'VM', provider: CloudProvider.AZURE, monthlyCost: 320, status: ResourceStatus.ACTIVE, wasteScore: 12 },
  { id: 'gcp-bq-01', name: 'analytics-warehouse', type: 'BigQuery', provider: CloudProvider.GCP, monthlyCost: 1100, status: ResourceStatus.ACTIVE, wasteScore: 25 },
];

export const MOCK_ALERTS: SecurityAlert[] = [
  { 
    id: 'sec-001', 
    severity: 'critical', 
    title: 'S3 Bucket Public Access', 
    description: 'Bucket "customer-docs-backup" was found with public READ permissions.', 
    timestamp: '2024-05-20T14:30:00Z',
    autoRemediated: true,
    status: 'fixed'
  },
  { 
    id: 'sec-002', 
    severity: 'high', 
    title: 'Unencrypted EBS Volume', 
    description: 'Volume "vol-0a1b2c3d" in us-east-1 is not encrypted at rest.', 
    timestamp: '2024-05-20T15:15:00Z',
    autoRemediated: false,
    status: 'open'
  },
  { 
    id: 'sec-003', 
    severity: 'medium', 
    title: 'Idle IAM Access Key', 
    description: 'User "deploy-bot" has an access key older than 90 days that has not been used.', 
    timestamp: '2024-05-19T09:00:00Z',
    autoRemediated: false,
    status: 'open'
  }
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'apr-101',
    requester: 'John Doe (DevOps)',
    description: 'Spin up p3.8xlarge GPU cluster for ML training cycle.',
    estimatedCost: 2400,
    type: 'resource_provision',
    status: 'pending'
  },
  {
    id: 'apr-102',
    requester: 'Jane Smith (SecOps)',
    description: 'Temporary bypass of SSH port restrictions for debugging session.',
    estimatedCost: 0,
    type: 'security_exception',
    status: 'pending'
  }
];

export const CHART_DATA = [
  { name: 'Mon', spend: 4200, potential: 3800 },
  { name: 'Tue', spend: 4500, potential: 3900 },
  { name: 'Wed', spend: 5100, potential: 4000 },
  { name: 'Thu', spend: 4800, potential: 3750 },
  { name: 'Fri', spend: 5300, potential: 4100 },
  { name: 'Sat', spend: 3900, potential: 3500 },
  { name: 'Sun', spend: 3700, potential: 3400 },
];
