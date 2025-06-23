import express from 'express';
import { executeQuery } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all controls with their risks
router.get('/', async (req, res) => {
  try {
    const controls = await executeQuery(`
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT rc.risk_id) as risk_ids
      FROM controls c
      LEFT JOIN risk_controls rc ON c.id = rc.control_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    const formattedControls = controls.map(control => ({
      ...control,
      riskIds: control.risk_ids ? control.risk_ids.split(',') : []
    }));

    res.json(formattedControls);
  } catch (error) {
    console.error('Error fetching controls:', error);
    res.status(500).json({ error: 'Failed to fetch controls' });
  }
});

// Get control by ID
router.get('/:id', async (req, res) => {
  try {
    const [control] = await executeQuery(
      'SELECT * FROM controls WHERE id = ?',
      [req.params.id]
    );

    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }

    const risks = await executeQuery(`
      SELECT r.* FROM risks r
      JOIN risk_controls rc ON r.id = rc.risk_id
      WHERE rc.control_id = ?
    `, [req.params.id]);

    control.riskIds = risks.map(r => r.id);
    res.json(control);
  } catch (error) {
    console.error('Error fetching control:', error);
    res.status(500).json({ error: 'Failed to fetch control' });
  }
});

// Create new control
router.post('/', async (req, res) => {
  try {
    const { name, description, type, status, effectiveness, riskIds = [] } = req.body;
    const id = uuidv4();

    await executeQuery(
      'INSERT INTO controls (id, name, description, type, status, effectiveness) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, description, type, status, effectiveness]
    );

    // Add risk relationships
    for (const riskId of riskIds) {
      await executeQuery(
        'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
        [riskId, id]
      );
    }

    const newControl = {
      id,
      name,
      description,
      type,
      status,
      effectiveness,
      riskIds
    };

    res.status(201).json(newControl);
  } catch (error) {
    console.error('Error creating control:', error);
    res.status(500).json({ error: 'Failed to create control' });
  }
});

// Update control
router.put('/:id', async (req, res) => {
  try {
    const { name, description, type, status, effectiveness, riskIds = [] } = req.body;

    await executeQuery(
      'UPDATE controls SET name = ?, description = ?, type = ?, status = ?, effectiveness = ? WHERE id = ?',
      [name, description, type, status, effectiveness, req.params.id]
    );

    // Update risk relationships
    await executeQuery('DELETE FROM risk_controls WHERE control_id = ?', [req.params.id]);
    
    for (const riskId of riskIds) {
      await executeQuery(
        'INSERT INTO risk_controls (risk_id, control_id) VALUES (?, ?)',
        [riskId, req.params.id]
      );
    }

    const updatedControl = {
      id: req.params.id,
      name,
      description,
      type,
      status,
      effectiveness,
      riskIds
    };

    res.json(updatedControl);
  } catch (error) {
    console.error('Error updating control:', error);
    res.status(500).json({ error: 'Failed to update control' });
  }
});

// Delete control
router.delete('/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM controls WHERE id = ?', [req.params.id]);
    res.json({ message: 'Control deleted successfully' });
  } catch (error) {
    console.error('Error deleting control:', error);
    res.status(500).json({ error: 'Failed to delete control' });
  }
});

export default router;