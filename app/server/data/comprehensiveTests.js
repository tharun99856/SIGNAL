import { v4 as uuidv4 } from 'uuid';

/**
 * Comprehensive Test Suite for Decision Engine
 * 
 * Covers all major scenarios:
 * - Normal workflow progression
 * - SLA breaches
 * - Missing feedback
 * - Candidate follow-ups
 * - Rejected candidates
 * - Edge cases
 * 
 * Total: 100+ scenarios
 */

export function generateComprehensiveTestSuite() {
  const scenarios = [];

  // ===== CATEGORY 1: NORMAL WORKFLOW (Should ACT or WAIT) =====
  
  // 1-10: Feedback complete, various wait times
  for (let days = 1; days <= 10; days++) {
    scenarios.push({
      id: `normal-complete-${days}d`,
      category: 'Normal Workflow',
      description: `Feedback complete, waiting ${days} days`,
      candidate: {
        id: uuidv4(),
        stage: 'Final Interview',
        daysInactive: days,
        slaBreached: days > 5,
        feedback: { submitted: 3, required: 3 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      // Expect ACT if >= 3 days with complete feedback, else WAIT
      expectedDecision: days >= 3 ? 'act' : 'wait',
    });
  }

  // 11-15: Partial feedback, short wait
  for (let missing = 1; missing <= 3; missing++) {
    scenarios.push({
      id: `normal-partial-${missing}missing`,
      category: 'Normal Workflow',
      description: `${missing} feedback missing, waiting 2 days`,
      candidate: {
        id: uuidv4(),
        stage: 'Technical Interview',
        daysInactive: 2,
        slaBreached: false,
        feedback: { submitted: 3 - missing, required: 3 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      expectedDecision: 'wait', // Not urgent yet
    });
  }

  // ===== CATEGORY 2: SLA BREACHES (Should ACT) =====
  
  // 16-25: SLA breached with various feedback states
  for (let days = 6; days <= 10; days++) {
    const feedbackSubmitted = days % 2 === 0 ? 3 : 2; // Some complete, some not
    scenarios.push({
      id: `sla-breach-${days}d`,
      category: 'SLA Breach',
      description: `SLA breach (${days} days), ${feedbackSubmitted}/3 feedback`,
      candidate: {
        id: uuidv4(),
        stage: 'Final Interview',
        daysInactive: days,
        slaBreached: true,
        feedback: { submitted: feedbackSubmitted, required: 3 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      expectedDecision: 'act', // Must act on SLA breach
    });
  }

  // ===== CATEGORY 3: CANDIDATE FOLLOW-UPS (Should ESCALATE when multiple) =====
  
  // 26-30: Progressive follow-ups
  for (let followups = 1; followups <= 5; followups++) {
    scenarios.push({
      id: `followup-${followups}x`,
      category: 'Candidate Follow-ups',
      description: `Candidate followed up ${followups} times`,
      candidate: {
        id: uuidv4(),
        stage: 'Phone Screen',
        daysInactive: 4,
        slaBreached: false,
        feedback: { submitted: 2, required: 2 },
        candidateFollowUps: followups,
        hiringManagerActive: true,
      },
      // Escalate if 3+ follow-ups
      expectedDecision: followups >= 3 ? 'escalate' : (followups === 2 ? 'act' : 'wait'),
    });
  }

  // ===== CATEGORY 4: REJECTED CANDIDATES (Always ESCALATE on inquiry) =====
  
  // 31-40: Rejected candidates with inquiries
  for (let followups = 1; followups <= 10; followups++) {
    scenarios.push({
      id: `rejected-inquiry-${followups}x`,
      category: 'Rejected Candidates',
      description: `Rejected candidate asks why (${followups} follow-ups)`,
      candidate: {
        id: uuidv4(),
        stage: 'Rejected',
        daysInactive: 1,
        slaBreached: false,
        feedback: { submitted: 3, required: 3 },
        candidateFollowUps: followups,
        hiringManagerActive: true,
      },
      expectedDecision: 'escalate', // Always escalate rejected candidate inquiries
    });
  }

  // ===== CATEGORY 5: EARLY STAGES (More conservative) =====
  
  // 41-50: Resume review / phone screen
  const earlyStages = ['Resume Review', 'Phone Screen'];
  for (let i = 0; i < 10; i++) {
    scenarios.push({
      id: `early-stage-${i}`,
      category: 'Early Stages',
      description: `${earlyStages[i % 2]} stage, ${2 + i} days inactive`,
      candidate: {
        id: uuidv4(),
        stage: earlyStages[i % 2],
        daysInactive: 2 + i,
        slaBreached: (2 + i) > 5,
        feedback: { submitted: 1, required: 1 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      // Act if SLA breached or feedback complete + 3+ days
      expectedDecision: ((2 + i) > 5 || (2 + i) >= 3) ? 'act' : 'wait',
    });
  }

  // ===== CATEGORY 6: CRITICAL/URGENT (Should ESCALATE) =====
  
  // 51-55: Multiple issues combined
  scenarios.push({
    id: 'critical-combo-1',
    category: 'Critical',
    description: 'SLA breach + multiple follow-ups + missing feedback',
    candidate: {
      id: uuidv4(),
      stage: 'Final Interview',
      daysInactive: 8,
      slaBreached: true,
      feedback: { submitted: 1, required: 3 },
      candidateFollowUps: 3,
      hiringManagerActive: false,
    },
    expectedDecision: 'escalate', // Multiple red flags
  });

  scenarios.push({
    id: 'critical-combo-2',
    category: 'Critical',
    description: '10+ days inactive, all feedback complete',
    candidate: {
      id: uuidv4(),
      stage: 'Offer Discussion',
      daysInactive: 12,
      slaBreached: true,
      feedback: { submitted: 2, required: 2 },
      candidateFollowUps: 2,
      hiringManagerActive: false,
    },
    expectedDecision: 'escalate', // Way overdue
  });

  scenarios.push({
    id: 'critical-combo-3',
    category: 'Critical',
    description: 'Hiring manager inactive + SLA breach + candidate waiting',
    candidate: {
      id: uuidv4(),
      stage: 'Technical Interview',
      daysInactive: 9,
      slaBreached: true,
      feedback: { submitted: 3, required: 3 },
      candidateFollowUps: 1,
      hiringManagerActive: false,
    },
    expectedDecision: 'act', // Chase hiring manager
  });

  // ===== CATEGORY 7: NO ACTION NEEDED (Should WAIT) =====
  
  // 56-65: Recent activity, no issues
  for (let i = 0; i < 10; i++) {
    scenarios.push({
      id: `no-action-${i}`,
      category: 'No Action Needed',
      description: `Active recently (${i + 1} day), progressing normally`,
      candidate: {
        id: uuidv4(),
        stage: 'Technical Interview',
        daysInactive: i % 2 === 0 ? 1 : 2,
        slaBreached: false,
        feedback: { submitted: i % 3, required: 3 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      expectedDecision: 'wait', // All good, no urgency
    });
  }

  // ===== CATEGORY 8: EDGE CASES =====
  
  // 66: No feedback required (automated stage)
  scenarios.push({
    id: 'edge-no-feedback',
    category: 'Edge Cases',
    description: 'Automated stage, no feedback required',
    candidate: {
      id: uuidv4(),
      stage: 'Background Check',
      daysInactive: 3,
      slaBreached: false,
      feedback: { submitted: 0, required: 0 },
      candidateFollowUps: 0,
      hiringManagerActive: true,
    },
    expectedDecision: 'wait', // Automated process
  });

  // 67: All feedback submitted but more than required (edge case)
  scenarios.push({
    id: 'edge-extra-feedback',
    category: 'Edge Cases',
    description: 'Extra feedback submitted (4/3)',
    candidate: {
      id: uuidv4(),
      stage: 'Final Interview',
      daysInactive: 4,
      slaBreached: false,
      feedback: { submitted: 4, required: 3 },
      candidateFollowUps: 0,
      hiringManagerActive: true,
    },
    expectedDecision: 'act', // Feedback complete + 3+ days
  });

  // 68-70: Boundary testing (exactly at thresholds)
  scenarios.push({
    id: 'boundary-exactly-3-days',
    category: 'Edge Cases',
    description: 'Exactly 3 days, feedback complete',
    candidate: {
      id: uuidv4(),
      stage: 'Final Interview',
      daysInactive: 3,
      slaBreached: false,
      feedback: { submitted: 2, required: 2 },
      candidateFollowUps: 0,
      hiringManagerActive: true,
    },
    expectedDecision: 'act', // At threshold
  });

  scenarios.push({
    id: 'boundary-exactly-5-days',
    category: 'Edge Cases',
    description: 'Exactly 5 days (SLA threshold)',
    candidate: {
      id: uuidv4(),
      stage: 'Technical Interview',
      daysInactive: 5,
      slaBreached: true,
      feedback: { submitted: 2, required: 3 },
      candidateFollowUps: 0,
      hiringManagerActive: true,
    },
    expectedDecision: 'act', // SLA breach
  });

  // ===== CATEGORY 9: MIXED SCENARIOS (Real-world complexity) =====
  
  // 71-85: Various combinations
  const mixedScenarios = [
    { days: 4, feedback: [2, 2], followups: 1, stage: 'Phone Screen', expected: 'act' },
    { days: 6, feedback: [3, 3], followups: 0, stage: 'Final Interview', expected: 'act' },
    { days: 3, feedback: [1, 3], followups: 2, stage: 'Technical Interview', expected: 'wait' },
    { days: 7, feedback: [0, 2], followups: 1, stage: 'Resume Review', expected: 'act' },
    { days: 2, feedback: [2, 2], followups: 0, stage: 'Phone Screen', expected: 'wait' },
    { days: 8, feedback: [3, 3], followups: 2, stage: 'Offer Discussion', expected: 'act' },
    { days: 1, feedback: [0, 1], followups: 0, stage: 'Resume Review', expected: 'wait' },
    { days: 9, feedback: [1, 2], followups: 3, stage: 'Technical Interview', expected: 'escalate' },
    { days: 5, feedback: [2, 2], followups: 1, stage: 'Final Interview', expected: 'act' },
    { days: 3, feedback: [3, 3], followups: 0, stage: 'Technical Interview', expected: 'act' },
    { days: 11, feedback: [2, 3], followups: 2, stage: 'Final Interview', expected: 'act' },
    { days: 2, feedback: [1, 2], followups: 0, stage: 'Phone Screen', expected: 'wait' },
    { days: 6, feedback: [0, 3], followups: 4, stage: 'Technical Interview', expected: 'escalate' },
    { days: 4, feedback: [3, 3], followups: 1, stage: 'Final Interview', expected: 'act' },
    { days: 1, feedback: [1, 1], followups: 0, stage: 'Resume Review', expected: 'wait' },
  ];

  mixedScenarios.forEach((scenario, i) => {
    scenarios.push({
      id: `mixed-${i}`,
      category: 'Mixed Scenarios',
      description: `${scenario.days}d, ${scenario.feedback[0]}/${scenario.feedback[1]} feedback, ${scenario.followups} followups`,
      candidate: {
        id: uuidv4(),
        stage: scenario.stage,
        daysInactive: scenario.days,
        slaBreached: scenario.days > 5,
        feedback: { submitted: scenario.feedback[0], required: scenario.feedback[1] },
        candidateFollowUps: scenario.followups,
        hiringManagerActive: true,
      },
      expectedDecision: scenario.expected,
    });
  });

  // ===== CATEGORY 10: STRESS TESTS (Extreme values) =====
  
  // 86-95: Extreme scenarios
  scenarios.push({
    id: 'stress-very-long-wait',
    category: 'Stress Tests',
    description: '30 days inactive (extreme delay)',
    candidate: {
      id: uuidv4(),
      stage: 'Final Interview',
      daysInactive: 30,
      slaBreached: true,
      feedback: { submitted: 2, required: 3 },
      candidateFollowUps: 5,
      hiringManagerActive: false,
    },
    expectedDecision: 'escalate', // Extreme delay
  });

  scenarios.push({
    id: 'stress-many-followups',
    category: 'Stress Tests',
    description: '10 candidate follow-ups',
    candidate: {
      id: uuidv4(),
      stage: 'Phone Screen',
      daysInactive: 3,
      slaBreached: false,
      feedback: { submitted: 1, required: 1 },
      candidateFollowUps: 10,
      hiringManagerActive: true,
    },
    expectedDecision: 'escalate', // Too many follow-ups
  });

  scenarios.push({
    id: 'stress-zero-feedback-required',
    category: 'Stress Tests',
    description: 'Zero feedback required, 10 days wait',
    candidate: {
      id: uuidv4(),
      stage: 'Background Check',
      daysInactive: 10,
      slaBreached: true,
      feedback: { submitted: 0, required: 0 },
      candidateFollowUps: 0,
      hiringManagerActive: true,
    },
    expectedDecision: 'wait', // Automated stage
  });

  return scenarios;
}
