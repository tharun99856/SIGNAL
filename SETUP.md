# Signal Agent - Setup Guide

## Quick Start

### Prerequisites
- Node.js 20+ 
- npm

### Installation

```bash
# 1. Clone repo
git clone <repo-url>
cd signal-agent

# 2. Install dependencies
cd app
npm install

# 3. Start application
npm run dev:all
```

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:3001

### Pages
- Landing: http://localhost:3000
- Dashboard: http://localhost:3000/agent
- Metrics: http://localhost:3000/agent/metrics

## Development

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

**Both (recommended):**
```bash
npm run dev:all
```

## Project Structure

```
app/
├── src/                     # React frontend
│   ├── pages/              # Dashboard, case detail, metrics
│   ├── components/         # UI components
│   └── hooks/              # Custom hooks
│
├── server/                 # Express backend
│   ├── engine/             # 🧠 Decision Engine
│   ├── routes/             # API endpoints
│   └── data/               # Mock data + tests
│
└── public/                 # Static assets
```

## API Endpoints

**Cases:**
- `GET /api/cases` - List all
- `GET /api/cases/:id` - Details
- `POST /api/cases/:id/decide` - Re-evaluate
- `POST /api/cases/:id/override` - Human override

**Policies:**
- `GET /api/policies` - List all

**Metrics:**
- `GET /api/metrics` - Dashboard metrics

**Testing:**
- `POST /api/simulate` - Run test scenarios

## Testing

**Via API:**
```bash
# Get cases
curl http://localhost:3001/api/cases

# Run test scenarios
curl -X POST http://localhost:3001/api/simulate

# Check metrics
curl http://localhost:3001/api/metrics
```

**Via command line:**
```bash
node run_comprehensive_tests.js
```

**Via UI:**
- Dashboard: http://localhost:3000/agent
- Click any case to see decision reasoning
- Metrics: http://localhost:3000/agent/metrics
