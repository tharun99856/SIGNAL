/**
 * Comprehensive Test Runner for Decision Engine
 * 
 * Loads CSV test cases and runs them through the decision engine
 * Outputs detailed accuracy report
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import from app directory
const appPath = join(__dirname, 'app');
const { DecisionEngine } = await import(pathToFileURL(join(appPath, 'server/engine/DecisionEngine.js')).href);
const { getDefaultPolicies } = await import(pathToFileURL(join(appPath, 'server/data/mockData.js')).href);

// Simple UUID generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const testCases = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    
    testCases.push({
      stage: values[0],
      days_inactive: parseInt(values[1]),
      sla_breached: values[2] === 'true',
      feedback_submitted: parseInt(values[3]),
      feedback_required: parseInt(values[4]),
      candidate_followups: parseInt(values[5]),
      hiring_manager_active: values[6] === 'true',
      expected_decision: values[7].replace(/"/g, ''),  // Remove quotes
      scenario_description: values[8] ? values[8].replace(/"/g, '') : 'Test case'
    });
  }
  
  return testCases;
}

// Convert test case to candidate format
function testCaseToCandidate(testCase) {
  return {
    id: uuidv4(),
    name: 'Test Candidate',
    stage: testCase.stage,
    daysInactive: testCase.days_inactive,
    slaBreached: testCase.sla_breached,
    feedback: {
      submitted: testCase.feedback_submitted,
      required: testCase.feedback_required
    },
    candidateFollowUps: testCase.candidate_followups,
    hiringManagerActive: testCase.hiring_manager_active
  };
}

// Run all tests
async function runTests(csvPath) {
  console.log('\n🧪 COMPREHENSIVE TEST SUITE\n');
  console.log('Loading test cases from CSV...');
  
  const testCases = parseCSV(csvPath);
  console.log(`✅ Loaded ${testCases.length} test cases\n`);
  
  const policies = getDefaultPolicies();
  const engine = new DecisionEngine(policies);
  
  let correct = 0;
  let total = 0;
  const failures = [];
  const categoryResults = {};
  
  console.log('Running tests...\n');
  
  for (const testCase of testCases) {
    const candidate = testCaseToCandidate(testCase);
    const evaluation = await engine.evaluate(candidate, 'supervised');
    const actual = evaluation.decision.type;
    const expected = testCase.expected_decision;
    
    const isCorrect = actual === expected;
    if (isCorrect) {
      correct++;
    } else {
      failures.push({
        testCase,
        expected,
        actual,
        reason: evaluation.decision.reason
      });
    }
    
    // Track by category
    const category = testCase.scenario_description.split(':')[0] || 'Other';
    if (!categoryResults[category]) {
      categoryResults[category] = { correct: 0, total: 0 };
    }
    categoryResults[category].total++;
    if (isCorrect) categoryResults[category].correct++;
    
    total++;
    
    // Progress indicator
    if (total % 100 === 0) {
      console.log(`  Progress: ${total}/${testCases.length} (${((correct/total)*100).toFixed(1)}% so far)`);
    }
  }
  
  // Final results
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${total}`);
  console.log(`Correct: ${correct}`);
  console.log(`Incorrect: ${total - correct}`);
  console.log(`Accuracy: ${((correct/total)*100).toFixed(2)}%`);
  console.log('='.repeat(60));
  
  // Category breakdown
  console.log('\n📋 RESULTS BY CATEGORY:');
  console.log('-'.repeat(60));
  Object.keys(categoryResults).sort().forEach(category => {
    const stats = categoryResults[category];
    const accuracy = ((stats.correct / stats.total) * 100).toFixed(1);
    console.log(`${category.padEnd(40)} ${stats.correct}/${stats.total} (${accuracy}%)`);
  });
  
  // Show first 10 failures
  if (failures.length > 0) {
    console.log('\n❌ SAMPLE FAILURES (First 10):');
    console.log('-'.repeat(60));
    failures.slice(0, 10).forEach((failure, i) => {
      console.log(`\n${i+1}. ${failure.testCase.scenario_description}`);
      console.log(`   Expected: ${failure.expected}`);
      console.log(`   Got: ${failure.actual}`);
      console.log(`   Reason: ${failure.reason}`);
    });
  }
  
  console.log('\n✅ Test run complete!\n');
  
  return {
    total,
    correct,
    incorrect: total - correct,
    accuracy: ((correct/total)*100).toFixed(2),
    categoryResults,
    failures
  };
}

// Run with provided CSV path
const csvPath = process.argv[2] || './app/server/data/recruiting-decision-test-cases.csv';
runTests(csvPath).catch(console.error);
