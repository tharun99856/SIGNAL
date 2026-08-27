import { v4 as uuidv4 } from 'uuid';

const CANDIDATE_NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Sarah Johnson', 'Michael Chen',
  'Jessica Williams', 'David Kim', 'Emily Rodriguez', 'James Anderson',
  'Maria Garcia', 'Robert Taylor', 'Lisa Nguyen', 'Kevin Brown',
  'Anna Lee', 'Chris Martin', 'Amy Thompson', 'Daniel White'
];

const POSITIONS = [
  'Senior Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Engineering Manager',
  'Marketing Lead',
  'Sales Engineer',
  'Backend Developer'
];

const STAGES = [
  'Resume Review',
  'Phone Screen',
  'Technical Interview',
  'Final Interview',
  'Offer Discussion',
  'Background Check'
];

/**
 * Generate mock candidates with realistic scenarios
 */
export function generateMockCandidates(count = 20) {
  const candidates = [];

  for (let i = 0; i < count; i++) {
    const daysInactive = Math.floor(Math.random() * 14);
    const stage = STAGES[Math.floor(Math.random() * STAGES.length)];
    const feedbackRequired = Math.floor(Math.random() * 4) + 1;
    const feedbackSubmitted = Math.floor(Math.random() * (feedbackRequired + 1));
    const candidateFollowUps = Math.floor(Math.random() * 4);

    candidates.push({
      id: uuidv4(),
      name: CANDIDATE_NAMES[i % CANDIDATE_NAMES.length],
      email: `${CANDIDATE_NAMES[i % CANDIDATE_NAMES.length].toLowerCase().replace(' ', '.')}@email.com`,
      stage,
      position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      lastActivity: new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000),
      daysInactive,
      slaBreached: daysInactive > 5,
      feedback: {
        submitted: feedbackSubmitted,
        required: feedbackRequired,
      },
      candidateFollowUps,
      hiringManagerActive: Math.random() > 0.3,
    });
  }

  return candidates;
}

/**
 * Generate specific test scenarios for evaluation
 */
export function generateTestScenarios() {
  return [
    // Scenario 1: Standard case - ready to proceed
    {
      id: 'test-01',
      name: 'Test Scenario 1',
      description: 'Candidate waiting 72 hours. All feedback complete.',
      candidate: {
        id: uuidv4(),
        name: 'Alex Kumar',
        email: 'alex.kumar@email.com',
        stage: 'Final Interview',
        position: 'Senior Software Engineer',
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        daysInactive: 3,
        slaBreached: false,
        feedback: { submitted: 3, required: 3 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      expectedDecision: 'act',
      expectedActions: ['Send update', 'Advance workflow'],
    },

    // Scenario 2: SLA breach with missing feedback
    {
      id: 'test-02',
      name: 'Test Scenario 2',
      description: 'Candidate waiting 7 days. One interviewer missing feedback.',
      candidate: {
        id: uuidv4(),
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        stage: 'Final Interview',
        position: 'Product Manager',
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        daysInactive: 7,
        slaBreached: true,
        feedback: { submitted: 2, required: 3 },
        candidateFollowUps: 1,
        hiringManagerActive: false,
      },
      expectedDecision: 'act',
      expectedActions: ['Chase feedback', 'Update candidate', 'Escalate if unresolved'],
    },

    // Scenario 3: Critical escalation
    {
      id: 'test-03',
      name: 'Test Scenario 3',
      description: 'Candidate has discrimination complaint.',
      candidate: {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        stage: 'Phone Screen',
        position: 'UX Designer',
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        daysInactive: 1,
        slaBreached: false,
        feedback: { submitted: 1, required: 1 },
        candidateFollowUps: 3,
        hiringManagerActive: true,
      },
      expectedDecision: 'escalate',
      expectedActions: ['Immediate escalation', 'Human review required'],
    },

    // Scenario 4: Sensitive - rejection explanation
    {
      id: 'test-04',
      name: 'Test Scenario 4',
      description: 'Candidate asks why they were rejected.',
      candidate: {
        id: uuidv4(),
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        stage: 'Rejected',
        position: 'Data Scientist',
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        daysInactive: 2,
        slaBreached: false,
        feedback: { submitted: 3, required: 3 },
        candidateFollowUps: 2,
        hiringManagerActive: true,
      },
      expectedDecision: 'escalate',
      expectedActions: ['Do not expose interviewer notes', 'Use approved rejection template'],
    },

    // Scenario 5: Low urgency - continue monitoring
    {
      id: 'test-05',
      name: 'Test Scenario 5',
      description: 'Recent activity, no issues.',
      candidate: {
        id: uuidv4(),
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        stage: 'Technical Interview',
        position: 'Backend Developer',
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        daysInactive: 1,
        slaBreached: false,
        feedback: { submitted: 0, required: 2 },
        candidateFollowUps: 0,
        hiringManagerActive: true,
      },
      expectedDecision: 'wait',
      expectedActions: ['Monitor', 'Check in 24h'],
    },
  ];
}

/**
 * Default policies
 */
export function getDefaultPolicies() {
  return [
    {
      id: uuidv4(),
      name: 'Never Auto-Reject',
      description: 'Never automatically reject a candidate without human approval.',
      rule: 'never_reject_automatically',
      active: true,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: '48-Hour Communication SLA',
      description: 'Notify candidate within 48 hours of any stage change.',
      rule: 'notify_after_48h',
      active: true,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Escalate on Multiple Follow-ups',
      description: 'If candidate follows up twice, prioritize and escalate.',
      rule: 'escalate_on_followup',
      active: true,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Protect Internal Feedback',
      description: 'Never expose internal interviewer feedback to candidates.',
      rule: 'never_expose_feedback',
      active: true,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Chase Missing Feedback',
      description: 'Automatically remind interviewers if feedback is overdue by 48h.',
      rule: 'chase_feedback_48h',
      active: true,
      createdAt: new Date(),
    },
  ];
}
