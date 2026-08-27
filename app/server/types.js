/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} stage
 * @property {string} position
 * @property {Date} lastActivity
 * @property {number} daysInactive
 * @property {boolean} slaBreached
 * @property {Object} feedback
 * @property {number} feedback.submitted
 * @property {number} feedback.required
 * @property {number} candidateFollowUps
 * @property {boolean} hiringManagerActive
 */

/**
 * @typedef {'observe' | 'recommend' | 'supervised' | 'autonomous'} AutonomyLevel
 */

/**
 * @typedef {'act' | 'ask' | 'escalate' | 'wait'} DecisionType
 */

/**
 * @typedef {Object} Decision
 * @property {DecisionType} type
 * @property {string} reason
 * @property {Array<string>} actions
 * @property {number} confidence
 * @property {boolean} requiresApproval
 * @property {Array<string>} policiesChecked
 * @property {string} autonomyLevel
 */

/**
 * @typedef {Object} Policy
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} rule
 * @property {boolean} active
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Case
 * @property {string} id
 * @property {Candidate} candidate
 * @property {Decision} decision
 * @property {'pending' | 'resolved' | 'escalated' | 'waiting'} status
 * @property {Array<ActionLog>} actionLog
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} ActionLog
 * @property {string} id
 * @property {Date} timestamp
 * @property {string} action
 * @property {string} actor
 * @property {Object} metadata
 */

export {};
