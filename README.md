# Signal Agent

AI decision engine that automates recruiting workflow decisions.

## What It Does

Signal Agent watches recruiting workflows and decides when to act, when to wait, and when to escalate to humans. It handles routine decisions (chase missing feedback, update candidates) so ops teams can focus on edge cases.

## Quick Start

```bash
cd app
npm install
npm run dev:all
```

Frontend: http://localhost:3000  
Backend: http://localhost:3001

## Features

**Dashboard**: View all cases with status (Resolved, Waiting, Escalated, Pending)

**Case Details**: See signals detected, agent decision + reasoning, planned actions, action log

**Metrics**: SLA breaches prevented, response time, autonomous resolution rate, escalation accuracy

## How It Works

```
Workflow state → Analyze context → Check policies → Calculate urgency → Decide → Act/Wait/Escalate
```

Decision framework:
- **ACT**: High urgency + clear action (e.g., 6+ days inactive, feedback complete)
- **ESCALATE**: Sensitive situations (rejected candidate inquiry, 3+ follow-ups, extreme delays)
- **WAIT**: Normal progression, no urgency
- **ASK**: Ambiguous situations needing human input

Rules:
- **100% rule-based** (no LLM, no machine learning—pure deterministic logic)
- Policy-constrained (e.g., never auto-reject candidates)
- Confidence-scored
- Human override enabled

## Project Structure

```
app/
├── src/                    # React frontend
│   ├── pages/             # Dashboard, case detail, metrics
│   └── components/        # UI components
├── server/                # Express backend
│   ├── engine/
│   │   └── DecisionEngine.js    # Core decision logic
│   ├── routes/            # API endpoints
│   └── data/              # Mock data + test cases
└── public/                # Static assets
```

## API Endpoints

```
GET  /api/cases              # List all cases
GET  /api/cases/:id          # Case details
POST /api/cases/:id/decide   # Re-evaluate case
POST /api/cases/:id/override # Human override

GET  /api/policies           # List policies
GET  /api/metrics            # Dashboard metrics
POST /api/simulate           # Run test scenarios
```

## Tech Stack

**Frontend**: React 19, TypeScript, Vite, Tailwind, shadcn/ui  
**Backend**: Node.js, Express  
**Data**: In-memory (mock data for MVP demo)

## Testing

Run comprehensive tests:
```bash
node run_comprehensive_tests.js
```

1000 test scenarios covering:
- Standard workflow progression
- SLA breaches + missing feedback
- Candidate follow-ups + complaints
- Edge cases (0 days, 30+ days, rejected candidates)
- Stress tests (extreme delays + combined red flags)

Results documented in [TEST_RESULTS.md](TEST_RESULTS.md)

## Why This Matters

Most AI tools generate content (emails, summaries). This automates operational decisions.

The hard problem: **When should AI act vs. ask vs. stop?**

This system:
- Shows transparent reasoning (not a black box)
- Enforces policy boundaries (e.g., never auto-reject)
- Measures correctness (not just fluency)
- Enables human override with learning

Applies to any ops workflow: support tickets, incident management, compliance approvals, etc.

## License

MIT License - See [LICENSE](LICENSE)

---

**Signal Agent** - Automate operational decisions, not just content generation.
