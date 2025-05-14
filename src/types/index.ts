// Type definitions for the GRC tool

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ControlStatus = 'Implemented' | 'Partial' | 'Planned' | 'Not Implemented';
export type ControlType = 'Preventive' | 'Detective' | 'Corrective' | 'Directive';
export type ComplianceStatus = 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';

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