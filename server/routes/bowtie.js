import express from 'express';
import { executeQuery } from '../database/connection.js';

const router = express.Router();

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get all risk factors
router.get('/factors', async (req, res) => {
  try {
    const factors = await executeQuery(`
      SELECT rf.*, 
             GROUP_CONCAT(DISTINCT rfr.risk_id) as risk_ids
      FROM risk_factors rf
      LEFT JOIN risk_factor_risks rfr ON rf.id = rfr.risk_factor_id
      GROUP BY rf.id
      ORDER BY rf.created_at DESC
    `);

    const formattedFactors = factors.map(factor => ({
      ...factor,
      riskIds: factor.risk_ids ? factor.risk_ids.split(',') : []
    }));

    res.json(formattedFactors);
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({ error: 'Failed to fetch risk factors' });
  }
});

// Get all consequences
router.get('/consequences', async (req, res) => {
  try {
    const consequences = await executeQuery(`
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT cr.risk_id) as risk_ids
      FROM consequences c
      LEFT JOIN consequence_risks cr ON c.id = cr.consequence_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    const formattedConsequences = consequences.map(consequence => ({
      ...consequence,
      riskIds: consequence.risk_ids ? consequence.risk_ids.split(',') : []
    }));

    res.json(formattedConsequences);
  } catch (error) {
    console.error('Error fetching consequences:', error);
    res.status(500).json({ error: 'Failed to fetch consequences' });
  }
});

// Get all bow-tie relationships
router.get('/relationships', async (req, res) => {
  try {
    const relationships = await executeQuery(`
      SELECT br.id, br.risk_id,
             GROUP_CONCAT(DISTINCT bf.factor_id) as factor_ids,
             GROUP_CONCAT(DISTINCT bc.consequence_id) as consequence_ids
      FROM bowtie_relationships br
      LEFT JOIN bowtie_factors bf ON br.id = bf.bowtie_id
      LEFT JOIN bowtie_consequences bc ON br.id = bc.bowtie_id
      GROUP BY br.id
      ORDER BY br.created_at DESC
    `);

    const formattedRelationships = relationships.map(rel => ({
      id: rel.id,
      riskId: rel.risk_id,
      factorIds: rel.factor_ids ? rel.factor_ids.split(',') : [],
      consequenceIds: rel.consequence_ids ? rel.consequence_ids.split(',') : []
    }));

    res.json(formattedRelationships);
  } catch (error) {
    console.error('Error fetching bow-tie relationships:', error);
    res.status(500).json({ error: 'Failed to fetch bow-tie relationships' });
  }
});

// Create risk factor
router.post('/factors', async (req, res) => {
  try {
    const { name, description, riskIds = [] } = req.body;
    const id = generateId();

    await executeQuery(
      'INSERT INTO risk_factors (id, name, description) VALUES (?, ?, ?)',
      [id, name, description]
    );

    // Add risk relationships
    for (const riskId of riskIds) {
      await executeQuery(
        'INSERT INTO risk_factor_risks (risk_factor_id, risk_id) VALUES (?, ?)',
        [id, riskId]
      );
    }

    const newFactor = { id, name, description, riskIds };
    res.status(201).json(newFactor);
  } catch (error) {
    console.error('Error creating risk factor:', error);
    res.status(500).json({ error: 'Failed to create risk factor' });
  }
});

// Create consequence
router.post('/consequences', async (req, res) => {
  try {
    const { name, description, riskIds = [] } = req.body;
    const id = generateId();

    await executeQuery(
      'INSERT INTO consequences (id, name, description) VALUES (?, ?, ?)',
      [id, name, description]
    );

    // Add risk relationships
    for (const riskId of riskIds) {
      await executeQuery(
        'INSERT INTO consequence_risks (consequence_id, risk_id) VALUES (?, ?)',
        [id, riskId]
      );
    }

    const newConsequence = { id, name, description, riskIds };
    res.status(201).json(newConsequence);
  } catch (error) {
    console.error('Error creating consequence:', error);
    res.status(500).json({ error: 'Failed to create consequence' });
  }
});

// Create bow-tie relationship
router.post('/relationships', async (req, res) => {
  try {
    const { riskId, factorIds = [], consequenceIds = [] } = req.body;
    const id = generateId();

    await executeQuery(
      'INSERT INTO bowtie_relationships (id, risk_id) VALUES (?, ?)',
      [id, riskId]
    );

    // Add factor relationships
    for (const factorId of factorIds) {
      await executeQuery(
        'INSERT INTO bowtie_factors (bowtie_id, factor_id) VALUES (?, ?)',
        [id, factorId]
      );
    }

    // Add consequence relationships
    for (const consequenceId of consequenceIds) {
      await executeQuery(
        'INSERT INTO bowtie_consequences (bowtie_id, consequence_id) VALUES (?, ?)',
        [id, consequenceId]
      );
    }

    const newRelationship = { id, riskId, factorIds, consequenceIds };
    res.status(201).json(newRelationship);
  } catch (error) {
    console.error('Error creating bow-tie relationship:', error);
    res.status(500).json({ error: 'Failed to create bow-tie relationship' });
  }
});

export default router;