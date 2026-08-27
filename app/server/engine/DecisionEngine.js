/**
 * Signal Agent Decision Engine
 * 
 * Core AI autonomy framework that decides:
 * - When to ACT (execute automatically)
 * - When to ASK (request clarification)
 * - When to ESCALATE (require human judgment)
 * - When to WAIT (monitor and check later)
 * 
 * This is the core intellectual property of Signal Agent.
 * 
 * Workflow:
 * 1. CONTEXT GATHERING - Analyze candidate/workflow state
 * 2. POLICY CHECK - Verify against guardrails
 * 3. RISK ASSESSMENT - Calculate confidence (0-100)
 * 4. DECISION - Choose action type
 * 5. ACTION LOGGING - Track for transparency
 * 
 * @module DecisionEngine
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
export class DecisionEngine {
  constructor(policies = []) {
    this.policies = policies;
  }

  /**
   * Main decision method
   */
  async evaluate(candidate, autonomyLevel = 'supervised') {
    const context = this.gatherContext(candidate);
    const policyChecks = this.checkPolicies(context);
    const risk = this.assessRisk(context, policyChecks);
    const decision = this.makeDecision(context, risk, policyChecks, autonomyLevel);

    return {
      id: uuidv4(),
      candidate,
      decision,
      context,
      policyChecks,
      risk,
      timestamp: new Date(),
    };
  }

  /**
   * Step 1: Gather context from candidate data
   */
  gatherContext(candidate) {
    return {
      candidateId: candidate.id,
      stage: candidate.stage,
      daysInactive: candidate.daysInactive,
      slaBreached: candidate.slaBreached,
      feedbackComplete: candidate.feedback.submitted === candidate.feedback.required,
      feedbackMissing: candidate.feedback.required - candidate.feedback.submitted,
      candidateFollowUps: candidate.candidateFollowUps,
      hiringManagerActive: candidate.hiringManagerActive,
      urgency: this.calculateUrgency(candidate),
    };
  }

  /**
   * Calculate urgency score (0-100)
   */
  calculateUrgency(candidate) {
    let score = 0;
    
    // Days inactive
    if (candidate.daysInactive >= 6) score += 40;
    else if (candidate.daysInactive >= 5) score += 30;
    else if (candidate.daysInactive >= 3) score += 20;
    
    // SLA breach
    if (candidate.slaBreached) score += 30;
    
    // Candidate follow-ups
    score += Math.min(candidate.candidateFollowUps * 10, 20);
    
    // Missing feedback
    const feedbackRatio = candidate.feedback.submitted / candidate.feedback.required;
    if (feedbackRatio < 0.5) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Step 2: Check policies/guardrails
   */
  checkPolicies(context) {
    const results = [];

    for (const policy of this.policies) {
      if (!policy.active) continue;

      const check = this.evaluatePolicy(policy, context);
      results.push({
        policyId: policy.id,
        policyName: policy.name,
        passed: check.passed,
        reason: check.reason,
      });
    }

    return results;
  }

  /**
   * Evaluate a single policy
   */
  evaluatePolicy(policy, context) {
    // Simple rule evaluation (in production, use a proper rules engine)
    const { rule } = policy;

    // Example policy rules:
    if (rule.includes('never_reject_automatically')) {
      return { passed: true, reason: 'No automatic rejection attempted' };
    }

    if (rule.includes('notify_after_48h') && context.daysInactive >= 2) {
      return { passed: true, reason: 'Candidate waiting >48h, notification triggered' };
    }

    if (rule.includes('escalate_on_followup') && context.candidateFollowUps >= 2) {
      return { passed: true, reason: 'Multiple follow-ups detected, escalation required' };
    }

    if (rule.includes('never_expose_feedback')) {
      return { passed: true, reason: 'Internal feedback protected' };
    }

    return { passed: true, reason: 'Policy not applicable' };
  }

  /**
   * Step 3: Assess risk
   */
  assessRisk(context, policyChecks) {
    let confidence = 100;

    // Reduce confidence based on missing information
    if (!context.feedbackComplete) confidence -= 20;
    if (!context.hiringManagerActive) confidence -= 15;
    if (context.candidateFollowUps > 2) confidence -= 10;

    // Policy violations reduce confidence
    const failedPolicies = policyChecks.filter(p => !p.passed);
    confidence -= failedPolicies.length * 25;

    return {
      confidence: Math.max(confidence, 0),
      level: confidence > 70 ? 'low' : confidence > 40 ? 'medium' : 'high',
      factors: this.getRiskFactors(context, policyChecks),
    };
  }

  getRiskFactors(context, policyChecks) {
    const factors = [];

    if (context.slaBreached) factors.push('SLA breached');
    if (!context.feedbackComplete) factors.push(`${context.feedbackMissing} feedback missing`);
    if (context.candidateFollowUps >= 2) factors.push('Multiple candidate follow-ups');
    if (!context.hiringManagerActive) factors.push('Hiring manager inactive');

    const failedPolicies = policyChecks.filter(p => !p.passed);
    if (failedPolicies.length > 0) {
      factors.push(`${failedPolicies.length} policy violation(s)`);
    }

    return factors;
  }

  /**
   * Step 4: Make decision (ACT / ASK / ESCALATE / WAIT)
   */
  makeDecision(context, risk, policyChecks, autonomyLevel) {
    const { urgency } = context;
    const { confidence } = risk;

    // FIX #1: Rejected candidate inquiries always escalate (sensitive)
    if (context.stage === 'Rejected' && context.candidateFollowUps > 0) {
      return {
        type: 'escalate',
        reason: 'Rejected candidate inquiry - sensitive communication required',
        actions: [
          'Escalate to recruiter immediately',
          'Never expose internal feedback or rejection reasons',
          'Use approved rejection communication template',
        ],
        confidence: 90,
        requiresApproval: false,
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // Critical: immediate human escalation
    if (context.candidateFollowUps >= 3 || urgency >= 90) {
      return {
        type: 'escalate',
        reason: 'Critical situation requires immediate human attention',
        actions: [
          'Escalate to recruiter immediately',
          'Include full context and candidate history',
          'Request same-day resolution',
        ],
        confidence,
        requiresApproval: false,
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // High urgency but missing feedback
    if (urgency >= 70 && !context.feedbackComplete) {
      return {
        type: 'act',
        reason: 'SLA breach imminent. Chase missing feedback and update candidate.',
        actions: [
          `Remind ${context.feedbackMissing} interviewer(s) to submit feedback`,
          'Set 24-hour deadline',
          'Send candidate holding update',
          'Schedule follow-up check in 24h',
        ],
        confidence,
        requiresApproval: autonomyLevel === 'supervised',
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // FIX #2: Feedback complete + waiting >72h = ACT (advance workflow)
    if (context.feedbackComplete && context.daysInactive >= 3) {
      return {
        type: 'act',
        reason: 'All feedback complete and candidate waiting. Ready to advance workflow.',
        actions: [
          'Send candidate status update',
          'Notify hiring manager decision is ready',
          'Advance workflow to next stage',
        ],
        confidence: 85,
        requiresApproval: autonomyLevel === 'supervised' || autonomyLevel === 'recommend',
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // Moderate urgency, feedback complete
    if (urgency >= 50 && context.feedbackComplete) {
      return {
        type: 'act',
        reason: 'Feedback complete. Ready to advance or communicate decision.',
        actions: [
          'Send candidate status update',
          'Notify hiring manager to make decision',
          'Advance workflow if decision is ready',
        ],
        confidence,
        requiresApproval: autonomyLevel === 'supervised' || autonomyLevel === 'recommend',
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // Low confidence - ask for clarification
    if (confidence < 50) {
      return {
        type: 'ask',
        reason: 'Insufficient information or policy conflicts detected.',
        actions: [
          'Request clarification from recruiter',
          'Provide context and options',
          'Wait for human decision',
        ],
        confidence,
        requiresApproval: true,
        autonomyLevel,
        policiesChecked: policyChecks.map(p => p.policyName),
      };
    }

    // Default: wait and monitor
    return {
      type: 'wait',
      reason: 'Situation not urgent. Continue monitoring.',
      actions: [
        'Monitor for changes',
        'Check again in 24 hours',
        'Alert if urgency increases',
      ],
      confidence,
      requiresApproval: false,
      autonomyLevel,
      policiesChecked: policyChecks.map(p => p.policyName),
    };
  }
}
