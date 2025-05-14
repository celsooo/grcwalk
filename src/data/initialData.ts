import { Risk, Control, RiskFactor, Consequence, BowTieRelationship } from '../types';

// Initial risks for the catalog
export const initialRisks: Risk[] = [
  {
    id: '1',
    name: 'Ataque cibernético',
    description: 'Ataque cibernético impactando na execução de serviços críticos',
    category: 'Information Security',
    likelihood: 4,
    impact: 5,
    controlIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Não compliance com Risco Operacional',
    description: 'Descumprimento de Resoluções BCB relacionadas a Risco Operacional (ex.: 198, 265)',
    category: 'Compliance',
    likelihood: 2,
    impact: 4,
    controlIds: ['3']
  },
  {
    id: '3',
    name: 'Indisponibilidade de sistemas',
    description: 'Critical systems unavailable during business hours',
    category: 'Operational',
    likelihood: 3,
    impact: 4,
    controlIds: ['4']
  },
  {
    id: '4',
    name: 'Interrupção crítica de terceiros',
    description: 'Critical vendor unable to deliver services',
    category: 'Operational',
    likelihood: 2,
    impact: 3,
    controlIds: ['5']
  },
  {
    id: '5',
    name: 'Fraude interna ou externa em transações',
    description: 'Internal or external fraud leading to financial loss',
    category: 'Financial',
    likelihood: 4,
    impact: 4,
    controlIds: ['6', '7']
  },
  {
    id: '6',
    name: 'Vazamento de dados financeiros e de cartão',
    description: 'Unauthorized access to sensitive customer data',
    category: 'Information Security',
    likelihood: 1,
    impact: 3,
    controlIds: ['1','2']
  },
  {
    id: '7',
    name: 'Erros em liquidações financeiras ou reconciliação de valores',
    description: 'Erros em liquidações financeiras ou reconciliação de valores',
    category: 'Operational',
    likelihood: 4,
    impact: 5,
    controlIds: []
  },
  {
    id: '8',
    name: 'Chargeback de transações não capturado ou contestado',
    description: 'Chargeback de transações não capturado ou contestado',
    category: 'Operational',
    likelihood: 4,
    impact: 4,
    controlIds: []
  },
  {
    id: '9',
    name: 'Erros em processamento',
    description: 'Erros em processamento de transações e demais rotinas automatizadas',
    category: 'Operational',
    likelihood: 4,
    impact: 4,
    controlIds: []
  },
  {
    id: '10',
    name: 'Lavagem de dinheiro',
    description: 'Não conformidade com normas e leis relacionados a Prevenção de Lavagem de Dinheiro e Financiamento ao Terrorismo - PLD-FT ',
    category: 'Compliance',
    likelihood: 3,
    impact: 5,
    controlIds: ['3']
  },
  {
    id: '11',
    name: 'Credenciamento de clientes irregular',
    description: 'Credenciamento de clientes em desacordo com políticas internas e externas',
    category: 'Compliance',
    likelihood: 4,
    impact: 3,
    controlIds: ['3']
  },
  {
    id: '12',
    name: 'Violação de SLAs regulatórios',
    description: 'Violação de SLAs regulatórios (ex.: tempos do PIX, disponibilidade do Open Finance)',
    category: 'Compliance',
    likelihood: 3,
    impact: 4,
    controlIds: []
  },
  {
    id: '13',
    name: 'Inconformidade com Arranjo de Pagamentos',
    description: 'Multas e sanções decorrentes do não cumprimento de regras do arranjo de pagamentos',
    category: 'Compliance',
    likelihood: 3,
    impact: 4,
    controlIds: []
  },
  {
    id: '14',
    name: 'Erros de cálculo de MDR',
    description: 'Cobrança de taxas transacionais em desacordo com os contratos estabelecidos',
    category: 'Operational',
    likelihood: 3,
    impact: 4,
    controlIds: []
  },
  {
    id: '15',
    name: 'Privacidade de dados',
    description: 'Não conformidade com leis de privacidade de dados (ex.: LGPD, GDPR)',
    category: 'Operational',
    likelihood: 3,
    impact: 3,
    controlIds: []
  },
  {
    id: '16',
    name: 'Falhas em integrações',
    description: 'Falhas em integração com bandeiras, IMF’s e demais parceiros',
    category: 'Operational',
    likelihood: 3,
    impact: 4,
    controlIds: []
  },
  {
    id: '17',
    name: 'Falhas na execução de mudanças',
    description: 'Falhas na execução de mudanças de tecnologia de produtos críticos',
    category: 'Operational',
    likelihood: 3,
    impact: 4,
    controlIds: []
  },
  {
    id: '18',
    name: 'Perda de certificação PCI',
    description: 'Falha em controles de segurança da informação impactando na perda da certificação PCI DSS',
    category: 'Information Security',
    likelihood: 1,
    impact: 5,
    controlIds: []
  },
  {
    id: '19',
    name: 'Corrupção e perda de dados críticos',
    description: 'Perda de dados críticos por incidentes aliados à ausência de replicação/backup ou demais controles relevantes',
    category: 'Information Security',
    likelihood: 1,
    impact: 5,
    controlIds: []
  },
  {
    id: '20',
    name: 'Erros ou atrasos em obrigações recorrentes',
    description: 'Erros ou atrasos em obrigações recorrentes e reportes periódicos a autoridades (ex.: SCR, CCS)',
    category: 'Compliance',
    likelihood: 3,
    impact: 3,
    controlIds: []
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
