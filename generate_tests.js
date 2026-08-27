/**
 * Generate 1000 test cases programmatically
 * Based on the patterns from your CSV
 */

import fs from 'fs';

const stages = ['Resume Review', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Background Check', 'Offer Discussion', 'Rejected'];

function generateTestCases() {
  const cases = [];
  
  // Header
  cases.push('stage,days_inactive,sla_breached,feedback_submitted,feedback_required,candidate_followups,hiring_manager_active,expected_decision,scenario_description');
  
  // 1. Standard progression (300 cases) - WAIT
  for (let i = 0; i < 300; i++) {
    const stage = stages[Math.floor(Math.random() * 6)]; // Not rejected
    const days = Math.floor(Math.random() * 3) + 1; // 1-3 days
    const feedback_req = Math.floor(Math.random() * 4) + 1;
    const feedback_sub = Math.floor(Math.random() * feedback_req);
    
    cases.push(`${stage},${days},false,${feedback_sub},${feedback_req},0,${Math.random() > 0.5},"wait","${stage}: progressing normally, no urgency yet"`);
  }
  
  // 2. Feedback complete + days waiting (200 cases) - ACT
  for (let i = 0; i < 200; i++) {
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = Math.floor(Math.random() * 7) + 3; // 3-10 days
    const feedback_req = Math.floor(Math.random() * 4) + 1;
    
    cases.push(`${stage},${days},${days >= 6},${feedback_req},${feedback_req},0,${Math.random() > 0.5},"act","Feedback complete, candidate waiting ${days} days"`);
  }
  
  // 3. Inactive + SLA breach (200 cases) - ACT
  for (let i = 0; i < 200; i++) {
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = Math.floor(Math.random() * 5) + 6; // 6-10 days
    const feedback_req = Math.floor(Math.random() * 5) + 1;
    const feedback_sub = Math.floor(Math.random() * feedback_req);
    
    cases.push(`${stage},${days},true,${feedback_sub},${feedback_req},0,${Math.random() > 0.5},"act","Inactive ${days} days, workflow needs a push"`);
  }
  
  // 4. SLA breach + missing feedback (100 cases) - ACT
  for (let i = 0; i < 100; i++) {
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = Math.floor(Math.random() * 6) + 6; // 6-11 days
    const feedback_req = Math.floor(Math.random() * 4) + 2;
    const feedback_sub = Math.floor(Math.random() * (feedback_req - 1));
    const missing = feedback_req - feedback_sub;
    
    cases.push(`${stage},${days},true,${feedback_sub},${feedback_req},0,${Math.random() > 0.5},"act","SLA breach (${days}d), missing ${missing} of ${feedback_req} feedback — chase interviewers"`);
  }
  
  // 5. Rejected candidate follow-ups (150 cases) - ESCALATE
  for (let i = 0; i < 150; i++) {
    const days = Math.floor(Math.random() * 10) + 1;
    const followups = Math.floor(Math.random() * 10) + 1;
    const feedback_req = Math.floor(Math.random() * 3);
    
    cases.push(`Rejected,${days},${days > 5},${feedback_req},${feedback_req},${followups},${Math.random() > 0.5},"escalate","Rejected candidate follow-up #${followups} — sensitive inquiry"`);
  }
  
  // 6. Multiple candidate follow-ups (100 cases) - ESCALATE
  for (let i = 0; i < 100; i++) {
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = Math.floor(Math.random() * 15) + 1;
    const followups = Math.floor(Math.random() * 8) + 3; // 3-10 follow-ups
    const feedback_req = Math.floor(Math.random() * 5) + 1;
    const feedback_sub = Math.floor(Math.random() * feedback_req);
    
    cases.push(`${stage},${days},${days > 5},${feedback_sub},${feedback_req},${followups},${Math.random() > 0.5},"escalate","${followups} candidate follow-ups on ${stage.toLowerCase()} — repeated attempts"`);
  }
  
  // 7. Boundary tests (100 cases) - Mixed
  for (let i = 0; i < 50; i++) {
    // Edge case: feedback complete at boundary
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = [3, 5, 6, 7][Math.floor(Math.random() * 4)];
    const feedback_req = Math.floor(Math.random() * 4) + 1;
    const expected = days >= 6 ? 'act' : (days >= 3 && feedback_req > 0 ? 'act' : 'wait');
    
    cases.push(`${stage},${days},${days >= 6},${feedback_req},${feedback_req},0,${Math.random() > 0.5},"${expected}","Boundary test: ${days}d inactive, feedback complete"`);
  }
  
  for (let i = 0; i < 50; i++) {
    // Edge case: extreme delays
    const stage = stages[Math.floor(Math.random() * 6)];
    const days = [0, 12, 30][Math.floor(Math.random() * 3)];
    const feedback_req = Math.floor(Math.random() * 4) + 1;
    const feedback_sub = Math.floor(Math.random() * feedback_req);
    const expected = days === 0 ? 'wait' : 'escalate';
    
    cases.push(`${stage},${days},${days > 0},${feedback_sub},${feedback_req},0,${Math.random() > 0.5},"${expected}","Boundary test: ${days}d inactive, feedback incomplete"`);
  }
  
  // 8. Stress tests (50 cases) - ESCALATE
  for (let i = 0; i < 50; i++) {
    const stage = stages[Math.floor(Math.random() * 7)]; // Include rejected
    const days = Math.floor(Math.random() * 25) + 15; // 15-40 days
    const followups = Math.floor(Math.random() * 15);
    const feedback_req = Math.floor(Math.random() * 5) + 1;
    const feedback_sub = Math.floor(Math.random() * feedback_req);
    
    cases.push(`${stage},${days},true,${feedback_sub},${feedback_req},${followups},${Math.random() > 0.5},"escalate","Stress: combined red flags (long delay + missing feedback + repeated follow-ups)"`);
  }
  
  return cases.join('\n');
}

// Generate and save
const csvContent = generateTestCases();
fs.writeFileSync('./app/server/data/test_cases_1000.csv', csvContent);
console.log('✅ Generated 1000 test cases in test_cases_1000.csv');
console.log(`Total lines: ${csvContent.split('\n').length}`);
