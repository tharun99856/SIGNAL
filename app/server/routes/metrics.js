import express from 'express';

const router = express.Router();

// Mock metrics data
const generateMetrics = () => {
  const totalCases = 156;
  const resolvedAutonomously = 87;
  const escalated = 23;
  const humanOverrides = 12;

  return {
    operational: {
      slaBreachesPrevented: 34,
      candidateGhostingRate: 4.2, // percentage
      medianResponseTime: 12, // minutes
      casesResolvedAutonomously: resolvedAutonomously,
      casesResolvedAutonomouslyPercent: ((resolvedAutonomously / totalCases) * 100).toFixed(1),
      humanInterventionsRequired: 46,
      humanInterventionsPercent: ((46 / totalCases) * 100).toFixed(1),
      overrideRate: ((humanOverrides / totalCases) * 100).toFixed(1),
    },
    agentQuality: {
      correctEscalationRate: 91.3, // percentage
      incorrectAutonomousActions: 3,
      policyViolations: 0,
      humanOverrideFrequency: humanOverrides,
      averageConfidence: 78.5, // percentage
    },
    timeline: {
      last7Days: [
        { date: '2024-01-15', casesHandled: 18, autonomous: 12, escalated: 3, overridden: 1 },
        { date: '2024-01-16', casesHandled: 22, autonomous: 15, escalated: 4, overridden: 2 },
        { date: '2024-01-17', casesHandled: 25, autonomous: 17, escalated: 3, overridden: 1 },
        { date: '2024-01-18', casesHandled: 20, autonomous: 13, escalated: 5, overridden: 2 },
        { date: '2024-01-19', casesHandled: 19, autonomous: 11, escalated: 4, overridden: 1 },
        { date: '2024-01-20', casesHandled: 28, autonomous: 19, escalated: 4, overridden: 3 },
        { date: '2024-01-21', casesHandled: 24, autonomous: 16, escalated: 5, overridden: 2 },
      ],
    },
    byDecisionType: {
      act: 98,
      escalate: 23,
      ask: 19,
      wait: 16,
    },
    byAutonomyLevel: {
      autonomous: 43,
      supervised: 87,
      recommend: 18,
      observe: 8,
    },
  };
};

// GET /api/metrics - Get all metrics
router.get('/', (req, res) => {
  const metrics = generateMetrics();
  res.json(metrics);
});

// GET /api/metrics/operational - Get operational metrics only
router.get('/operational', (req, res) => {
  const metrics = generateMetrics();
  res.json(metrics.operational);
});

// GET /api/metrics/quality - Get agent quality metrics only
router.get('/quality', (req, res) => {
  const metrics = generateMetrics();
  res.json(metrics.agentQuality);
});

export default router;
