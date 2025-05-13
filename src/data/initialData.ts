import { Risk, Control, RiskFactor, Consequence, BowTieRelationship } from '../types';

// Initial risks for the catalog
export const initialRisks: Risk[] = [
  {
    id: '1',
    name: 'Data Breach',
    description: 'Unauthorized access to sensitive customer data',
    category: 'Information Security',
    likelihood: 3,
    impact: 5,
    controlIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Regulatory Non-compliance',
    description: 'Failure to comply with relevant regulations',
    category: 'Compliance',
    likelihood: 2,
    impact: 4,
    controlIds: ['3']
  },
  {
    id: '3',
    name: 'System Downtime',
    description: 'Critical systems unavailable during business hours',
    category: 'Operational',
    likelihood: 3,
    impact: 4,
    controlIds: ['4']
  },
  {
    id: '4',
    name: 'Third-party Vendor Failure',
    description: 'Critical vendor unable to deliver services',
    category: 'Supply Chain',
    likelihood: 2,
    impact: 3,
    controlIds: ['5']
  },
  {
    id: '5',
    name: 'Financial Fraud',
    description: 'Internal or external fraud leading to financial loss',
    category: 'Financial',
    likelihood: 2,
    impact: 4,
    controlIds: ['6', '7']
  },
  {
    id: '6',
    name: 'Physical Security Breach',
    description: 'Unauthorized access to facilities',
    category: 'Physical Security',
    likelihood: 1,
    impact: 3,
    controlIds: ['8']
  }
];

// Initial controls
export const initialControls: Control[] = [
  {
    id: '1',
    name: 'Data Encryption',
    description: 'All sensitive data is encrypted at rest and in transit',
    type: 'Preventive',
    status: 'Implemented',
    effectiveness: 4,
    riskIds: ['1']
  },
  {
    id: '2',
    name: 'Access Controls',
    description: 'Role-based access control to systems and data',
    type: 'Preventive',
    status: 'Implemented',
    effectiveness: 3,
    riskIds: ['1']
  },
  {
    id: '3',
    name: 'Compliance Monitoring',
    description: 'Regular audit and monitoring of compliance requirements',
    type: 'Detective',
    status: 'Partial',
    effectiveness: 2,
    riskIds: ['2']
  },
  {
    id: '4',
    name: 'Redundant Systems',
    description: 'Backup systems and failover mechanisms',
    type: 'Corrective',
    status: 'Implemented',
    effectiveness: 4,
    riskIds: ['3']
  },
  {
    id: '5',
    name: 'Vendor Assessment',
    description: 'Regular vendor risk assessment and monitoring',
    type: 'Detective',
    status: 'Planned',
    effectiveness: 3,
    riskIds: ['4']
  },
  {
    id: '6',
    name: 'Financial Controls',
    description: 'Segregation of duties and approval workflows',
    type: 'Preventive',
    status: 'Implemented',
    effectiveness: 4,
    riskIds: ['5']
  },
  {
    id: '7',
    name: 'Fraud Detection',
    description: 'Automated detection of unusual transactions',
    type: 'Detective',
    status: 'Partial',
    effectiveness: 3,
    riskIds: ['5']
  },
  {
    id: '8',
    name: 'Physical Access Controls',
    description: 'Badge access systems and entry monitoring',
    type: 'Preventive',
    status: 'Implemented',
    effectiveness: 4,
    riskIds: ['6']
  }
];

// Initial risk factors
export const initialRiskFactors: RiskFactor[] = [
  {
    id: '1',
    name: 'Weak Passwords',
    description: 'Use of easy-to-guess passwords by users',
    riskIds: ['1']
  },
  {
    id: '2',
    name: 'Phishing Attempts',
    description: 'Social engineering attacks via email or messaging',
    riskIds: ['1']
  },
  {
    id: '3',
    name: 'Outdated Software',
    description: 'Systems running unpatched or obsolete software',
    riskIds: ['1', '3']
  },
  {
    id: '4',
    name: 'Regulatory Changes',
    description: 'Changes to laws and regulations affecting operations',
    riskIds: ['2']
  },
  {
    id: '5',
    name: 'Resource Overload',
    description: 'Systems experiencing excessive load beyond capacity',
    riskIds: ['3']
  },
  {
    id: '6',
    name: 'Financial Instability',
    description: 'Vendors experiencing financial difficulties',
    riskIds: ['4']
  },
  {
    id: '7',
    name: 'Insider Threat',
    description: 'Actions by employees with malicious intent',
    riskIds: ['5']
  },
  {
    id: '8',
    name: 'Tailgating',
    description: 'Unauthorized entry by following authorized personnel',
    riskIds: ['6']
  }
];

// Initial consequences
export const initialConsequences: Consequence[] = [
  {
    id: '1',
    name: 'Financial Loss',
    description: 'Direct monetary losses due to the risk',
    riskIds: ['1', '5']
  },
  {
    id: '2',
    name: 'Reputational Damage',
    description: 'Loss of customer and market trust',
    riskIds: ['1', '2', '3', '5']
  },
  {
    id: '3',
    name: 'Regulatory Penalties',
    description: 'Fines and sanctions from regulatory bodies',
    riskIds: ['1', '2']
  },
  {
    id: '4',
    name: 'Business Disruption',
    description: 'Inability to conduct normal business operations',
    riskIds: ['3', '4', '6']
  },
  {
    id: '5',
    name: 'Legal Action',
    description: 'Lawsuits from affected parties',
    riskIds: ['1', '2', '5']
  },
  {
    id: '6',
    name: 'Data Loss',
    description: 'Permanent loss of critical data',
    riskIds: ['1', '3']
  }
];

// Initial bow-tie relationships
export const initialBowTieRelationships: BowTieRelationship[] = [
  {
    id: '1',
    riskId: '1',
    factorIds: ['1', '2', '3'],
    consequenceIds: ['1', '2', '3', '5', '6']
  },
  {
    id: '2',
    riskId: '2',
    factorIds: ['4'],
    consequenceIds: ['2', '3', '5']
  },
  {
    id: '3',
    riskId: '3',
    factorIds: ['3', '5'],
    consequenceIds: ['2', '4', '6']
  },
  {
    id: '4',
    riskId: '4',
    factorIds: ['6'],
    consequenceIds: ['4']
  },
  {
    id: '5',
    riskId: '5',
    factorIds: ['7'],
    consequenceIds: ['1', '2', '5']
  },
  {
    id: '6',
    riskId: '6',
    factorIds: ['8'],
    consequenceIds: ['4']
  }
];