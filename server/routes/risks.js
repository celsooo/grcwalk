import express from 'express';
import { executeQuery } from '../database/connection.js';

const router = express.Router();

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const calculateRiskLevel = (likelihood, impact) => {
  const score = likelihood * impact;
  if (score >= 15) return 'Critical';
  if (score >= 8) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
};

// Get all risks with their controls
router.get('/', async (req, res) => {
  try {
    const risks = await executeQuery(`
      SELECT r.*, 
             GROUP_CONCAT(DISTINCT rc.control_id) as control_ids
      FROM risks r
      LEFT JOIN risk_controls rc ON r.id = rc.risk_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    const formattedRisks = risks.map(risk => ({
      ...risk,
      controlIds: risk.control_ids ? risk.control_ids.split(',') : []
    }));

    res.json(formattedRisks);
  } catch (error) {
    console.error('Error fetching risks:', error);
    res.status(500).json({ error: 'Failed to fetch risks' });
  }
});

// Get risk by ID
router.get('/:id', async (req, res) => {
  try {
    const [risk] = await executeQuery(
      'SELECT * FROM risks WHERE id = ?',
      [req.params.id]
    );

    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    const controls = await executeQuery(`
      SELECT c.* FROM controls c
      JOIN risk_controls rc ON c.id = rc.control_id
      WHERE rc.risk_id = ?
    `, [req.params.id]);

    risk.controlIds = controls.map(c => c.id);
    res.json(risk);
  } catch (error) {
    console.error('Error fetching risk:', error);
    res.status(500).json({ error: 'Failed to fetch risk' });
  }
});

// Create new risk
router.post('/', async (req, res) => {
  try {
    const { name, description, category, likelihood, impact, controlIds = [] } = req.body;
    const id = generateId();
    const level = calculateRiskLevel(likelihood, impact);

    await executeQuery(
      'INSERT INTO risks (id, name, description, category, likelihood, impact, level) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, category, likelihood, impact, level]
    );

    // Add control relationships
    for (const controlId of controlIds) {
      await executeQuery(
        'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
        [id, controlId]
      );
    }

    const newRisk = {
      id,
      name,
      description,
      category,
      likelihood,
      impact,
      level,
      controlIds
    };

    res.status(201).json(newRisk);
  } catch (error) {
    console.error('Error creating risk:', error);
    res.status(500).json({ error: 'Failed to create risk' });
  }
});

// Update risk
router.put('/:id', async (req, res) => {
  try {
    const { name, description, category, likelihood, impact, controlIds = [] } = req.body;
    const level = calculateRiskLevel(likelihood, impact);

    await executeQuery(
      'UPDATE risks SET name = ?, description = ?, category = ?, likelihood = ?, impact = ?, level = ? WHERE id = ?',
      [name, description, category, likelihood, impact, level, req.params.id]
    );

    // Update control relationships
    await executeQuery('DELETE FROM risk_controls WHERE risk_id = ?', [req.params.id]);
    
    for (const controlId of controlIds) {
      await executeQuery(
        'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
        [req.params.id, controlId]
      );
    }

    const updatedRisk = {
      id: req.params.id,
      name,
      description,
      category,
      likelihood,
      impact,
      level,
      controlIds
    };

    res.json(updatedRisk);
  } catch (error) {
    console.error('Error updating risk:', error);
    res.status(500).json({ error: 'Failed to update risk' });
  }
});

// Delete risk
router.delete('/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM risks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Risk deleted successfully' });
  } catch (error) {
    console.error('Error deleting risk:', error);
    res.status(500).json({ error: 'Failed to delete risk' });
  }
});

export default router;