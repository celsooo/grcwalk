import { executeQuery } from './connection.js';

const calculateRiskLevel = (likelihood, impact) => {
  const score = likelihood * impact;
  if (score >= 15) return 'Critical';
  if (score >= 8) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await executeQuery('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = [
      'audit_findings', 'audit_checklist_items', 'audit_plan_risks', 'audit_plan_controls', 'audit_plans',
      'vendor_controls', 'vendor_risks', 'vendors',
      'action_comments', 'action_tasks', 'action_plan_controls', 'action_plan_risks', 'action_plans',
      'compliance_controls', 'compliance_requirements',
      'bowtie_consequences', 'bowtie_factors', 'bowtie_relationships',
      'consequence_risks', 'consequences',
      'risk_factor_risks', 'risk_factors',
      'risk_controls', 'controls', 'risks'
    ];

    for (const table of tables) {
      await executeQuery(`DELETE FROM ${table}`);
    }

    await executeQuery('SET FOREIGN_KEY_CHECKS = 1');

    // Seed risks
    const risks = [
      {
        id: generateId(),
        name: 'Ataque cibernético',
        description: 'Ataque cibernético impactando na execução de serviços críticos',
        category: 'Information Security',
        likelihood: 4,
        impact: 5
      },
      {
        id: generateId(),
        name: 'Não compliance com Risco Operacional',
        description: 'Descumprimento de Resoluções BCB relacionadas a Risco Operacional (ex.: 198, 265)',
        category: 'Compliance',
        likelihood: 2,
        impact: 4
      },
      {
        id: generateId(),
        name: 'Indisponibilidade de sistemas',
        description: 'Sistemas de pagamentos críticos indisponíveis',
        category: 'Operational',
        likelihood: 3,
        impact: 4
      },
      {
        id: generateId(),
        name: 'Interrupção crítica de terceiros',
        description: 'Fornecedores, parceiros e demais terceiros indisponíveis, impactando na entrega de serviços',
        category: 'Operational',
        likelihood: 2,
        impact: 3
      },
      {
        id: generateId(),
        name: 'Fraude interna ou externa em transações',
        description: 'Fraude interna ou externa em transações ocasionando em perda financeira',
        category: 'Operational',
        likelihood: 4,
        impact: 4
      }
    ];

    for (const risk of risks) {
      const level = calculateRiskLevel(risk.likelihood, risk.impact);
      await executeQuery(
        'INSERT INTO risks (id, name, description, category, likelihood, impact, level) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [risk.id, risk.name, risk.description, risk.category, risk.likelihood, risk.impact, level]
      );
    }

    // Seed controls
    const controls = [
      {
        id: generateId(),
        name: 'Data Encryption',
        description: 'All sensitive data is encrypted at rest and in transit',
        type: 'Preventive',
        status: 'Implemented',
        effectiveness: 4
      },
      {
        id: generateId(),
        name: 'Access Controls',
        description: 'Role-based access control to systems and data',
        type: 'Preventive',
        status: 'Implemented',
        effectiveness: 3
      },
      {
        id: generateId(),
        name: 'Compliance Monitoring',
        description: 'Regular audit and monitoring of compliance requirements',
        type: 'Detective',
        status: 'Partial',
        effectiveness: 2
      },
      {
        id: generateId(),
        name: 'Redundant Systems',
        description: 'Backup systems and failover mechanisms',
        type: 'Corrective',
        status: 'Implemented',
        effectiveness: 4
      }
    ];

    for (const control of controls) {
      await executeQuery(
        'INSERT INTO controls (id, name, description, type, status, effectiveness) VALUES (?, ?, ?, ?, ?, ?)',
        [control.id, control.name, control.description, control.type, control.status, control.effectiveness]
      );
    }

    // Create risk-control relationships
    await executeQuery(
      'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
      [risks[0].id, controls[0].id]
    );
    await executeQuery(
      'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
      [risks[0].id, controls[1].id]
    );
    await executeQuery(
      'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
      [risks[1].id, controls[2].id]
    );

    // Seed risk factors
    const riskFactors = [
      {
        id: generateId(),
        name: 'Weak Passwords',
        description: 'Use of easy-to-guess passwords by users'
      },
      {
        id: generateId(),
        name: 'Phishing Attempts',
        description: 'Social engineering attacks via email or messaging'
      },
      {
        id: generateId(),
        name: 'Outdated Software',
        description: 'Systems running unpatched or obsolete software'
      }
    ];

    for (const factor of riskFactors) {
      await executeQuery(
        'INSERT INTO risk_factors (id, name, description) VALUES (?, ?, ?)',
        [factor.id, factor.name, factor.description]
      );
    }

    // Seed consequences
    const consequences = [
      {
        id: generateId(),
        name: 'Financial Loss',
        description: 'Direct monetary losses due to the risk'
      },
      {
        id: generateId(),
        name: 'Reputational Damage',
        description: 'Loss of customer and market trust'
      },
      {
        id: generateId(),
        name: 'Regulatory Penalties',
        description: 'Fines and sanctions from regulatory bodies'
      }
    ];

    for (const consequence of consequences) {
      await executeQuery(
        'INSERT INTO consequences (id, name, description) VALUES (?, ?, ?)',
        [consequence.id, consequence.name, consequence.description]
      );
    }

    // Create bow-tie relationship for first risk
    const bowtieId = generateId();
    await executeQuery(
      'INSERT INTO bowtie_relationships (id, risk_id) VALUES (?, ?)',
      [bowtieId, risks[0].id]
    );

    // Link factors and consequences to bow-tie
    for (const factor of riskFactors) {
      await executeQuery(
        'INSERT INTO bowtie_factors (bowtie_id, factor_id) VALUES (?, ?)',
        [bowtieId, factor.id]
      );
      await executeQuery(
        'INSERT INTO risk_factor_risks (risk_factor_id, risk_id) VALUES (?, ?)',
        [factor.id, risks[0].id]
      );
    }

    for (const consequence of consequences) {
      await executeQuery(
        'INSERT INTO bowtie_consequences (bowtie_id, consequence_id) VALUES (?, ?)',
        [bowtieId, consequence.id]
      );
      await executeQuery(
        'INSERT INTO consequence_risks (consequence_id, risk_id) VALUES (?, ?)',
        [consequence.id, risks[0].id]
      );
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};