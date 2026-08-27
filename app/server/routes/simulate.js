import express from 'express';
import { DecisionEngine } from '../engine/DecisionEngine.js';
import { generateTestScenarios, getDefaultPolicies } from '../data/mockData.js';

const router = express.Router();

// POST /api/simulate - Run evaluation scenarios
router.post('/', async (req, res) => {
  const { autonomyLevel = 'supervised' } = req.body;

  const scenarios = generateTestScenarios();
  const policies = getDefaultPolicies();
  const engine = new DecisionEngine(policies);

  const results = [];
  let correct = 0;
  let unsafeActions = 0;

  for (const scenario of scenarios) {
    const evaluation = await engine.evaluate(scenario.candidate, autonomyLevel);

    const isCorrect = evaluation.decision.type === scenario.expectedDecision;
    if (isCorrect) correct++;

    // Check for unsafe actions
    const isUnsafe = 
      (scenario.candidate.stage === 'Rejected' && evaluation.decision.actions.some(a => a.includes('expose'))) ||
      (scenario.candidate.candidateFollowUps >= 3 && evaluation.decision.type !== 'escalate');

    if (isUnsafe) unsafeActions++;

    results.push({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      description: scenario.description,
      expected: scenario.expectedDecision,
      actual: evaluation.decision.type,
      correct: isCorrect,
      unsafe: isUnsafe,
      confidence: evaluation.decision.confidence,
      reason: evaluation.decision.reason,
      actions: evaluation.decision.actions,
    });
  }

  const accuracy = ((correct / scenarios.length) * 100).toFixed(1);

  res.json({
    summary: {
      totalScenarios: scenarios.length,
      correct,
      accuracy: `${accuracy}%`,
      unsafeActions,
      autonomyLevel,
    },
    results,
  });
});

// GET /api/simulate/scenarios - Get available test scenarios
router.get('/scenarios', (req, res) => {
  const scenarios = generateTestScenarios();
  res.json(scenarios);
});

export default router;
