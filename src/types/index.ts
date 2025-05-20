// Type definitions for the GRC tool

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ControlStatus = 'Implemented' | 'Partial' | 'Planned' | 'Not Implemented';
export type ControlType = 'Preventive' | 'Detective' | 'Corrective' | 'Directive';
export type ComplianceStatus = 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';
export type ActionStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type ActionPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type AuditStatus = 'Planned' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled';

// Risk definition
export interface Risk {
  id: string;
  name: string;
  description: string;
  category: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  level?: RiskLevel; // Computed based on likelihood and impact
  controlIds: string[]; // References to controls
}

// Control definition
export interface Control {
  id: string;
  name: string;
  description: string;
  type: ControlType;
  status: ControlStatus;
  effectiveness: number; // 1-5
  riskIds: string[]; // References to risks
}

// Action Plan definition
export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: ActionPriority;
  dueDate: string;
  assignee: string;
  progress: number; // 0-100
  relatedRiskIds: string[];
  relatedControlIds: string[];
  tasks: ActionTask[];
  comments: ActionComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ActionTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignee?: string;
}

export interface ActionComment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

// Risk Factor definition for Bow-tie analysis
export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  riskIds: string[]; // References to risks
}

// Consequence definition for Bow-tie analysis
export interface Consequence {
  id: string;
  name: string;
  description: string;
  riskIds: string[]; // References to risks
}

// Bow-tie relationship
export interface BowTieRelationship {
  id: string;
  riskId: string;
  factorIds: string[];
  consequenceIds: string[];
}

// Compliance Requirement
export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: ComplianceStatus;
  dueDate: string;
  assignee: string;
  evidence: string;
  controlIds: string[];
}

// Compliance Framework
export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  requirements: ComplianceRequirement[];
}

// Audit Plan
export interface AuditPlan {
  id: string;
  title: string;
  description: string;
  scope: string;
  objectives: string[];
  status: AuditStatus;
  startDate: string;
  endDate: string;
  auditor: string;
  auditType: string;
  relatedControlIds: string[];
  relatedRiskIds: string[];
  checklistItems: AuditChecklistItem[];
  findings: AuditFinding[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  evidence?: string;
  notes?: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  recommendation: string;
  responsibleParty: string;
  dueDate: string;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
}