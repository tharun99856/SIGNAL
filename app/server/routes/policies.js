import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultPolicies } from '../data/mockData.js';
import { setPolicies } from './cases.js';

const router = express.Router();

// In-memory storage
let policies = getDefaultPolicies();

// GET /api/policies - List all policies
router.get('/', (req, res) => {
  const { active } = req.query;

  let filtered = [...policies];

  if (active !== undefined) {
    filtered = filtered.filter(p => p.active === (active === 'true'));
  }

  res.json({
    policies: filtered,
    total: filtered.length,
    active: policies.filter(p => p.active).length,
  });
});

// GET /api/policies/:id - Get single policy
router.get('/:id', (req, res) => {
  const policy = policies.find(p => p.id === req.params.id);

  if (!policy) {
    return res.status(404).json({ error: 'Policy not found' });
  }

  res.json(policy);
});

// POST /api/policies - Create new policy
router.post('/', (req, res) => {
  const { name, description, rule, active = true } = req.body;

  if (!name || !description || !rule) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newPolicy = {
    id: uuidv4(),
    name,
    description,
    rule,
    active,
    createdAt: new Date(),
    source: 'manual',
  };

  policies.push(newPolicy);
  setPolicies(policies);

  res.status(201).json(newPolicy);
});

// PATCH /api/policies/:id - Update policy
router.patch('/:id', (req, res) => {
  const policy = policies.find(p => p.id === req.params.id);

  if (!policy) {
    return res.status(404).json({ error: 'Policy not found' });
  }

  const { name, description, rule, active } = req.body;

  if (name !== undefined) policy.name = name;
  if (description !== undefined) policy.description = description;
  if (rule !== undefined) policy.rule = rule;
  if (active !== undefined) policy.active = active;

  policy.updatedAt = new Date();

  setPolicies(policies);

  res.json(policy);
});

// DELETE /api/policies/:id - Delete policy
router.delete('/:id', (req, res) => {
  const index = policies.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Policy not found' });
  }

  const deleted = policies.splice(index, 1)[0];
  setPolicies(policies);

  res.json({ message: 'Policy deleted', policy: deleted });
});

export default router;
