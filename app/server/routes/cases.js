import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DecisionEngine } from '../engine/DecisionEngine.js';
import { generateMockCandidates } from '../data/mockData.js';

const router = express.Router();

// In-memory storage (replace with DB in production)
let cases = [];
let policies = [];

// Initialize with mock data
async function initializeCases() {
  const candidates = generateMockCandidates(15);
  const engine = new DecisionEngine(policies);

  const casePromises = candidates.map(async (candidate) => {
    const evaluation = await engine.evaluate(candidate, 'supervised');
    return {
      id: uuidv4(),
      candidate,
      decision: evaluation.decision,
      status: getStatusFromDecision(evaluation.decision.type),
      actionLog: [
        {
          id: uuidv4(),
          timestamp: new Date(),
          action: 'Case created by Signal Agent',
          actor: 'system',
          metadata: { triggerEvent: 'SLA monitor' },
        },
        {
          id: uuidv4(),
          timestamp: new Date(Date.now() + 1000),
          action: `Decision: ${evaluation.decision.type.toUpperCase()}`,
          actor: 'agent',
          metadata: { reason: evaluation.decision.reason },
        },
      ],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });

  cases = await Promise.all(casePromises);
}

function getStatusFromDecision(decisionType) {
  switch (decisionType) {
    case 'act':
      return Math.random() > 0.5 ? 'resolved' : 'pending';
    case 'escalate':
      return 'escalated';
    case 'ask':
    case 'wait':
      return 'waiting';
    default:
      return 'pending';
  }
}

// GET /api/cases - List all cases
router.get('/', async (req, res) => {
  if (cases.length === 0) {
    await initializeCases();
  }

  const { status, urgency } = req.query;

  let filtered = [...cases];

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  if (urgency) {
    const engine = new DecisionEngine(policies);
    filtered = filtered.filter(c => {
      const context = engine.gatherContext(c.candidate);
      if (urgency === 'high') return context.urgency >= 70;
      if (urgency === 'medium') return context.urgency >= 40 && context.urgency < 70;
      if (urgency === 'low') return context.urgency < 40;
      return true;
    });
  }

  res.json({
    cases: filtered,
    total: filtered.length,
    summary: {
      resolved: cases.filter(c => c.status === 'resolved').length,
      escalated: cases.filter(c => c.status === 'escalated').length,
      waiting: cases.filter(c => c.status === 'waiting').length,
      pending: cases.filter(c => c.status === 'pending').length,
    },
  });
});

// GET /api/cases/:id - Get single case
router.get('/:id', (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.id);

  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }

  // Calculate urgency on the fly
  const engine = new DecisionEngine(policies);
  const context = engine.gatherContext(caseItem.candidate);

  res.json({
    ...caseItem,
    context,
  });
});

// POST /api/cases/:id/decide - Re-evaluate a case
router.post('/:id/decide', async (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.id);

  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const { autonomyLevel = 'supervised' } = req.body;

  const engine = new DecisionEngine(policies);
  const evaluation = await engine.evaluate(caseItem.candidate, autonomyLevel);

  caseItem.decision = evaluation.decision;
  caseItem.status = getStatusFromDecision(evaluation.decision.type);
  caseItem.updatedAt = new Date();

  caseItem.actionLog.push({
    id: uuidv4(),
    timestamp: new Date(),
    action: `Re-evaluated with autonomy: ${autonomyLevel}`,
    actor: 'agent',
    metadata: { decision: evaluation.decision.type },
  });

  res.json(caseItem);
});

// POST /api/cases/:id/override - Human override
router.post('/:id/override', (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.id);

  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const { decision, actions, reason, applyTo = 'case' } = req.body;

  caseItem.decision = {
    ...caseItem.decision,
    type: decision,
    actions,
    reason: `Human override: ${reason}`,
    requiresApproval: false,
  };

  caseItem.status = decision === 'escalate' ? 'escalated' : 'resolved';
  caseItem.updatedAt = new Date();

  caseItem.actionLog.push({
    id: uuidv4(),
    timestamp: new Date(),
    action: 'Human override applied',
    actor: 'recruiter',
    metadata: { decision, reason, applyTo },
  });

  // If applyTo === 'policy', create a new policy
  let newPolicy = null;
  if (applyTo === 'policy') {
    newPolicy = {
      id: uuidv4(),
      name: `Policy from Override - ${caseItem.candidate.name}`,
      description: reason,
      rule: `custom_${Date.now()}`,
      active: true,
      createdAt: new Date(),
      source: 'override',
    };
    policies.push(newPolicy);
  }

  res.json({
    case: caseItem,
    policyCreated: newPolicy,
  });
});

// POST /api/cases/:id/action - Execute an action
router.post('/:id/action', (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.id);

  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const { action, metadata = {} } = req.body;

  caseItem.actionLog.push({
    id: uuidv4(),
    timestamp: new Date(),
    action,
    actor: 'agent',
    metadata,
  });

  caseItem.updatedAt = new Date();

  res.json(caseItem);
});

// Export for use in other modules
export async function setPolicies(newPolicies) {
  policies = newPolicies;
  // Re-initialize cases with new policies
  await initializeCases();
}

export default router;
